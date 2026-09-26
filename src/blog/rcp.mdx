---
title: JSON-RPC V2.0
pubDate: 2026-03-15
description:
  "JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol"
tags: ["programming", "web"]
isDraft: False
snippet:
  language: "json"
  code: |
    {
      "jsonrpc": "2.0",
      "method": "call_function",
      "params": {
        "name": "function_name",
        "arguments": {
          "user_name": "jondoe"
        }
      },
      "id": 2
    }
---

This article is based on the
[JSON‑RPC 2.0 Specification](https://www.jsonrpc.org/specification) by the
JSON‑RPC Working Group, Copyright (C) 2007–2010 by the JSON‑RPC Working Group,
used under the permissions granted in the specification.

> JSON-RPC is a stateless, lightweight remote procedure call (RPC) protocol.

## Request Object

```json
{
  "jsonrpc": "2.0",
  "method": "call_function",
  "params": {
    "name": "function_name",
    "arguments": {
      "user_name": "jondoe"
    }
  },
  "id": 2
}
```

- `jsonrpc`: Version of the JSON-RPC protocol (String, required, must be
  `"2.0"`).
- `method`: Name of the method to be invoked (String, required).
- `params`: Structured value that holds parameter values for invocation (Array
  or Object, optional).
- `id`: Identifier defined by the client (String, Number, or Null, optional). If
  omitted, the message is assumed to be a notification. Otherwise, the server
  must reply with the same value in the response object.

### Notifications

Messages with no `id`. A Request object that is a notification signifies the
client's lack of interest in the Response object. The server must not reply to a
notification.

### Parameters Structure

Parameters must be provided as structured values, either by position through an
array or by name through an object.

## Response Object

The response is expressed as a single JSON object with the following members.

- `jsonrpc`: Version of the JSON-RPC protocol (String, required, must be
  `"2.0"`).
- `result`: Required on success. It must not exist if there was an error
  invoking the method.
- `error`: Required on error. It must not exist if there was no error during
  invocation.
- `id`: Required. If there was an error detecting the `id` in the Request
  object, it must be `null`.

Either the `result` member or `error` member must be included, but not both.

### Error Object

Object with the following members:

- `code`: A number that indicates the error type that occurred.
- `message`: Description of the error (String). Concise single sentence.
- `data`: A primitive or structured value containing additional information
  about the error (optional).

See the
[JSON-RPC error object specification](https://www.jsonrpc.org/specification#error_object).

### Batch

The client sends an array filled with Request objects. The server responds with
an array containing the corresponding Response objects. A response object should
exist for each request object except for notification requests.

The responses may be returned in any order in the responses array. The server
must not return an empty array and should return nothing at all for batches
containing only notifications.

## Attribution and Copyright Notice

This article includes content derived from the JSON-RPC 2.0 specification.

Copyright (C) 2007-2010 by the JSON-RPC Working Group

This document and translations of it may be used to implement JSON-RPC, it may
be copied and furnished to others, and derivative works that comment on or
otherwise explain it or assist in its implementation may be prepared, copied,
published and distributed, in whole or in part, without restriction of any kind,
provided that the above copyright notice and this paragraph are included on all
such copies and derivative works. However, this document itself may not be
modified in any way.

The limited permissions granted above are perpetual and will not be revoked.

This document and the information contained herein is provided "AS IS" and ALL
WARRANTIES, EXPRESS OR IMPLIED are DISCLAIMED, INCLUDING BUT NOT LIMITED TO ANY
WARRANTY THAT THE USE OF THE INFORMATION HEREIN WILL NOT INFRINGE ANY RIGHTS OR
ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
