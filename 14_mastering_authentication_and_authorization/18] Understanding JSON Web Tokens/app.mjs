import jwt from "jsonwebtoken";
import { createHmac } from "crypto";

// const token = jwt.sign({ name: "Bilal" }, "secret");

// console.log(token);

// console.log(
//   Buffer.from(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmlsYWwiLCJpYXQiOjE3OTQ5NzM2Nzl9",
//     "base64url",
//   ).toString(),
// );

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmlsYWwiLCJpYXQiOjE3OTQ5NzM2Nzl9.m_51tNCbex53PatRsZ1W1YBqyJea58W1tzY4QL-hqgE";

console.log(
  createHmac("sha256", "secret")
    .update(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmlsYWwiLCJpYXQiOjE3OTQ5NzM2Nzl9",
    )
    .digest("base64url"),
);
