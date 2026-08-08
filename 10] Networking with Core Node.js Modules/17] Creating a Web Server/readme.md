# Creating a Web Server with Node.js

This project demonstrates how to create a basic web server using Node.js's built-in `http` and `fs` modules, without using Express or any other framework.

## 🚀 What I Learned

- Creating an HTTP server with Node.js
- Working with `http.createServer()`
- Understanding the `request` (`req`) and `response` (`res`) objects
- Reading files using Node.js streams
- Serving HTML files from a `public` directory
- Using `createReadStream()` to efficiently serve files
- Piping readable streams directly to the HTTP response
- Handling file-not-found errors
- Serving multiple static files based on the requested URL
- Accessing the server from another device on the local network

## 📁 Project Structure

```text
17 Creating a Web Server/
├── public/
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── script.js
│   ├── style.css
│   ├── favicon.ico
│   └── video.mkv
├── app.js
└── package.json
```

## 🛠️ Technologies Used

- Node.js
- HTTP Module
- File System (`fs`) Module
- JavaScript
- HTML
- CSS

## 💻 How It Works

The server is created using Node.js's built-in HTTP module:

```js
import http from "http";

const server = http.createServer((req, res) => {
    // Handle request
});
```

For the homepage, the server creates a readable stream for `index.html`:

```js
const readStream = createReadStream("./public/index.html");
readStream.pipe(res);
```

For other requested files, the URL is used to locate the corresponding file inside the `public` directory:

```js
const readStream = createReadStream(`./public${req.url}`);
readStream.pipe(res);
```

The `pipe()` method transfers data from the readable stream directly to the HTTP response.

## ▶️ Run the Project

Make sure Node.js is installed, then run:

```bash
node app.js
```

If the server starts successfully, you should see:

```text
Server started
```

Then open:

```text
http://localhost:4000
```

If the server is bound to your local network IP, it can also be accessed from another device connected to the same network:

```text
http://YOUR_LOCAL_IP:4000
```

## 📚 Key Concept

Instead of reading an entire file into memory with `readFile()`, this project uses:

```js
createReadStream()
```

and:

```js
readStream.pipe(res);
```

This is especially useful for larger files because data can be processed and sent in chunks rather than loading the complete file into memory at once.

## 🎯 Learning Goal

The goal of this project is to understand how a basic web server works internally using Node.js core modules before moving to higher-level frameworks such as Express.js.

## 👨‍💻 Author

**Sharvil Amburle**

Learning Node.js and Backend Development.
