# Virtual File System (VFS) — File Storage App

A file storage application built with **Node.js, Express.js, React, and a Virtual File System (VFS) architecture**.

This project started as a basic file storage application using Node.js core modules and Express.js. I have now redesigned the storage structure using a VFS approach where the **logical file and directory structure is managed through metadata**, while the actual files are stored separately using unique IDs.

---

## 🚀 Current Progress

The VFS currently supports complete CRUD operations for:

- 📁 Directories
- 📄 Files
- 🔗 Parent-child relationships
- 🗑️ Recursive directory deletion
- ✏️ File renaming
- ✏️ Directory renaming
- 📤 File uploading
- 📥 File downloading
- 📂 Nested directory navigation

The frontend is built with React and communicates with the Express REST APIs.

---

## 🏗️ VFS Architecture

Instead of storing files using their original names and physical directory paths, the application separates:

### Logical Storage

The logical structure is maintained through JSON metadata:

```text
User
 └── Root Directory
      ├── Files
      └── Directories
           └── Files
```

### Physical Storage

Actual file contents are stored separately:

```text
storage/
├── UUID-1.png
├── UUID-2.pdf
├── UUID-3.jpg
└── ...
```

The original filename and directory relationship are stored as metadata.

This allows the physical storage structure to remain independent from the logical directory structure.

---

## 📁 Directory Metadata

`directoriesDB.json` stores directory information.

Example:

```json
{
  "id": "ee7a18e7-c768-4e53-8b46-48541df21385",
  "name": "bbb",
  "parentDirId": "e13da112-8660-4e1c-80fd-ea11013a4551",
  "files": [],
  "directories": []
}
```

Each directory contains:

- `id` — unique directory identifier
- `name` — directory name
- `parentDirId` — parent directory ID
- `files` — IDs of files inside the directory
- `directories` — IDs of child directories

---

## 📄 File Metadata

`filesDB.json` stores information about uploaded files.

Example:

```json
{
  "id": "00b134b6-bee6-4111-8363-d16174627b98",
  "extension": ".png",
  "name": "shivkrupa Graphics.png",
  "parentDirId": "e13da112-8660-4e1c-80fd-ea11013a4551"
}
```

Each file contains:

- `id` — unique file identifier
- `name` — original filename
- `extension` — file extension
- `parentDirId` — directory containing the file

---

# 🔌 REST API

## 📁 Directory APIs

### Read Directory

```http
GET /directory/:id?
```

If no ID is provided, the root directory is returned.

The API resolves the directory's:

- Files
- Child directories

---

### Create Directory

```http
POST /directory/:parentDirId?
```

Directory names are passed through the request headers.

The new directory receives a UUID and is added to the parent's `directories` array.

---

### Rename Directory

```http
PATCH /directory/:id
```

Request body:

```json
{
  "newDirName": "New Directory Name"
}
```

---

### Delete Directory

```http
DELETE /directory/:id
```

Directory deletion is recursive.

For example:

```text
Documents
 ├── resume.pdf
 ├── Projects
 │    ├── app.js
 │    └── notes.txt
 └── Images
      └── photo.png
```

Deleting `Documents` removes:

- All files inside it
- All nested directories
- Files inside nested directories
- Directory metadata
- File metadata
- Parent-child references

---

# 📄 File APIs

## Upload File

```http
POST /file/:parentDirId?
```

The filename is sent through the `filename` request header.

The server:

1. Generates a UUID
2. Extracts the file extension
3. Stores the physical file using the UUID
4. Creates file metadata
5. Adds the file ID to the parent directory
6. Updates the JSON databases

Physical storage:

```text
storage/
└── 00b134b6-bee6-4111-8363-d16174627b98.png
```

---

## Read / Open File

```http
GET /file/:id
```

The server uses the file ID to find its metadata and locate the physical file.

---

## Download File

```http
GET /file/:id?action=download
```

The response includes a `Content-Disposition` header so the browser downloads the file using its original filename.

---

## Rename File

```http
PATCH /file/:id
```

Request body:

```json
{
  "newFilename": "new-name.pdf"
}
```

Only the metadata is renamed. The physical file does not need to be renamed because it is identified by its UUID.

---

## Delete File

```http
DELETE /file/:id
```

The server:

1. Deletes the physical file
2. Removes the file metadata
3. Removes the file ID from its parent directory
4. Saves the updated databases

---

# ⚛️ React Frontend

The frontend uses:

- React
- React Router
- Fetch API
- XMLHttpRequest

### Current frontend functionality

- Browse directories
- Open nested directories
- Upload files
- Show upload progress
- Open files
- Download files
- Rename files
- Delete files
- Create directories
- Rename directories
- Delete directories

The UI communicates with the VFS REST APIs instead of directly interacting with the physical filesystem.

---

# 🧠 What I Learned

Through this project, I have been learning how a file storage system can separate **logical organization from physical storage**.

### VFS Concepts

- Unique resource IDs
- File metadata
- Directory metadata
- Parent-child relationships
- Logical paths
- Flat physical storage
- Recursive deletion
- REST API design
- Express Router
- File streams
- HTTP request headers
- React Router
- API integration

One of the important concepts I learned is that a filename does not have to determine where the actual file is physically stored.

For example:

```text
Logical:

root/
 └── Projects/
      └── app.pdf
```

can correspond to:

```text
Physical:

storage/
 └── 550e8400-e29b-41d4-a716-446655440000.pdf
```

The relationship between them is maintained through metadata.

---

# 🛠️ Tech Stack

### Frontend

- React
- React Router
- JavaScript
- Fetch API
- XMLHttpRequest

### Backend

- Node.js
- Express.js
- Express Router
- REST APIs
- File Streams
- FS / FS Promises
- UUID

### Storage

- JSON-based metadata
- Local filesystem for physical file storage

---

# 📌 Current Status

### Completed

- [x] File upload
- [x] File read/open
- [x] File download
- [x] File rename
- [x] File delete
- [x] Directory create
- [x] Directory read
- [x] Directory rename
- [x] Directory delete
- [x] Nested directories
- [x] Parent-child directory relationships
- [x] Recursive directory deletion
- [x] VFS metadata-based structure
- [x] React integration

### 🚧 Next Steps

- [ ] Replace current upload implementation with Multer
- [ ] Improve the storage application UI
- [ ] Add simple login functionality
- [ ] Add user-specific file access
- [ ] Add logout functionality
- [ ] Add user profile functionality
- [ ] Connect users with their own VFS/root directories
- [ ] Improve authentication and authorization

---

# 🎯 Future Architecture

The next major step is introducing users into the VFS.

The planned structure is:

```text
User
 └── Root Directory
      ├── Files
      └── Directories
           ├── Files
           └── Directories
```

This will allow the application to move from a single-user file storage system toward a **multi-user file storage application** where each user can access only their own resources.

---

## 📚 Project Journey

This project is part of my backend learning journey with Node.js.

I started by working with:

```text
Node.js Core Modules
        ↓
HTTP Server
        ↓
Streams
        ↓
File Storage
        ↓
Express.js
        ↓
REST APIs
        ↓
CORS
        ↓
Express Routers
        ↓
Virtual File System
        ↓
Authentication & Authorization
```

The goal is to understand how real-world backend systems are designed by progressively building the features instead of only learning them theoretically.
