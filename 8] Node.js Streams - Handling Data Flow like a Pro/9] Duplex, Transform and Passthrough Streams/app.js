// Duplex, Transform and Passthrough Streams

import fs, { write } from "fs";
import { Readable, Writable, Duplex, Transform, PassThrough } from "stream";

// reading and Writing data using separate read and write stream
const readStream = fs.createReadStream(
  "E:\\[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv",
  { highWaterMark: 1 * 1024 * 1024 },
);
const writeStream = fs.createWriteStream("streams.mp4", {
  highWaterMark: 1 * 1024 * 1024,
});

// Readable & Writable - Imported from Streams. allows to extend read and write streams with extra properties according to us.

// Duplex Stream - Contains working of both readStream and writeStream. While working with net modules we get a Socket. sockets connects two node.js applications. We can write from one end and listen from another end on same socket. 

// Transform Stream - there are two states of Transform Stream. one is Passthruogh Stream and one is true transform Stream. A Transform Stream is a specific case of a Duplex Stream. A Duplex Stream becomes a Transform Stream when Same data was read get write with some tranformation like water and ice, ice is also a water but in different form. When same data which which was read get write then its a passthrough stream.