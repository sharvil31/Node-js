# How Browsers Use Streams in Node.js

This project demonstrates how browsers use **Streams** to download files such as HTML, CSS, JavaScript, images, and videos from a server. Instead of loading the entire file into memory, data is transferred in small chunks, making downloads faster and more memory-efficient.

## What are Browser Streams?

Whenever you open a website, the browser requests multiple assets from the server:

- HTML files
- CSS files
- JavaScript files
- Images
- Videos
- Fonts

The server sends these resources as a **stream of data chunks** rather than one huge block. As soon as the browser receives enough data, it starts processing or displaying it without waiting for the entire file.

For example:

- HTML starts rendering immediately.
- CSS begins styling the page as it downloads.
- JavaScript files are downloaded and executed.
- Images progressively load.
- Videos begin playing before the complete file is downloaded (streaming).

---

## Code Explanation

### 1. Create an HTTP Server

```javascript
import http from "http";
import fs from "fs/promises";

const server = http.createServer(async (req, res) => {
```

Creates a Node.js HTTP server.

- `req` → Readable Stream
- `res` → Writable Stream

---

### 2. Enable CORS

```javascript
res.setHeader("Access-Control-Allow-Origin", "*");
```

Allows requests from any origin.

---

### 3. Set Content Type

```javascript
res.setHeader("Content-Type", "video/mp4");
```

Tells the browser that the response contains a video.

You could also send:

```javascript
text / plain;
image / webp;
text / html;
application / json;
```

depending on the file.

---

### 4. Force Download

```javascript
res.setHeader("Content-Disposition", "attachment; filename=movie.mkv");
```

Instead of playing the video in the browser, this header makes it download.

---

### 5. Open the File

```javascript
const fileHandle = await fs.open("movie.mkv");
```

Gets a file handle without loading the entire file into memory.

---

### 6. Get File Size

```javascript
const { size } = await fileHandle.stat();

res.setHeader("Content-Length", size);
```

The browser now knows the total file size and can display download progress.

---

### 7. Create a Read Stream

```javascript
const readStream = fileHandle.createReadStream({
  highWaterMark: 10 * 1024 * 1024,
});
```

The file is read in **10 MB chunks**.

---

### 8. Send Data to Browser

```javascript
readStream.on("data", (chunk) => {
  res.write(chunk);
});
```

Every chunk read from disk is immediately written to the browser.

Flow:

```
Disk
   │
   ▼
Read Stream
   │
   ▼
HTTP Response
   │
   ▼
Browser
```

---

### 9. Pause and Resume

```javascript
readStream.pause();

setTimeout(() => {
  readStream.resume();
}, 1000);
```

This pauses the stream for one second after every chunk.

Purpose:

- Demonstrates stream flow control.
- Simulates a slow network.
- Shows that streams can be paused and resumed at any time.

Without these lines, the file downloads at full speed.

---

### 10. End the Response

```javascript
readStream.on("end", () => {
  res.end();
});
```

Closes the HTTP response after the complete file has been sent.

---

## Data Flow

```
               File on Disk
                     │
                     ▼
           Readable File Stream
                     │
               readStream.read()
                     │
                     ▼
           HTTP Response (Writable)
                     │
               res.write(chunk)
                     │
                     ▼
                 Browser
                     │
         Displays or Downloads File
```

---

## Why Streams?

Without streams:

- Entire file loads into memory.
- High RAM usage.
- Slow startup for large files.

With streams:

- Small chunks are transferred.
- Lower memory consumption.
- Faster response.
- Ideal for large files.
- Enables video streaming.

---

## Real-World Examples

Browsers use streams for:

- Downloading HTML pages
- Loading CSS stylesheets
- Fetching JavaScript files
- Displaying images
- Playing YouTube videos
- Netflix video streaming
- Spotify music streaming
- File downloads
- Large API responses

---

## Browser Streaming Example

```
Server
   │
   ▼
Chunk 1 ─────────► Browser
Chunk 2 ─────────► Browser
Chunk 3 ─────────► Browser
Chunk 4 ─────────► Browser
Chunk 5 ─────────► Browser
```

The browser doesn't wait for all chunks before starting work.

---

## Key Takeaways

- Browsers download website assets using streams.
- Streams transfer data chunk by chunk.
- HTML, CSS, JS, images, and videos all use streaming.
- `res` is a Writable Stream.
- `req` is a Readable Stream.
- `highWaterMark` controls chunk size.
- `pause()` and `resume()` provide flow control.
- `Content-Length` lets browsers show download progress.
- `Content-Disposition` can force file downloads.
- Streaming is fast, memory-efficient, and perfect for handling large files.
