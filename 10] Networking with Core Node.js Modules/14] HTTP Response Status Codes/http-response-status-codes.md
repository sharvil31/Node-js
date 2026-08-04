# Understanding HTTP Status Codes

HTTP Status Codes are **3-digit numbers** returned by the server to indicate the result of a client's request.

They are grouped into **five categories**, each representing a different type of response.

---

# HTTP Status Code Categories

| Range   | Category      | Meaning                                                |
| ------- | ------------- | ------------------------------------------------------ |
| **1xx** | Informational | Request received, processing continues.                |
| **2xx** | Success       | The request was successfully processed.                |
| **3xx** | Redirection   | Additional action is required to complete the request. |
| **4xx** | Client Error  | The problem is on the client's side.                   |
| **5xx** | Server Error  | The problem is on the server's side.                   |

---

# Common HTTP Status Codes

| Status Code            | Reason Phrase         | Description                                                                                 |
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| **1xx: Informational** |                       |                                                                                             |
| **100**                | Continue              | The server has received the request headers and is waiting for the request body.            |
| **101**                | Switching Protocols   | The server switches to another protocol requested by the client (such as WebSocket).        |
| **2xx: Success**       |                       |                                                                                             |
| **200**                | OK                    | The request completed successfully.                                                         |
| **201**                | Created               | A new resource was successfully created. Commonly returned after a successful POST request. |
| **204**                | No Content            | The request succeeded, but there is no response body.                                       |
| **3xx: Redirection**   |                       |                                                                                             |
| **301**                | Moved Permanently     | The resource has permanently moved to a new URL.                                            |
| **302**                | Found                 | The resource is temporarily available at another URL.                                       |
| **304**                | Not Modified          | The cached version is still valid, so no new content is sent.                               |
| **4xx: Client Errors** |                       |                                                                                             |
| **400**                | Bad Request           | The server couldn't understand the request because of invalid syntax.                       |
| **401**                | Unauthorized          | Authentication is required before accessing the resource.                                   |
| **403**                | Forbidden             | Authentication may exist, but the client doesn't have permission.                           |
| **404**                | Not Found             | The requested resource does not exist.                                                      |
| **405**                | Method Not Allowed    | The HTTP method isn't allowed for this resource.                                            |
| **429**                | Too Many Requests     | The client has exceeded the allowed request limit (rate limiting).                          |
| **5xx: Server Errors** |                       |                                                                                             |
| **500**                | Internal Server Error | An unexpected error occurred on the server.                                                 |
| **501**                | Not Implemented       | The server doesn't support the requested functionality or method.                           |
| **502**                | Bad Gateway           | The server received an invalid response from another server.                                |
| **503**                | Service Unavailable   | The server is temporarily unavailable due to overload or maintenance.                       |
| **504**                | Gateway Timeout       | An upstream server failed to respond in time.                                               |

---

# Easy Way to Remember

## 🟦 1xx → Information

> "I'm processing your request."

Example:

* 100 Continue
* 101 Switching Protocols

---

## 🟩 2xx → Success

> "Everything worked!"

Example:

* 200 OK
* 201 Created
* 204 No Content

---

## 🟨 3xx → Redirect

> "Go somewhere else."

Example:

* 301 Moved Permanently
* 302 Found
* 304 Not Modified

---

## 🟥 4xx → Client Error

> "You made a mistake."

Example:

* 400 Bad Request
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
* 405 Method Not Allowed
* 429 Too Many Requests

---

## ⬛ 5xx → Server Error

> "The server made a mistake."

Example:

* 500 Internal Server Error
* 501 Not Implemented
* 502 Bad Gateway
* 503 Service Unavailable
* 504 Gateway Timeout

---

# Real-World Examples

### GET /users

```http
GET /users HTTP/1.1
```

Response:

```http
HTTP/1.1 200 OK
```

---

### POST /users

```http
POST /users HTTP/1.1
```

Response:

```http
HTTP/1.1 201 Created
```

---

### DELETE /users/5

```http
DELETE /users/5 HTTP/1.1
```

Response:

```http
HTTP/1.1 204 No Content
```

---

### Requesting a Missing Page

```http
GET /unknown-page HTTP/1.1
```

Response:

```http
HTTP/1.1 404 Not Found
```

---

### Server Crash

```http
HTTP/1.1 500 Internal Server Error
```

---

# Summary

* **1xx** → Information
* **2xx** → Success
* **3xx** → Redirection
* **4xx** → Client Error
* **5xx** → Server Error

Understanding these status codes makes it much easier to debug APIs, build backend applications, and understand how web servers communicate with clients.
