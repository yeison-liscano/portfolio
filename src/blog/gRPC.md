---
title: gRPC
pubDate: 2026-03-22
description:
  "An introduction to gRPC: how it works, its trade-offs against REST APIs, and
  how to define services with Protocol Buffers. Includes Python examples."
tags: ["programming", "web"]
isDraft: true
---

## What is gRPC?

gRPC is a modern, open-source, high-performance remote procedure call (RPC)
framework developed by Google that enables seamless communication between
clients and servers across languages. It commonly uses Protocol Buffers for
service definitions and message serialization, and native gRPC uses HTTP/2. REST
is an architectural style, not a competing transport protocol; REST APIs can
also use HTTP/2 or HTTP/3 and typed schemas.

gRPC provides generated client and server interfaces for distributed services.
Its name is not a reliable expansion of «Google RPC»: the project has used
different meanings for the letter g across releases.

At its core, gRPC allows you to define services as if you were calling functions
locally, even though the code runs on a different machine. This abstraction
simplifies call syntax, but a remote call still has latency, deadlines and
partial-failure behavior that a local call does not.

## Why use gRPC?

### Performance

Native gRPC uses HTTP/2 framing, multiplexed streams and header compression.
These can reduce overhead, especially with reused connections and compact
messages. There is no general 7–10× throughput advantage over REST: results
depend on transport versions, payloads, serialization, caching and runtime.

### HTTP/2 Advantages

Multiplexing lets several streams share one connection without waiting for an
entire HTTP response to finish. It removes HTTP/1.1 response-order blocking on
that connection, but **TCP packet loss can still stall all streams**. HTTP/2
server push is not what implements gRPC server-streaming RPCs. See
[RFC 9113](https://www.rfc-editor.org/rfc/rfc9113.html) and the
[gRPC RPC lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/).

### Streaming Support

gRPC provides native, first-class support for streaming in four distinct
communication patterns: unary (request-response), server streaming, client
streaming, and bidirectional streaming. This makes gRPC ideal for applications
that need to continuously push or pull data, such as real-time notifications,
live data feeds, or chat applications. HTTP APIs can also stream responses, for
example using server-sent events; gRPC adds a defined streaming RPC contract.

### Language-Agnostic

Protocol Buffers are language-neutral and version-flexible. You define your
service once in a `.proto` file, and code generators automatically produce
idiomatic code for over 10 programming languages, including Python, Go, Java,
C++, JavaScript, and Rust. This means a Python client can seamlessly communicate
with a Go server without any manual serialization work.

### Strongly Typed Contracts

Protocol Buffers define typed messages and generate language bindings. Binary
messages identify fields by number and wire type, not by field name. A schema
does not validate every business constraint, and compatible evolution still
requires discipline. JSON-based APIs can also validate contracts with schemas
and generate clients from OpenAPI.

## How gRPC Works

### Protocol Buffers

Protocol Buffers (protobuf) is Google's serialization format designed for
simplicity and efficiency. Instead of JSON or XML, protobuf uses a binary format
that can be compact and efficient to parse, depending on the data and
implementation. A `.proto` file defines the structure of messages and services
in a language-agnostic way.

Here's the basic anatomy of a `.proto` file:

```proto
syntax = "proto3";

// Define a message structure
message Person {
  string name = 1;
  int32 id = 2;
  string email = 3;
}

message GetPersonRequest { int32 id = 1; }
message Empty {}

// Define a service with RPC methods
service PersonService {
  rpc GetPerson (GetPersonRequest) returns (Person) {}
  rpc ListPeople (Empty) returns (stream Person) {}
}
```

The numbers (1, 2, 3) are field identifiers used in the binary encoding and must
remain consistent across versions for backward compatibility. Reserve removed
field numbers and names, and follow the
[protobuf schema-evolution rules](https://protobuf.dev/programming-guides/proto3/#updating).

### Service Definitions

In a `.proto` file, you define a `service` block containing RPC methods. Each
method specifies an input message type and output message type. The method
signature looks similar to a function definition, making it intuitive to
understand the contract between client and server.

### Code Generation

Once you've written your `.proto` files, the Protocol Buffer compiler (`protoc`)
generates language-specific code. For Python, it generates classes representing
messages; the gRPC compiler plugin generates client/server service bindings. You
then write the business logic in your language of choice, and the generated code
handles serialization, deserialization, and network transport.

## Protocol Buffers Example

Let's look at a practical `.proto` file for a simple user authentication
service:

```proto
syntax = "proto3";

package auth;

// Message for login requests
message LoginRequest {
  string username = 1;
  string password = 2;
}

// Message for login responses
message LoginResponse {
  bool success = 1;
  string token = 2;
  string message = 3;
}

// Message for logout
message LogoutRequest {
  string token = 1;
}

// Empty message
message Empty {}

// Service definition
service AuthService {
  // Unary RPC: single request, single response
  rpc Login (LoginRequest) returns (LoginResponse) {}

  // Server streaming: single request, stream of responses
  rpc ValidateToken (LoginRequest) returns (stream LoginResponse) {}

  // Client streaming: stream of requests, single response
  rpc RegisterUsers (stream LoginRequest) returns (LoginResponse) {}

  // Bidirectional streaming: stream of requests and responses
  rpc ChatSession (stream LoginRequest) returns (stream LoginResponse) {}

  rpc Logout (LogoutRequest) returns (Empty) {}
}
```

This file illustrates RPC cardinalities using authentication-themed messages;
reusing login credentials for chat or token validation is not a production
authentication design. The compiler will generate classes for `LoginRequest`,
`LoginResponse`, and stub implementations for both client and server.

## gRPC vs REST Comparison

Both gRPC and REST are valid choices for building distributed systems, but they
excel in different scenarios:

### REST Advantages

- **Simplicity**: REST is more straightforward to learn and implement for simple
  CRUD operations.
- **Browser Compatibility**: REST APIs are natively callable from browsers via
  fetch or XMLHttpRequest. gRPC requires special handling (gRPC-web) in
  browsers.
- **Debugging**: REST is easier to debug and test using standard tools like curl
  and Postman.
- **Public APIs**: REST is more familiar to developers integrating third-party
  APIs.

### Trade-offs for HTTP APIs

- JSON may be larger than protobuf, but compression and message shape matter.
- REST does not require HTTP/1.1; HTTP/2 and HTTP/3 can carry the same API.
- Streaming support and schema validation depend on the chosen tools and
  contract.
- Resource-oriented HTTP APIs can benefit from standard caching semantics.

### gRPC Advantages

- **Performance**: Compact messages and multiplexing can help; benchmark against
  equivalent transport, compression, runtime and workload settings.
- **Streaming**: Native, bidirectional streaming for real-time communication.
- **Type Safety**: Strong contracts defined in `.proto` files reduce runtime
  errors.
- **Code Generation**: Automatic, language-specific stubs eliminate boilerplate.
- **Schema Evolution**: Compatible changes are supported when field-number and
  type-compatibility rules are followed.

### gRPC Disadvantages

- **Learning Curve**: Requires understanding Protocol Buffers and async
  patterns.
- **Browser Support**: gRPC-web adds complexity for browser clients.
- **Debugging**: Binary format is harder to inspect than JSON.
- **Tooling**: Fewer standard tools compared to REST's curl and Postman
  ecosystem.

### Quick Comparison Table

| Feature        | REST-style HTTP API                    | Native gRPC                            |
| -------------- | -------------------------------------- | -------------------------------------- |
| Model          | Resources and HTTP semantics           | Named remote methods                   |
| Transport      | HTTP/1.1, HTTP/2 or HTTP/3             | HTTP/2                                 |
| Serialization  | JSON, XML, binary formats, etc.        | Usually Protocol Buffers               |
| Streaming      | Depends on API and client design       | Defined unary and streaming RPCs       |
| Contracts      | Optional schemas such as OpenAPI       | Service and message definitions        |
| Browser access | Browser HTTP APIs                      | Usually a gRPC-Web gateway/client      |
| Performance    | Depends on workload and implementation | Depends on workload and implementation |

## Types of gRPC Communication

gRPC supports four communication patterns. The following method declarations and
client calls are fragments: message types, stubs and input iterators must be
defined in the surrounding application. The greeting example below is complete.

### 1. Unary RPC

The simplest pattern: client sends one request, server sends one response. It
resembles a function call in syntax, but must handle network errors and
deadlines.

```proto
rpc GetUser (GetUserRequest) returns (User) {}
```

```python

# Client code
response = stub.GetUser(GetUserRequest(user_id=123))
```

### 2. Server Streaming

Client sends one request; server responds with a stream of messages. Useful for
server pushing data to clients.

```proto
rpc ListUsers (Empty) returns (stream User) {}
```

```python

# Client code
for user in stub.ListUsers(Empty()):
    print(user)
```

### 3. Client Streaming

Client sends a stream of messages; server responds with one message after
receiving all client messages. Useful for batch operations or gradual data
accumulation.

```proto
rpc UploadFiles (stream FileChunk) returns (UploadResponse) {}
```

```python

# Client code
def chunks():
    for chunk in file_chunks:
        yield FileChunk(data=chunk)

response = stub.UploadFiles(chunks())
```

### 4. Bidirectional Streaming

Both client and server send streams of messages, allowing for full-duplex
communication. Perfect for chat, gaming, or collaborative applications.

```proto
rpc Chat (stream Message) returns (stream Message) {}
```

```python

# Client code
def messages():
    while True:
        msg = input("Enter message: ")
        yield Message(text=msg)

for reply in stub.Chat(messages()):
    print(f"Server: {reply.text}")
```

## Practical Example: Greeting Service

Let's build a complete, working example of a simple greeting service with Python
gRPC code.

### Step 1: Define the Protocol Buffer File (`greeting.proto`)

```proto
syntax = "proto3";

package greeting;

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
  rpc SayHelloStream (stream HelloRequest) returns (stream HelloReply) {}
}
```

### Step 2: Generate Python Code

```bash
python -m pip install grpcio grpcio-tools
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. greeting.proto
```

This generates `greeting_pb2.py` (messages) and `greeting_pb2_grpc.py` (service
stubs).

### Step 3: Implement the Server

```python
import grpc
from concurrent import futures
import greeting_pb2
import greeting_pb2_grpc

class GreeterServicer(greeting_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        message = f'Hello, {request.name}!'
        return greeting_pb2.HelloReply(message=message)

    def SayHelloStream(self, request_iterator, context):
        for request in request_iterator:
            yield greeting_pb2.HelloReply(
                message=f'Hello, {request.name}!'
            )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    greeting_pb2_grpc.add_GreeterServicer_to_server(
        GreeterServicer(), server
    )
    server.add_insecure_port('127.0.0.1:50051')
    print("Server started on port 50051")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
```

### Step 4: Implement the Client

```python
import grpc
import greeting_pb2
import greeting_pb2_grpc

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = greeting_pb2_grpc.GreeterStub(channel)

        # Unary RPC
        response = stub.SayHello(greeting_pb2.HelloRequest(name='Alice'))
        print(f"Unary response: {response.message}")

        # Bidirectional streaming RPC
        def request_iterator():
            for name in ['Bob', 'Charlie', 'Diana']:
                yield greeting_pb2.HelloRequest(name=name)

        responses = stub.SayHelloStream(request_iterator())
        print("Stream responses:")
        for response in responses:
            print(f"  {response.message}")

if __name__ == '__main__':
    run()
```

Save the server as `server.py` and the client as `client.py`. This local demo
uses an insecure loopback connection. Remote deployments need appropriate TLS,
authentication and deadlines. See the
[gRPC Python quickstart](https://grpc.io/docs/languages/python/quickstart/).

To run this example:

1. Install dependencies: `pip install grpcio grpcio-tools`
2. Generate code from the `.proto` file
3. Run the server: `python server.py`
4. In another terminal, run the client: `python client.py`

## When to Use gRPC vs REST

### Use gRPC When

- Building microservices that communicate frequently and require low latency.
- Real-time features like live notifications, chat, or live updates are needed.
- You're working in a polyglot environment where strong typing prevents errors.
- Bandwidth efficiency is critical (IoT, mobile edge computing).
- Your team is comfortable with Protocol Buffers and async patterns.
- Internal APIs within your organization are your focus.

### Use REST When

- Building public-facing APIs that external developers will integrate with.
- Browser compatibility is essential without additional infrastructure.
- Your API is simple and primarily serves CRUD operations.
- Your team is unfamiliar with Protocol Buffers and prefers JSON.
- Simplicity and ease of debugging outweigh performance gains.
- You need excellent tooling support and community resources.

## Conclusion

gRPC represents a significant evolution in distributed systems communication. By
combining generated bindings, Protocol Buffers and HTTP/2, it offers explicit
RPC contracts and streaming. However, it introduces complexity that may not be
justified for simpler use cases or public-facing APIs.

The choice between gRPC and REST should be driven by your specific requirements:
if you're optimizing for performance, streaming, and internal microservice
communication, gRPC is a useful candidate to evaluate. If simplicity and broad
compatibility matter more, REST remains the pragmatic choice.

For modern microservice architectures, many organizations use both: REST for
public APIs and gRPC for internal service-to-service communication. This hybrid
approach leverages the strengths of each protocol.

## References

- [gRPC Official Documentation](https://grpc.io/docs/) - Comprehensive guides,
  tutorials, and API references for all supported languages.
- [Protocol Buffers Documentation](https://protobuf.dev/) - Complete reference
  for Protocol Buffers syntax, best practices, and language-specific code
  generation.
- [gRPC GitHub Repository](https://github.com/grpc/grpc) - Source code, issues,
  and community contributions.
- [gRPC Performance Best Practices](https://grpc.io/docs/guides/performance/) -
  Optimization techniques for production gRPC services.
- [Protobuf Style Guide](https://protobuf.dev/programming-guides/style/) - Best
  practices for writing maintainable `.proto` files.
