import { num } from "./math.js";

const meta = import.meta
// console.log(meta.url);

const { filename, dirname } = import.meta;

console.log(filename, dirname);
