# Understanding CORS in Express

## What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that allows a web server to specify which **origins** are allowed to access its resources from a different origin.

Before understanding CORS, we need to understand the **Same-Origin Policy (SOP)**.

### Same-Origin Policy

Browsers follow the Same-Origin Policy, which restricts a webpage from freely accessing resources from a different origin.

An **origin** consists of:

- **Protocol** — `http` or `https`
- **Host** — domain name or IP address
- **Port** — `3000`, `4000`, `5500`, etc.

For example:

```text
http://localhost:5500
```

and

```text
http://localhost:4000
```

are different origins because their **port numbers are different**.

Similarly:

```text
http://localhost:4000
```

and

```text
https://localhost:4000
```

are different origins because their **protocols are different**.

---

## Why do browsers enforce CORS?

CORS is enforced by browsers as part of their security model.

Imagine a user is logged into a website such as:

```text
https://bank.example
```

Now the user visits a malicious website:

```text
https://malicious.example
```

Without browser protections, JavaScript from the malicious website could potentially make requests to the bank website using the user's existing credentials and freely read the responses.

The Same-Origin Policy prevents JavaScript from freely reading cross-origin responses.

CORS provides a controlled way for the server to say:

> "I trust requests coming from this particular origin, so the browser may allow that website's JavaScript to access my response."

---

## CORS in Express

In Express, we can manually configure CORS using response headers.

For example:

```js
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");

  next();
});
```

The response will contain:

```text
Access-Control-Allow-Origin: *
```

This tells the browser that resources from this server can be accessed by JavaScript running from any origin.

---

## Allowing Specific Origins

Instead of allowing every origin, we can maintain a list of allowed origins:

```js
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.100.10:5500",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }

  next();
});
```

Here:

1. The browser sends the `Origin` request header.
2. Express reads `req.headers.origin`.
3. We check whether the origin exists in our allowed list.
4. If it is allowed, we send `Access-Control-Allow-Origin`.
5. The browser can then allow the frontend JavaScript to access the response.

---

## Important: CORS is enforced by the browser

One important thing I learned is that CORS is mainly a **browser-enforced restriction**.

For example, if JavaScript running on:

```text
http://localhost:5500
```

requests:

```text
http://localhost:4000/api
```

the request is cross-origin because the ports are different.

The Express server can receive the request, but the browser may prevent the frontend JavaScript from reading the response if the server does not provide the appropriate CORS headers.

Therefore:

```text
CORS ≠ Server blocking every cross-origin request
```

Instead, it is primarily about whether the **browser allows the requesting webpage to access the response**.

---

## My Express Experiment

I created an Express server with API endpoints for different HTTP methods:

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

I also experimented with manually setting the CORS header:

```js
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");

  next();
});
```

This helped me understand how the browser uses the `Access-Control-Allow-Origin` response header when making cross-origin requests.

---

## Key Takeaways

- **Same-Origin Policy** is a browser security mechanism.
- An origin consists of **protocol + host + port**.
- Different ports mean different origins.
- **CORS stands for Cross-Origin Resource Sharing.**
- CORS provides a controlled way for servers to allow cross-origin browser access.
- CORS is primarily **enforced by browsers**.
- The server communicates its CORS policy through HTTP response headers.
- `Access-Control-Allow-Origin` is one of the main CORS response headers.
- `*` allows requests from any origin for cases where wildcard access is appropriate.
- For better control, specific trusted origins can be allowed.
- CORS does not mean that the server cannot receive a cross-origin request; it mainly determines whether the browser exposes the response to frontend JavaScript.
