# Online Storage Platform (Google Drive-like)

A Node.js project for building a simple online storage platform similar to Google Drive. The project currently supports **directory browsing, file reading/previewing, and file downloading** using Node.js HTTP APIs and file streams.

## Current Progress

### ✅ Implemented Features

- HTTP server using Node.js `http` module
- Directory browsing
- Directory contents returned as JSON
- File reading using `fs/promises.open()`
- File streaming using `createReadStream()`
- File previewing in the browser
- File downloading using a query parameter
- MIME type detection using the `mime-types` package
- `Content-Type` response header
- `Content-Length` response header
- `Content-Disposition: attachment` for downloads
- CORS header support
- Basic error handling for missing files/directories

## Technologies Used

- Node.js
- JavaScript
- HTTP module
- `fs/promises`
- Readable Streams
- `mime-types`
- JSON
- HTML

## How It Works

The application uses the requested URL to determine whether the client wants a directory or a file.

### 1. Directory Browsing

When the requested path points to a directory, the application reads its contents and returns them as JSON.

```js
const itemsList = await readdir(`./storage${url}`);
res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify(itemsList));
```

### 2. File Preview

When a file is requested without the download action, the server streams the file to the response.

The MIME type is determined from the requested file:

```js
const contentType = mime.getType(url.slice(1));
```

The response includes the content type and file size:

```js
res.setHeader("Content-Type", mime.getType(url.slice(1)));
res.setHeader("Content-Length", stats.size);
```

The file is then streamed:

```js
readStream.pipe(res);
```

This allows supported files to be displayed or played directly by the browser.

### 3. File Download

A download can be requested using:

```text
?action=download
```

For example:

```text
http://localhost:80/hello.txt?action=download
```

The server then sends:

```http
Content-Disposition: attachment; filename="hello.txt"
```

This tells the browser to download the file instead of displaying it.

## Preview vs Download

The same file endpoint supports two behaviors:

```text
/file.ext
```

→ Preview/read the file when the browser supports its MIME type.

```text
/file.ext?action=download
```

→ Download the file.

## Streams

The project uses Node.js readable streams instead of loading the complete file into memory.

```js
const readStream = fileHandle.createReadStream();
readStream.pipe(res);
```

This is useful for large files because data can be processed and sent in chunks.

## Project Structure

```text
project/
├── storage/
│   ├── images/
│   ├── hello.txt
│   ├── numbers.txt
│   └── ...
├── app.js
├── boilerPlate.html
├── package.json
├── package-lock.json
└── README.md
```

## Running the Project

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node app.js
```

Then open:

```text
http://localhost:80
```

## Request Flow

```text
Browser
   │
   │ HTTP Request
   ▼
Node.js HTTP Server
   │
   ├── Directory?
   │      └── Read directory → Return JSON
   │
   └── File?
          │
          ├── Preview
          │      └── Detect MIME type → Set headers → Stream file
          │
          └── Download
                 └── Set Content-Disposition → Stream file
```

## What I Learned

- Node.js HTTP servers
- HTTP request and response headers
- File system APIs
- File handles
- Readable streams
- Stream piping
- MIME types
- `Content-Type`
- `Content-Length`
- `Content-Disposition`
- Query parameters
- Dynamic file serving
- Directory handling
- Browser file preview behavior

## Next Steps

With reading, preview, and download functionality completed, the next features can include:

- File upload
- File deletion
- File renaming
- Folder creation
- Better navigation/UI
- File metadata
- Authentication and authorization

## Status

🚧 **In Development**

Current milestone:

**Directory browsing + Read + Preview + Download implemented**

Next milestone:

**Upload and file-management functionality**
