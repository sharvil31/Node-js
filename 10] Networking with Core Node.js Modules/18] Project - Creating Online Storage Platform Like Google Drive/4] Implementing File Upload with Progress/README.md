# Online Storage Platform (Google Drive-like)

A Node.js + React project for building a simple online storage platform similar to Google Drive.

The project now supports **directory browsing, file preview, download, and file upload with real-time upload progress**. The client and server are separated into independent applications.

## Current Progress

### Implemented Features

- Separate React client and Node.js server
- Directory browsing
- File reading
- File preview
- File download
- File upload
- Real-time upload progress
- MIME type detection
- Readable file streams
- Writable file streams
- HTTP request/response handling
- JSON API responses
- CORS support
- Query-parameter based file actions

## File Upload

The React client uses `XMLHttpRequest` to upload the selected file and track upload progress.

```js
const xhr = new XMLHttpRequest();

xhr.open("POST", "http://192.168.0.108", true);
xhr.setRequestHeader("filename", file.name);

xhr.upload.addEventListener("progress", (e) => {
    const totalProgress = (e.loaded / e.total) * 100;
    setProgress(totalProgress.toFixed(2));
});

xhr.send(file);
```

`XMLHttpRequest` is used here because its upload progress event provides the uploaded and total byte counts needed to display progress.

## Server-Side Upload

The Node.js server receives the request body in chunks and writes those chunks directly to a file using a writable stream.

```js
const writeStream = createWriteStream(
    `./storage/${req.headers.filename}`
);

req.on("data", (chunk) => {
    writeStream.write(chunk);
});

req.on("end", () => {
    writeStream.end();
    res.end("File uploaded on the server");
});
```

This avoids loading the complete uploaded file into memory.

## Upload Flow

```text
User selects file
        |
        v
React Client
        |
        | XMLHttpRequest POST
        | filename header
        v
Node.js Server
        |
        | Request data chunks
        v
Writable File Stream
        |
        v
Storage Directory
```

At the same time, the client listens for upload progress and updates React state:

```text
File Upload
    |
    +----> Server
    |
    +----> Progress Event
              |
              v
         React State
              |
              v
        Progress UI
```

## Existing Features

### Directory Browsing

The server reads the storage directory and returns its contents as JSON.

```js
const itemsList = await readdir(`./storage${url}`);

res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify(itemsList));
```

### File Preview

Files can be previewed by streaming them from the server with the appropriate MIME type.

```js
const readStream = fileHandle.createReadStream();

res.setHeader(
    "Content-Type",
    mime.contentType(url.slice(1))
);

res.setHeader("Content-Length", stats.size);

readStream.pipe(res);
```

### File Download

A file can be downloaded using:

```text
?action=download
```

The server sends `Content-Disposition: attachment` so the browser downloads the file.

## Project Architecture

```text
Online Storage Platform
|
+-- client/
|   +-- src/
|   |   +-- App.jsx
|   |   +-- App.css
|   |   +-- main.jsx
|   |   +-- assets/
|   +-- public/
|   +-- package.json
|   +-- vite.config.js
|
+-- server/
    +-- storage/
    +-- app.js
    +-- package.json
```

## Client and Server Flow

```text
React Client
     |
     | HTTP / Fetch / XMLHttpRequest
     v
Node.js Server
     |
     v
Storage / File System
```

The React client handles the UI and user interactions. The Node.js server handles file-system operations, file streaming, and uploads.

## Technologies Used

### Frontend

- React
- JavaScript
- Vite
- HTML
- CSS
- XMLHttpRequest

### Backend

- Node.js
- HTTP module
- `fs/promises`
- File Read Streams
- File Write Streams
- `mime-types`

## Running the Project

### Server

```bash
cd server
npm install
node app.js
```

### Client

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Then open the URL provided by Vite.

## What I Learned

- File uploads over HTTP
- POST requests
- XMLHttpRequest
- Upload progress events
- `e.loaded` and `e.total`
- Request headers
- Node.js request streams
- Writable streams
- Readable streams
- Streaming data in chunks
- Client-server communication
- React state updates
- CORS
- HTTP headers
- File-system operations

## Progress Calculation

The browser provides the uploaded bytes through:

```js
e.loaded
```

and the total upload size through:

```js
e.total
```

The upload percentage is calculated as:

```js
(e.loaded / e.total) * 100
```

## Next Steps

- Folder creation
- File deletion
- File renaming
- Better navigation
- Upload cancellation
- Multiple file uploads
- File metadata
- Authentication
- Authorization
- Improved UI
- Better upload error handling

## Status

**In Development**

Current milestone:

**Client/server separation + Read + Preview + Download + File Upload with Progress**

Next milestone:

**File and folder management functionality**
