# Understanding CORS, Preflight Requests & OPTIONS in Express.js

## What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that controls whether a web page can access resources from a different origin.

An origin consists of:

* **Protocol** — `http` / `https`
* **Host** — domain name or IP address
* **Port** — `3000`, `4000`, `5500`, etc.

For example:

```text
http://localhost:5500
http://localhost:4000
```

These are different origins because their port numbers are different.

CORS works together with the browser's **Same-Origin Policy**, which prevents JavaScript from freely reading resources from another origin.

---

# Understanding CORS, Preflight Requests & OPTIONS in Express.js

## What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that controls whether a web page can access resources from a different origin.

An origin consists of:

* **Protocol** — `http` / `https`
* **Host** — domain name or IP address
* **Port** — `3000`, `4000`, `5500`, etc.

For example:

```text
http://localhost:5500
http://localhost:4000
```

These are different origins because their port numbers are different.

CORS works together with the browser's **Same-Origin Policy**, which prevents JavaScript from freely reading resources from another origin.

---

## Simple Requests

Not every cross-origin request requires a preflight request.

A request can be considered a **simple CORS request** when it satisfies the browser's conditions for a simple request.

Commonly, the method must be:

* `GET`
* `HEAD`
* `POST`

and the request must use only CORS-safelisted headers and allowed `Content-Type` values.

For example:

```js
fetch("http://localhost:4000/api", {
  method: "POST",
  headers: {
    "Content-Type": "text/plain"
  },
  body: "Hello"
});
```

The browser can send this request directly without first sending an `OPTIONS` request.

```text
Browser → POST /api → Server
```

---

## Non-Simple Requests

A request that doesn't satisfy the conditions for a simple request can require a **preflight request**.

For example:

```js
fetch("http://localhost:4000/api", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  },
  body: JSON.stringify({
    name: "Sharvil"
  })
});
```

Here we are using:

* `PUT`
* `application/json`
* `Authorization`

Therefore, the browser may perform a preflight request before sending the actual `PUT` request.

---

## What is a Preflight Request?

A **preflight request** is a request automatically sent by the browser before certain cross-origin requests.

The browser uses the **`OPTIONS` HTTP method** for the preflight.

Its purpose is essentially to ask the server:

> "Is this cross-origin request allowed?"

The flow looks like this:

```text
Browser
   |
   | OPTIONS /api
   |-------------------->
   |
   |  CORS response
   |<--------------------
   |
   | PUT /api
   |-------------------->
   |
Server
```

The actual `PUT` request is sent only if the browser determines that the preflight requirements have been satisfied.

---

## What does the Preflight Request contain?

Suppose the frontend is running on:

```text
http://localhost:5500
```

and wants to make:

```text
PUT http://localhost:4000/api
```

with:

```text
Content-Type: application/json
Authorization: Bearer token
```

The browser can send an `OPTIONS` request similar to:

```http
OPTIONS /api HTTP/1.1
Origin: http://localhost:5500
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type, authorization
```

There are three important request headers here.

### `Origin`

```http
Origin: http://localhost:5500
```

This tells the server which origin is making the request.

### `Access-Control-Request-Method`

```http
Access-Control-Request-Method: PUT
```

This tells the server which HTTP method the browser wants to use for the actual request.

### `Access-Control-Request-Headers`

```http
Access-Control-Request-Headers: content-type, authorization
```

This tells the server which non-safelisted request headers the browser wants to send.

---

# CORS Preflight Response

The server can respond with CORS headers such as:

```http
Access-Control-Allow-Origin: http://localhost:5500
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
```

The browser checks these response headers to determine whether the requested cross-origin operation is permitted.

---

## Access-Control-Allow-Origin

```http
Access-Control-Allow-Origin: http://localhost:5500
```

This tells the browser that the specified origin is allowed to access the response.

We can also use:

```http
Access-Control-Allow-Origin: *
```

to allow any origin in situations where wildcard access is appropriate.

---

## Access-Control-Allow-Methods

The server can tell the browser which HTTP methods are allowed:

```http
Access-Control-Allow-Methods: GET, POST, PUT
```

For example, if the browser's preflight request contains:

```http
Access-Control-Request-Method: PUT
```

the server should indicate that `PUT` is allowed:

```http
Access-Control-Allow-Methods: PUT
```

or:

```http
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

If the requested method isn't permitted by the CORS policy, the browser will not allow the actual cross-origin request to proceed.

---

## Access-Control-Allow-Headers

The browser tells the server which request headers it wants to send:

```http
Access-Control-Request-Headers: content-type, authorization
```

The server can respond with:

```http
Access-Control-Allow-Headers: Content-Type, Authorization
```

This tells the browser that those request headers are permitted.

A useful way to remember this is:

| Browser → Server                 | Server → Browser               |
| -------------------------------- | ------------------------------ |
| `Origin`                         | `Access-Control-Allow-Origin`  |
| `Access-Control-Request-Method`  | `Access-Control-Allow-Methods` |
| `Access-Control-Request-Headers` | `Access-Control-Allow-Headers` |

---

# OPTIONS Request in Express

`OPTIONS` is an HTTP method.

Browsers use it for CORS **preflight requests**.

Express does not automatically create a complete CORS policy just because we are using Express. We need to configure the appropriate response headers ourselves or use CORS middleware.

For example:

```js
app.options("/api", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.sendStatus(204);
});
```

Now Express can handle the preflight request for `/api`.

---

# Important Difference Between Request and Response Headers

One thing I learned is that the browser and server use different headers during preflight.

The **browser sends**:

```http
Access-Control-Request-Method
Access-Control-Request-Headers
```

The **server responds with**:

```http
Access-Control-Allow-Methods
Access-Control-Allow-Headers
```

For example:

```text
Browser
   |
   | Access-Control-Request-Method: PUT
   | Access-Control-Request-Headers: Authorization
   |
   ▼
Server
   |
   | Access-Control-Allow-Methods: PUT
   | Access-Control-Allow-Headers: Authorization
   |
   ▼
Browser
```

---

# Complete CORS Preflight Flow

```text
Frontend: http://localhost:5500
Backend:  http://localhost:4000


1. Browser wants to send a non-simple request

       |
       | OPTIONS /api
       | Origin: http://localhost:5500
       | Access-Control-Request-Method: PUT
       | Access-Control-Request-Headers:
       | Content-Type, Authorization
       ▼

2. Express Server

       |
       | Access-Control-Allow-Origin:
       | http://localhost:5500
       |
       | Access-Control-Allow-Methods:
       | GET, POST, PUT
       |
       | Access-Control-Allow-Headers:
       | Content-Type, Authorization
       ▼

3. Browser checks the CORS response

       |
       | If allowed
       ▼

4. Browser sends actual request

       |
       | PUT /api
       ▼

5. Express processes the request
```

---

# My Express Experiment

I created an Express server with different HTTP method routes:

```js
app.get("/api", (req, res) => {
  res.json({ message: "Hello, world get!" });
});

app.post("/api", (req, res) => {
  res.json({ message: "Hello, world post!" });
});

app.put("/api", (req, res) => {
  res.json({ message: "Hello, world put!" });
});
```

I also experimented with CORS response headers:

```js
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});
```

Through this experiment, I learned how browsers handle cross-origin requests and how preflight requests use the `OPTIONS` method to check whether a requested method and headers are permitted.

---

# Key Takeaways

* **CORS** stands for Cross-Origin Resource Sharing.
* Browsers enforce the **Same-Origin Policy**.
* An origin consists of **protocol + host + port**.
* Simple requests can be sent without a preflight.
* Non-simple requests can trigger a **preflight request**.
* A preflight request uses the **`OPTIONS` HTTP method**.
* `Origin` tells the server where the request came from.
* `Access-Control-Request-Method` tells the server which method is requested.
* `Access-Control-Request-Headers` tells the server which headers are requested.
* `Access-Control-Allow-Origin` specifies allowed origins.
* `Access-Control-Allow-Methods` specifies allowed HTTP methods.
* `Access-Control-Allow-Headers` specifies allowed request headers.
* CORS is primarily a **browser-enforced security mechanism**.
* The server can receive a cross-origin request, but the browser controls whether frontend JavaScript can access the response.

---

## Simple Requests

Not every cross-origin request requires a preflight request.

A request can be considered a **simple CORS request** when it satisfies the browser's conditions for a simple request.

Commonly, the method must be:

* `GET`
* `HEAD`
* `POST`

and the request must use only CORS-safelisted headers and allowed `Content-Type` values.

For example:

```js
fetch("http://localhost:4000/api", {
  method: "POST",
  headers: {
    "Content-Type": "text/plain"
  },
  body: "Hello"
});
```

The browser can send this request directly without first sending an `OPTIONS` request.

```text
Browser → POST /api → Server
```

---

## Non-Simple Requests

A request that doesn't satisfy the conditions for a simple request can require a **preflight request**.

For example:

```js
fetch("http://localhost:4000/api", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  },
  body: JSON.stringify({
    name: "Sharvil"
  })
});
```

Here we are using:

* `PUT`
* `application/json`
* `Authorization`

Therefore, the browser may perform a preflight request before sending the actual `PUT` request.

---

## What is a Preflight Request?

A **preflight request** is a request automatically sent by the browser before certain cross-origin requests.

The browser uses the **`OPTIONS` HTTP method** for the preflight.

Its purpose is essentially to ask the server:

> "Is this cross-origin request allowed?"

The flow looks like this:

```text
Browser
   |
   | OPTIONS /api
   |-------------------->
   |
   |  CORS response
   |<--------------------
   |
   | PUT /api
   |-------------------->
   |
Server
```

The actual `PUT` request is sent only if the browser determines that the preflight requirements have been satisfied.

---

## What does the Preflight Request contain?

Suppose the frontend is running on:

```text
http://localhost:5500
```

and wants to make:

```text
PUT http://localhost:4000/api
```

with:

```text
Content-Type: application/json
Authorization: Bearer token
```

The browser can send an `OPTIONS` request similar to:

```http
OPTIONS /api HTTP/1.1
Origin: http://localhost:5500
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type, authorization
```

There are three important request headers here.

### `Origin`

```http
Origin: http://localhost:5500
```

This tells the server which origin is making the request.

### `Access-Control-Request-Method`

```http
Access-Control-Request-Method: PUT
```

This tells the server which HTTP method the browser wants to use for the actual request.

### `Access-Control-Request-Headers`

```http
Access-Control-Request-Headers: content-type, authorization
```

This tells the server which non-safelisted request headers the browser wants to send.

---

# CORS Preflight Response

The server can respond with CORS headers such as:

```http
Access-Control-Allow-Origin: http://localhost:5500
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
```

The browser checks these response headers to determine whether the requested cross-origin operation is permitted.

---

## Access-Control-Allow-Origin

```http
Access-Control-Allow-Origin: http://localhost:5500
```

This tells the browser that the specified origin is allowed to access the response.

We can also use:

```http
Access-Control-Allow-Origin: *
```

to allow any origin in situations where wildcard access is appropriate.

---

## Access-Control-Allow-Methods

The server can tell the browser which HTTP methods are allowed:

```http
Access-Control-Allow-Methods: GET, POST, PUT
```

For example, if the browser's preflight request contains:

```http
Access-Control-Request-Method: PUT
```

the server should indicate that `PUT` is allowed:

```http
Access-Control-Allow-Methods: PUT
```

or:

```http
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

If the requested method isn't permitted by the CORS policy, the browser will not allow the actual cross-origin request to proceed.

---

## Access-Control-Allow-Headers

The browser tells the server which request headers it wants to send:

```http
Access-Control-Request-Headers: content-type, authorization
```

The server can respond with:

```http
Access-Control-Allow-Headers: Content-Type, Authorization
```

This tells the browser that those request headers are permitted.

A useful way to remember this is:

| Browser → Server                 | Server → Browser               |
| -------------------------------- | ------------------------------ |
| `Origin`                         | `Access-Control-Allow-Origin`  |
| `Access-Control-Request-Method`  | `Access-Control-Allow-Methods` |
| `Access-Control-Request-Headers` | `Access-Control-Allow-Headers` |

---

# OPTIONS Request in Express

`OPTIONS` is an HTTP method.

Browsers use it for CORS **preflight requests**.

Express does not automatically create a complete CORS policy just because we are using Express. We need to configure the appropriate response headers ourselves or use CORS middleware.

For example:

```js
app.options("/api", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.sendStatus(204);
});
```

Now Express can handle the preflight request for `/api`.

---

# Important Difference Between Request and Response Headers

One thing I learned is that the browser and server use different headers during preflight.

The **browser sends**:

```http
Access-Control-Request-Method
Access-Control-Request-Headers
```

The **server responds with**:

```http
Access-Control-Allow-Methods
Access-Control-Allow-Headers
```

For example:

```text
Browser
   |
   | Access-Control-Request-Method: PUT
   | Access-Control-Request-Headers: Authorization
   |
   ▼
Server
   |
   | Access-Control-Allow-Methods: PUT
   | Access-Control-Allow-Headers: Authorization
   |
   ▼
Browser
```

---

# Complete CORS Preflight Flow

```text
Frontend: http://localhost:5500
Backend:  http://localhost:4000


1. Browser wants to send a non-simple request

       |
       | OPTIONS /api
       | Origin: http://localhost:5500
       | Access-Control-Request-Method: PUT
       | Access-Control-Request-Headers:
       | Content-Type, Authorization
       ▼

2. Express Server

       |
       | Access-Control-Allow-Origin:
       | http://localhost:5500
       |
       | Access-Control-Allow-Methods:
       | GET, POST, PUT
       |
       | Access-Control-Allow-Headers:
       | Content-Type, Authorization
       ▼

3. Browser checks the CORS response

       |
       | If allowed
       ▼

4. Browser sends actual request

       |
       | PUT /api
       ▼

5. Express processes the request
```

---

# My Express Experiment

I created an Express server with different HTTP method routes:

```js
app.get("/api", (req, res) => {
  res.json({ message: "Hello, world get!" });
});

app.post("/api", (req, res) => {
  res.json({ message: "Hello, world post!" });
});

app.put("/api", (req, res) => {
  res.json({ message: "Hello, world put!" });
});
```

I also experimented with CORS response headers:

```js
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});
```

Through this experiment, I learned how browsers handle cross-origin requests and how preflight requests use the `OPTIONS` method to check whether a requested method and headers are permitted.

---

# Key Takeaways

* **CORS** stands for Cross-Origin Resource Sharing.
* Browsers enforce the **Same-Origin Policy**.
* An origin consists of **protocol + host + port**.
* Simple requests can be sent without a preflight.
* Non-simple requests can trigger a **preflight request**.
* A preflight request uses the **`OPTIONS` HTTP method**.
* `Origin` tells the server where the request came from.
* `Access-Control-Request-Method` tells the server which method is requested.
* `Access-Control-Request-Headers` tells the server which headers are requested.
* `Access-Control-Allow-Origin` specifies allowed origins.
* `Access-Control-Allow-Methods` specifies allowed HTTP methods.
* `Access-Control-Allow-Headers` specifies allowed request headers.
* CORS is primarily a **browser-enforced security mechanism**.
* The server can receive a cross-origin request, but the browser controls whether frontend JavaScript can access the response.
