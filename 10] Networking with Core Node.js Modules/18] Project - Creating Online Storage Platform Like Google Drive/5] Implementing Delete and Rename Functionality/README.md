# Online Storage Platform (Google Drive-like)

A simple Google Drive-like storage application built with **Node.js and React** to understand HTTP, streams, file systems, and client-server communication at a low level.

## Final Core Features

- React client and Node.js server separated
- Directory browsing
- File reading
- File preview
- File download
- File upload
- Real-time upload progress
- File rename
- File delete
- MIME type detection
- Readable and writable streams
- GET, POST, PATCH, DELETE and OPTIONS handling
- CORS support

## Architecture

```text
React Client
     |
     | HTTP / Fetch / XMLHttpRequest
     v
Node.js HTTP Server
     |
     v
Local Storage
```

The React client handles the UI and user interactions. The Node.js server handles file-system operations.

## Project Structure

```text
Online Storage Platform/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── storage/
    ├── app.js
    └── package.json
```

## File Operations

### Read / Preview

Files are opened and streamed to the client:

```js
const fileHandle = await open(`./storage${decodeURIComponent(url)}`);
const stats = await fileHandle.stat();
const readStream = fileHandle.createReadStream();

res.setHeader("Content-Type", mime.contentType(url.slice(1)));
res.setHeader("Content-Length", stats.size);

readStream.pipe(res);
```

### Download

Files can be downloaded using:

```text
?action=download
```

The server uses:

```http
Content-Disposition: attachment
```

to tell the browser to download the file.

### Upload with Progress

The React client uses `XMLHttpRequest` because it provides an upload progress event:

```js
xhr.upload.addEventListener("progress", (e) => {
  const totalProgress = (e.loaded / e.total) * 100;
  setProgress(totalProgress.toFixed(2));
});
```

The server receives the request body in chunks and writes it to storage using a writable stream:

```js
const writeStream = createWriteStream(
  `./storage/${req.headers.filename}`
);

req.on("data", (chunk) => {
  writeStream.write(chunk);
});

req.on("end", () => {
  writeStream.end();
});
```

### Delete

The client sends a `DELETE` request and the server removes the file with Node.js `rm()`.

```js
await rm(`./storage/${filename}`);
```

### Rename

The client sends a `PATCH` request containing the old and new filenames. The server uses Node.js `rename()`:

```js
await rename(
  `./storage/${data.oldFilename}`,
  `./storage/${data.newFilename}`
);
```

## HTTP Methods

| Method | Purpose |
|---|---|
| GET | List, read, preview and download files |
| POST | Upload files |
| PATCH | Rename files |
| DELETE | Delete files |
| OPTIONS | CORS preflight |

## Streams

This project provided practical experience with three important stream concepts:

**Readable Stream** — sends file data from the server to the client.

**Writable Stream** — writes uploaded data to a file.

**Request Stream** — incoming upload data arrives from the HTTP request in chunks.

Using streams avoids loading an entire large file into memory.

## Technologies

### Frontend
- React
- JavaScript
- Vite
- Fetch API
- XMLHttpRequest
- HTML/CSS

### Backend
- Node.js
- Native `http` module
- `fs/promises`
- Readable Streams
- Writable Streams
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

- Node.js HTTP servers
- Client-server architecture
- HTTP methods
- File-system APIs
- File handles
- Readable streams
- Writable streams
- Request streams
- MIME types
- HTTP headers
- Query parameters
- CORS
- XMLHttpRequest upload progress
- React state and effects
- REST-style communication
- File management operations

## Project Journey

```text
HTTP Server
    ↓
Directory Reading
    ↓
File Reading
    ↓
Preview
    ↓
Download
    ↓
Client / Server Separation
    ↓
Upload with Progress
    ↓
Delete
    ↓
Rename
    ↓
Core Storage Features Complete
```

## Final Status

**Completed — Core Storage Functionality**

The application now supports:

- Browse
- Read
- Preview
- Download
- Upload with progress
- Rename
- Delete

The project was built primarily as a learning exercise to understand Node.js, HTTP, streams, file systems, and client-server architecture using simple Node.js APIs rather than a backend framework.

## Future Improvements

- Folder creation
- Nested folder navigation
- Multiple file uploads
- Upload cancellation
- File metadata
- Search
- Authentication
- Authorization
- User-specific storage
- Better error handling
- File size limits
- Security improvements
- Production deployment
