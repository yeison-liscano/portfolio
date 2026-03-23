---
title: MCP
pubDate: 2026-03-22
description:
  "Lessons from building a remote MCP server. Challenges with stateful sessions,
  input validation, scoped tool access, and authorization in production."
tags: ["ai", "python"]
isDraft: true
snippet:
  language: "python"
  code: "from http_mcp import Server"
---

The Model Context Protocol has become the standard for granting AI agents access
to external resources. It defines the methods and message format (JSON-RPC) for
accessing and triggering the execution of functions (tools) and instructions
(prompts).

I have been working on MCP implementation and here I will share the challenges I
faced while building a production-grade remote MCP server.

## What is MCP?

For those unfamiliar with MCP, it's a protocol developed by Anthropic that
standardizes how AI models (Claude, or other LLMs) interact with external tools
and data sources. Instead of hardcoding integrations into models, MCP allows you
to define a contract: the client (AI agent) sends requests in a standard format,
and the server responds with results.

The protocol supports:

- **Tools**: Functions the AI can call to perform actions or fetch data
- **Prompts**: Reusable instruction templates for specific tasks
- **Resources**: Exposing data or systems for the AI to access

This abstraction means an AI can use the same interface whether it's calling a
local function, a remote API, or a database query.

## Stateful Sessions: A Scaling Problem

![GitHub Discussion Comment About session lost on multiple workers environment](./images/mcp_session_lost_discussion.png)

[GitHub Discussion Link](https://github.com/modelcontextprotocol/python-sdk/issues/520#issuecomment-2808158583)

The early versions of the MCP Python SDK maintained session state across
requests. This creates a critical problem in horizontally scaled environments:
if your MCP server runs on multiple workers (load-balanced), each request might
hit a different worker instance. Session data stored on Worker A is invisible to
Worker B, causing the session to be lost and the AI agent's context to break.

This is a fundamental architectural issue. Here's why it's problematic:

1. **Load Balancers**: In production, HTTP requests from multiple clients get
   distributed across different server instances
2. **Stateless Design Principle**: Web services should be stateless so any
   instance can handle any request
3. **Horizontal Scaling**: You can't scale horizontally if every instance needs
   to remember its own state

The solution was to implement a **stateless HTTP transport** that treats each
request as independent. Instead of maintaining session objects in memory, the
transport sends all necessary context in each request.

```python
# Example of stateless transport - each request is self-contained
from http_mcp import Server

server = Server("my-tool-server")

@server.tool()
def fetch_user_data(user_id: str) -> dict:
    """Fetch user information"""
    return {
        "id": user_id,
        "name": "John Doe",
        "email": "john@example.com"
    }

# No session management needed - each HTTP request is independent
# The client includes all needed context in each request
```

This stateless design became the foundation for my `http-mcp` package on PyPI,
which you can find here:
[https://pypi.org/project/http-mcp/](https://pypi.org/project/http-mcp/)

## Remote MCP Architecture: HTTP vs Stdio

MCP supports two transport mechanisms:

- **Stdio Transport**: The MCP server runs as a subprocess on the same machine,
  communicating via standard input/output. This is simple for local
  integrations.
- **HTTP Transport**: The MCP server runs as a separate service (often remote),
  communicating over HTTP. This enables true separation of concerns and
  horizontal scaling.

For production systems, HTTP transport is more practical. It allows:

- Separate deployment and scaling of the MCP server
- Easier monitoring and logging
- Integration with load balancers and service meshes
- Language-agnostic communication

The trade-off is complexity: you must handle network errors, timeouts, and
ensure your protocol is truly stateless.

## Challenge 1: Input Validation - Fail vs Teach

When implementing tools, you'll receive inputs from the AI agent. These inputs
are specified by your schema but often have validation constraints (types,
ranges, required fields, etc.).

A naive approach: return an error when validation fails.

A better approach: return a helpful error message that teaches the AI agent what
went wrong, so it can correct its own request.

```python
# Bad: Raw validation error
@server.tool()
def create_user(email: str, age: int) -> dict:
    """Create a new user"""
    # If validation fails, Pydantic throws an exception
    # The AI sees: "ValueError: invalid literal for int()"
    # The AI has no idea how to fix it
    return {"success": True}

# Good: Helpful error feedback
from pydantic import BaseModel, ValidationError

class UserInput(BaseModel):
    email: str
    age: int

@server.tool()
def create_user(email: str, age: int) -> dict:
    """Create a new user"""
    try:
        user_input = UserInput(email=email, age=age)
    except ValidationError as e:
        # Return the errors in a format the AI can understand
        errors = [
            f"Field '{field}': {error['msg']}"
            for field, error_list in e.errors()
            for error in [error_list[0]] if isinstance(error_list, list)
        ]
        return {
            "success": False,
            "error": "Input validation failed",
            "details": errors,
            "hint": "Please check that age is an integer and email is valid"
        }

    # Now proceed with valid input
    return {"success": True, "user_id": "123"}
```

When the AI agent receives a validation error with context, it can adjust its
next attempt. This saves round-trips and makes the interaction more efficient.

## Challenge 2: Context-Based Tool Exposure

Not all tools should be available to all callers. You might want:

- Public tools (no auth required): "weather" tool anyone can use
- Private tools (auth required): "delete user" tool only admins can use
- Scoped tools: Different tools for different contexts or user roles

I solved this by leveraging Starlette's scope system. Each HTTP request carries
scope metadata (user, role, permissions). Tools can require specific scope
attributes.

```python
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

# Middleware to attach user context to the scope
class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Extract user info from headers, JWT, etc.
        user_id = request.headers.get("X-User-ID", "anonymous")
        user_role = request.headers.get("X-User-Role", "guest")

        # Store in scope for tools to access
        request.scope["user_id"] = user_id
        request.scope["user_role"] = user_role

        response = await call_next(request)
        return response

# Tool definition with scope requirements
from http_mcp import Server, requires_scope

server = Server("my-tool-server")

@server.tool()
def get_weather(location: str) -> dict:
    """Get weather for a location - public tool"""
    return {"location": location, "temp": 72, "condition": "sunny"}

@server.tool(required_scopes=["authenticated"])
def list_user_resources(user_id: str) -> list:
    """List resources for authenticated users"""
    return [f"resource_{i}" for i in range(5)]

@server.tool(required_scopes=["admin"])
def delete_user(user_id: str) -> dict:
    """Delete a user - admin only"""
    return {"success": True, "deleted_user_id": user_id}

# When the client calls "delete_user", the server checks:
# "Does this request have 'admin' in required scopes?"
# If not, return a permission error instead of executing the tool
```

This approach has several benefits:

- Tools are self-documenting about their requirements
- Authorization is centralized and consistent
- You can change permissions without modifying tool code
- The AI agent can query which tools are available in its current context

## Challenge 3: Authorization Verification

Exposing a tool doesn't mean it can be used in all ways. A practical example:

A `fetch_user_records` tool might be available to authenticated users, but users
should only access their own records, not everyone's data.

```python
# Tool with fine-grained authorization
@server.tool(required_scopes=["authenticated"])
def fetch_user_records(user_id: str) -> dict:
    """Fetch records for a user"""
    # At this point, we know the request is authenticated
    # But we still need to verify the AI agent is accessing the right user

    # Get the actual authenticated user from request scope
    request_user_id = get_request_scope()["user_id"]

    # Authorization check: Can this request access this user's data?
    if user_id != request_user_id and get_request_scope()["user_role"] != "admin":
        return {
            "success": False,
            "error": "Unauthorized",
            "message": f"You can only access your own records (user_id: {request_user_id})"
        }

    # Authorization passed - fetch and return data
    records = database.query(f"SELECT * FROM records WHERE user_id = {user_id}")
    return {
        "success": True,
        "records": records
    }
```

The pattern is:

1. **Scope/Authentication**: Is the caller authenticated and allowed to use this
   tool? (handled by middleware/decorators)
2. **Authorization**: Does the caller have permission to perform this specific
   action with these parameters? (checked inside the tool)

This two-layer approach keeps concerns separated and makes authorization logic
easy to test.

## Lessons Learned

Building a production MCP server taught me several things:

1. **Stateless by Default**: Design your server assuming instances are
   ephemeral. This makes scaling trivial.

2. **Error Messages as Feedback Loops**: The AI agent learns from error
   messages. Make them helpful and specific. Generic errors cause retries and
   wasted tokens.

3. **Explicit Permissions**: Don't rely on implicit access control. Make scope
   requirements visible in tool definitions. This prevents accidental security
   holes.

4. **Separate Concerns**: Keep authentication (who are you?) separate from
   authorization (what can you do?). This clarity prevents bugs.

5. **Protocol-First Design**: The MCP protocol is a contract between client and
   server. Define it well upfront. Changes to tool schemas or behavior require
   careful versioning.

## References

- **Official MCP Specification**:
  [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **My HTTP Transport Implementation**:
  [http-mcp on PyPI](https://pypi.org/project/http-mcp/)
- **Stateless Sessions Discussion**:
  [Python SDK GitHub Issue #520](https://github.com/modelcontextprotocol/python-sdk/issues/520#issuecomment-2808158583)

Building MCP servers is still a relatively new domain, but the patterns are
emerging. If you're planning to expose tools to AI agents in production, I hope
these lessons save you some debugging time.
