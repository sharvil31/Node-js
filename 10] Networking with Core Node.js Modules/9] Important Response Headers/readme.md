# Understanding Important HTTP Response Headers in Node.js (Using the `net` Module)

This project demonstrates how HTTP response headers work by creating an HTTP server from scratch using Node.js' **`net`** module instead of the built-in `http` module.

By manually writing the HTTP response, we can understand what browsers expect before displaying or downloading content.

## 🚀 What I Learned

### 1. Status Line

```http
HTTP/1.1 200 OK
```

The first line of every HTTP response.

It tells the browser:

* HTTP version
* Status code
* Status message

Examples:

* `200 OK`
* `404 Not Found`
* `500 Internal Server Error`

---

### 2. Content-Type

```http
Content-Type: video/mp4
```

This header tells the browser what type of content is being sent.

Examples:

| Content    | MIME Type        |
| ---------- | ---------------- |
| Plain Text | text/plain       |
| HTML       | text/html        |
| JSON       | application/json |
| PDF        | application/pdf  |
| PNG Image  | image/png        |
| WebP Image | image/webp       |
| MP4 Video  | video/mp4        |
| MKV Video  | video/x-matroska |

Without this header, the browser tries to guess the file type, which may lead to incorrect behavior.

---

### 3. Content-Length

```http
Content-Length: 10485760
```

Specifies the exact size of the response body in bytes.

Benefits:

* Browser knows when the download is complete.
* Displays accurate download progress.
* Automatically closes the connection after receiving the expected number of bytes.

If the value is incorrect:

* Too small → Browser ignores remaining bytes.
* Too large → Browser waits for more data and may eventually time out.

---

### 4. Content-Disposition

```http
Content-Disposition: attachment; filename=movie.mkv
```

Controls whether the browser displays the file or downloads it.

#### Download

```http
Content-Disposition: attachment
```

Forces the browser to download the file.

#### Display

```http
Content-Disposition: inline
```

Allows the browser to display the file if supported.

The `filename` parameter suggests the name of the downloaded file.

---

### 5. Blank Line

```http
```

An empty line separates the HTTP headers from the response body.

Without this separator, the browser cannot determine where the headers end.

---

### 6. Response Body

After the blank line, the actual file or data is sent.

```javascript
readStream.pipe(socket);
```

The browser reads the bytes based on the information provided in the headers.

---

## Backpressure (Pause & Resume)

```javascript
readStream.on("pause", ...)
readStream.on("resume", ...)
```

These events occur when the socket cannot send data as fast as the file is being read.

Node.js automatically pauses the file stream until the socket buffer has enough space, then resumes reading.

This mechanism is called **Backpressure** and prevents memory overflow.

---

## Client Request

Listening for incoming data:

```javascript
socket.on("data", chunk => {
  console.log(chunk.toString());
});
```

Displays the browser's HTTP request, for example:

```http
GET / HTTP/1.1
Host: localhost:4000
User-Agent: Chrome
Accept: */*
Connection: keep-alive
```

---

## HTTP Response Structure

```text
Browser
   │
   │ GET /
   ▼

Server

HTTP/1.1 200 OK
Content-Type: video/mp4
Content-Length: 12345678
Content-Disposition: attachment

(Binary File Data)

   │
   ▼

Browser

Read Headers
↓

Identify Content Type
↓

Know File Size
↓

Receive File
↓

Download Complete
```

---

## Key Takeaways

* Every HTTP response starts with a **Status Line**.
* `Content-Type` tells the browser how to interpret the response.
* `Content-Length` specifies the exact response size.
* `Content-Disposition` controls whether content is displayed or downloaded.
* A blank line separates headers from the body.
* The response body contains the actual data.
* Node.js streams automatically handle **backpressure** using pause and resume.
* Building an HTTP server with the `net` module helps understand the HTTP protocol at a much lower level.

---

### Technologies Used

* Node.js
* TCP (`net` module)
* Streams
* HTTP Protocol
* File System (`fs`)
