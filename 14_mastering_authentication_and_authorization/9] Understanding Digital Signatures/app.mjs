import crypto from "node:crypto";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";

const fileContent = await readFile("loan-agreement.md");
const mySecretKey = "my-super-secret-key";

const hash = crypto
  .createHash("sha256")
  .update(fileContent)
  .update(mySecretKey)
  .digest("base64url");

const writeStream = createWriteStream("loan-agreement-signed.md");

writeStream.write(fileContent);
writeStream.end(hash);
console.log(hash);

// const hmac = createHash(originalData + secretData)
// SignedFile = originalData + signature
