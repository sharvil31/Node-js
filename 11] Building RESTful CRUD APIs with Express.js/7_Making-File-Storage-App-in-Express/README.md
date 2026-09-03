# 📁 File Storage App — Express.js

A file storage application built with **React.js, Express.js, and Node.js**, allowing users to manage files and directories through a web interface.

This is an improved version of my previous storage application. While building it, I explored more advanced Express concepts such as **dynamic routing, Express Routers, CORS, preflight requests, nested directories, path handling, and path traversal vulnerabilities**.

The next goal is to move from directly exposing the physical storage structure to building a **Virtual File System (VFS)**.

---

## 🚀 Features

The current application supports:

- 📂 View directories
- 📁 Create directories
- 📁 Navigate through nested directories
- ⬆️ Upload files
- 👀 Open files
- 📥 Download files
- ✏️ Rename files
- 🗑️ Delete files
- 📊 Track upload progress
- 🔀 Dynamic client-side routing
- 🌐 CORS support

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Fetch API
- XMLHttpRequest

### Backend

- Node.js
- Express.js
- Express Router
- Node.js File System APIs
- Streams

---

## 📂 Project Structure

The backend is separated into different routers:

```text
server/
├── routes/
│   ├── directoryRoutes.js
│   └── fileRoutes.js
├── storage/
├── server.js
└── package.json
```

The frontend uses React Router for navigating through directories:

```text
client/
├── App.jsx
├── DirectoryView.jsx
└── ...
```

---

# 🔀 Express Router

Instead of keeping all routes inside `server.js`, I separated them into different routers.

```js
app.use("/directory", directoryRoutes);
app.use("/files", fileRoutes);
```

This creates a cleaner separation between:

- Directory operations
- File operations

For example:

```text
/directory
/files
```

This also makes the application easier to extend as more functionality is added.

---

# 📌 Dynamic Routing

The application supports nested directories.

For example:

```text
/
├── documents/
│   ├── resume.pdf
│   └── notes.txt
│
└── images/
    └── photo.jpg
```

The frontend uses React Router:

```js
const { "*": dirPath } = useParams();
```

This allows the same `DirectoryView` component to handle different directory paths.

For example:

```text
/
```

```text
/documents
```

```text
/documents/projects
```

```text
/documents/projects/node
```

The directory path changes dynamically without creating a separate React component for every folder.

---

# 🌐 CORS

The backend uses the `cors` package:

```js
import cors from "cors";

app.use(cors());
```

This allows the React frontend and Express backend running on different origins to communicate.

While working on CORS, I also learned about:

- Same-Origin Policy
- CORS
- Simple requests
- Non-simple requests
- Preflight requests
- `OPTIONS` requests
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

This helped me understand what happens before the browser sends certain cross-origin requests.

---

# 🔐 Path Traversal Vulnerability

While implementing nested directories, I learned about **Path Traversal**.

A naive implementation might directly concatenate user input:

```js
`./storage/${userPath}`;
```

User-controlled paths can potentially contain values such as:

```text
../
```

which could allow someone to attempt to access files outside the intended storage directory.

I started using Node's `path` module to normalize the path:

```js
const filePath = path.join("/", req.params[0]);
```

This was an important lesson because accepting filesystem paths directly from users introduces security considerations.

> Path normalization is an important step, but for a production application, I would also validate that the final resolved path remains inside the intended storage directory.

---

# 🌊 File Uploads With Streams

File uploads are handled using Node.js streams:

```js
const writeStream = createWriteStream(`./storage/${filePath}`);

req.pipe(writeStream);
```

The incoming request acts as a readable stream, while `createWriteStream()` creates a writable stream.

This allowed me to continue applying what I learned earlier about Node.js streams.

---

# 📤 Upload Progress

The React frontend uses `XMLHttpRequest` to monitor upload progress:

```js
xhr.upload.addEventListener("progress", (e) => {
  const totalProgress = (e.loaded / e.total) * 100;

  setProgress(totalProgress.toFixed(2));
});
```

This provides real-time upload progress to the user.

---

# 📁 Directory Operations

The backend currently supports creating and reading directories.

### Read Directory

```http
GET /directory/*
```

The server uses:

```js
readdir();
stat();
```

to retrieve directory contents and determine whether each item is a file or directory.

The response contains information such as:

```json
[
  {
    "name": "documents",
    "isDirectory": true
  },
  {
    "name": "resume.pdf",
    "isDirectory": false
  }
]
```

### Create Directory

```http
POST /directory/*
```

The server uses:

```js
mkdir();
```

to create a new directory.

---

# 📄 File Operations

### Upload

```http
POST /files/*
```

### Open / Download

```http
GET /files/*
```

The action is determined using a query parameter:

```text
?action=open
```

or:

```text
?action=download
```

### Rename

```http
PATCH /files/*
```

### Delete

```http
DELETE /files/*
```

---

# 🧠 What I Learned

This project helped me understand several important backend concepts:

### Express

- Express application setup
- Express Router
- Route handlers
- Dynamic routes
- Route parameters
- Query parameters
- Middleware

### HTTP

- HTTP methods
- Request and response lifecycle
- CORS
- Preflight requests
- `OPTIONS` requests

### Node.js

- File System APIs
- Streams
- File uploads
- Directory operations
- Path handling

### Security

- Path traversal vulnerabilities
- User-controlled filesystem paths
- Why filesystem structure shouldn't necessarily be exposed directly to clients

---

# ⚠️ Current Architecture Limitation

Currently, the application's URL structure is closely connected to the physical filesystem structure.

For example:

```text
Client URL
    ↓
/documents/projects/file.txt
    ↓
Physical filesystem
    ↓
storage/documents/projects/file.txt
```

This works for a learning project, but it creates several problems as the application grows.

### Performance

Working with deeply nested physical directories and repeatedly reading filesystem information can become expensive.

### Security

Exposing physical paths directly through URLs increases the amount of filesystem information exposed to the client.

### Abstraction

The client currently needs to know the actual directory structure.

A better architecture would separate the **virtual file structure** from the **physical storage structure**.

---

# 🚀 Next Step — Virtual File System (VFS)

The next version of this project will introduce a **Virtual File System**.

Instead of using the physical filename/path as the identity of a file, each file will have a unique ID.

For example:

```json
{
  "id": "f8a91c...",
  "originalName": "resume.pdf",
  "extension": ".pdf"
}
```

The physical storage could then look like:

```text
storage/
├── f8a91c...
├── 82b31d...
├── a91d72...
└── ...
```

The client doesn't need to know the actual physical filename.

---

# 🗃️ Planned File Database

I plan to create:

```text
fileDB.json
```

This database will initially contain information such as:

```json
[
  {
    "id": "abc123",
    "originalName": "resume.pdf",
    "extension": ".pdf"
  }
]
```

The database will act as a mapping between the **virtual file identity** and the **physical stored file**.

---

# 🎯 VFS Implementation Plan

The first version of the VFS will include:

### 1. Virtual File System

Build the VFS using:

- Express
- Local filesystem storage

### 2. Upload Route

Create an API for uploading files.

```http
POST /files
```

### 3. Download Route

Use the file ID instead of the physical filename.

```http
GET /files/:id
```

### 4. File Database

Create:

```text
fileDB.json
```

to maintain file metadata.

### 5. File Metadata

Initially store:

```text
id
originalName
extension
```

### 6. File ID

Use the generated ID to identify the physical file.

```text
file ID → physical storage file
```

### 7. Original Filename

Use the original filename and extension when displaying or downloading the file.

### 8. Storage Directory

Keep the actual file contents inside:

```text
storage/
```

---

# 🔮 Future Architecture

The goal is to eventually reach something like:

```text
                Client
                   │
                   ▼
              Express API
                   │
          ┌────────┴────────┐
          ▼                 ▼
      fileDB.json        storage/
          │                 │
          │                 ├── abc123
          │                 ├── xyz789
          │                 └── pqr456
          │
          └── Metadata
              ├── ID
              ├── Original Name
              └── Extension
```

This creates a layer of abstraction between the **user-facing virtual filesystem** and the **actual physical storage**.

---

## 📈 Learning Journey

This project is part of my Node.js and backend learning journey.

```text
Node.js
   ↓
HTTP Module
   ↓
Streams
   ↓
File Storage App
   ↓
Express.js
   ↓
Express Router
   ↓
Dynamic Routing
   ↓
CORS & Preflight
   ↓
Nested Directories
   ↓
Path Traversal
   ↓
Virtual File System
```

The goal isn't just to build a file manager.

I'm using the project to understand how real backend systems handle **routing, files, streams, storage, security, and abstraction**.
