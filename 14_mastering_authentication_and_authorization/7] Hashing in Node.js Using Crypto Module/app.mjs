import crypto from "crypto";
import { readFileSync } from "fs";

// const hash = crypto.createHash("sha256").update("Hello World").digest("hex");
const hash = crypto.createHash("sha256").update("Hello ").update("World").digest("hex");
// const hash = crypto.createHash("sha256").update(Buffer.from("Hello World")).digest("hex");

// const filData = readFileSync("E:\\BLEACH\\141 - Bleach [Dual] [1080p] @Anime_Wars.mp4.mkv")

// const hash = crypto.createHash("sha256").update(filData).digest("hex");
console.log(hash);
