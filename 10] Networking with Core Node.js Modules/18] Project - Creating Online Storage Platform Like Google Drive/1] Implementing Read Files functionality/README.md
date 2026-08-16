# Online Storage Platform (Google Drive-like)

A Node.js project for building a simple online storage platform similar
to Google Drive. The current implementation focuses on **reading files
and browsing directories** from a storage folder.

## Current Progress

### ✅ Implemented: Read Functionality

The application can:

-   Start an HTTP server using Node.js `http` module.
-   Browse the `/storage` directory.
-   Read directory contents using `readdir()`.
-   Detect whether a requested path is a directory or a file.
-   Generate a dynamic HTML directory listing.
-   Open/read files using `fs/promises.open()`.
-   Create a readable stream with `fileHandle.createReadStream()`.
-   Pipe file data directly to the HTTP response.
-   Handle missing files/directories with a `Not Found!` response.
-   Ignore browser favicon requests.

## Technologies Used

-   Node.js
-   HTTP module
-   File System Promises API
-   Readable Streams
-   HTML
-   JavaScript

## Project Structure

``` text
storage/
├── images/
├── 2-11 Reverse Integer.mkv
├── hello.txt
├── Node.js Curriculum.pdf
├── numbers.txt
├── app.js
├── boilerPlate.html
└── package.json
```

> The exact files inside `storage/` can change as the project develops.

## How It Works

When a request arrives, the server checks the requested URL.

### 1. Directory Request

If the requested path is a directory:

``` js
const itemsList = await readdir(`./storage${decodeURIComponent(req.url)}`);
```

The application creates links for the files and folders inside that
directory and injects them into the HTML template.

### 2. File Request

If the requested path is a file:

``` js
const fileHandle = await open(`./storage${decodeURIComponent(req.url)}`);
const readStream = fileHandle.createReadStream();

readStream.pipe(res);
```

Instead of loading the entire file into memory, the file is read through
a stream and sent to the browser.

## Why Streams?

Using a readable stream is important for a storage application because
files can be large.

A stream allows the server to:

-   Read data in chunks.
-   Avoid loading the entire file into RAM.
-   Send data progressively to the client.
-   Handle large files more efficiently.

## Running the Project

Install dependencies if required:

``` bash
npm install
```

Start the server:

``` bash
node app.js
```

Then open:

``` text
http://localhost:3000
```

## Current Architecture

``` text
Browser
   │
   │ HTTP Request
   ▼
Node.js HTTP Server
   │
   ├── Directory?
   │      │
   │      └── Read directory → Generate HTML → Send response
   │
   └── File?
          │
          └── Open file → Create Read Stream → Pipe to response
```

## What's Next?

The next features planned for this storage platform are:

### 🔜 Preview Functionality

Files such as images, videos, PDFs, and text files will be previewed
directly in the browser where possible.

### 🔜 Download Functionality

Add support for downloading files from the storage platform instead of
only reading them through the browser.

## Learning Goals

This project is helping me understand:

-   Node.js HTTP servers
-   File system APIs
-   File handles
-   Readable streams
-   Stream piping
-   HTTP request/response handling
-   Dynamic HTML generation
-   Building a file-storage application from scratch

## Status

🚧 **In Development**

Current milestone:

**Directory browsing + file reading implemented**

Next milestone:

**File preview + file download**
