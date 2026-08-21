# Online Storage Platform (Google Drive-like)

A Node.js + React project for building a simple online storage platform similar to Google Drive.

## Current Progress

### Implemented
- Separate client and server applications
- Node.js HTTP server
- React frontend
- Directory browsing
- File reading
- File preview
- File download
- MIME type detection
- Readable file streams
- HTTP response headers
- JSON API responses
- CORS support

## Project Structure

```text
Online Storage Platform/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── assets/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── storage/
    ├── app.js
    └── package.json
```

## Client

The React client handles the UI and communicates with the Node.js server using `fetch()`.

```js
const response = await fetch("http://192.168.0.106/");
const data = await response.json();

setDirectoryItems(data);
```

It displays the available files and provides Open and Download actions.

## Server

The Node.js server handles file-system operations.

For directories:

```js
const itemsList = await readdir(`./storage${url}`);

res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify(itemsList));
```

For files, it uses a readable stream:

```js
const fileHandle = await open(`./storage${decodeURIComponent(url)}`);
const stats = await fileHandle.stat();

const readStream = fileHandle.createReadStream();
readStream.pipe(res);
```

## Preview and Download

Preview is handled through the file MIME type and streaming response.

Download is triggered with:

```text
?action=download
```

and the server sends:

```http
Content-Disposition: attachment
```

## Client-Server Architecture

```text
React Client
     │
     │ HTTP / Fetch
     ▼
Node.js Server
     │
     ▼
Storage / File System
     │
     └──── JSON or File Stream ────► Client
```

The client is responsible for the UI, while the server is responsible for file-system access and file operations.

## Technologies

### Frontend
- React
- JavaScript
- Vite
- HTML
- CSS

### Backend
- Node.js
- HTTP module
- `fs/promises`
- Readable Streams
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

- Client-server architecture
- Separation of concerns
- API communication
- React `useState`
- React `useEffect`
- `fetch()`
- JSON responses
- CORS
- Node.js HTTP servers
- File-system APIs
- Readable streams
- MIME types
- Query parameters

## Next Steps

- File upload
- Folder creation
- File deletion
- File renaming
- Better navigation
- File metadata
- Authentication and authorization
- Improved UI

## Status

**In Development**

Current milestone:

**Client and server separated + Read + Preview + Download implemented**

Next milestone:

**File Upload with Progress**
