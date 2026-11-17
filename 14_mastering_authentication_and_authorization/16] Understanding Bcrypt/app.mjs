import bcrypt from "bcrypt";

// const salt = await bcrypt.genSalt(14);

const hashedPassword = await bcrypt.hash(
  "password",
  "$2b$12$x.v2WY88Vvj1zfQgLSVHVO"
);

const storedPassword =
  "$2b$12$x.v2WY88Vvj1zfQgLSVHVOyKbSbQuOsTqvV6NevDlAYDSWs5qZwOO";

const a = await bcrypt.compare("password", storedPassword);

console.log(a);
