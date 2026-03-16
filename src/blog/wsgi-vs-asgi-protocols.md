---
title: WSGI vs ASGI Protocols
pubDate: 2025-01-28
description: "Comprehensive guide comparing WSGI and ASGI protocols in Python
web development. Learn key differences, implementation examples, and when
to use each protocol for optimal web application performance."
tags: [WSGI, ASGI, Python web development, web protocols, FastAPI, Flask,
web servers, async programming, web sockets, HTTP/2]
snippet:
  language: "python"
  code: |
    def app(environ, start_response):
        start_response("200 OK", [("Content-Type", "text/plain")])
        return [b"Hello, World!"]
---

Python web applications require protocols to communicate between web servers
and application code. WSGI (Web Server Gateway Interface) and ASGI
(Asynchronous Server Gateway Interface) are two such protocols, each with
distinct characteristics and use cases.

## WSGI: Synchronous Web Applications

WSGI is the traditional protocol for Python web applications, introduced in
[PEP 333](https://peps.python.org/pep-0333/). It's synchronous and handles one
request at a time.

### Core Concepts

- Single callable function (application object)
- Synchronous request-response cycle
- Compatible with most traditional web frameworks

### Example WSGI Application

```python
# wsgi_app.py
def simple_wsgi_app(environ, start_response):
    status = '200 OK'
    headers = [('Content-type', 'text/plain')]
    start_response(status, headers)

    return [b"Hello from WSGI!"]

# Test the WSGI app
def mock_start_response(status, headers):
    print(f"Status: {status}")
    print(f"Headers: {headers}")

response = simple_wsgi_app({}, mock_start_response)
print(response[0].decode())
```

```bash
gunicorn --workers=2 --bind 127.0.0.1:8000 wsgi_app:simple_wsgi_app
```

## ASGI: Modern Async Applications

ASGI extends WSGI to support asynchronous operations, WebSockets, and HTTP/2,
making it suitable for modern web applications.

### Key Features

- Async-first design
- WebSocket support
- HTTP/2 compatibility
- Better handling of long-lived connections

### Example ASGI Application

```python
async def simple_asgi_app(scope, receive, send):
    assert scope['type'] == 'http'

    await send({
        'type': 'http.response.start',
        'status': 200,
        'headers': [
            [b'content-type', b'text/plain'],
        ],
    })

    await send({
        'type': 'http.response.body',
        'body': b"Hello from ASGI!",
    })

# Test the ASGI app
responses = []
async def mock_send(message):
    responses.append(message)

await simple_asgi_app({'type': 'http'}, None, mock_send)
print(f"Status: {responses[0]['status']}")
print(responses[1]['body'].decode())
```

```bash
uvicorn asgi_app:simple_asgi_app
```

## When to Use Each

WSGI:

- Simple request-response applications
- Legacy systems integration
- [CPU-bound](https://fluidattacks.github.io/aioextensions/#cpu-bound-tasks)
  applications

ASGI:

- Real-time applications
- WebSocket requirements
- High-concurrency needs
- [I/O-bound](https://fluidattacks.github.io/aioextensions/#io-bound-tasks)
  applications

## Performance Considerations

- ASGI handles concurrent connections more efficiently
- WSGI is simpler and may be faster for basic request-response cycles
- ASGI servers (like Uvicorn) generally show better performance under high load
