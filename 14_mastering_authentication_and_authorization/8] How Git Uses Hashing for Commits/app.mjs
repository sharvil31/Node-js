import crypto from "crypto";
import { readFile } from "fs/promises";

const fileData = await readFile("hi.txt");
const newData = `blob ${fileData.length}\0${fileData}`;
const hash = crypto.createHash("sha1").update(newData).digest("hex");
console.log(hash);
