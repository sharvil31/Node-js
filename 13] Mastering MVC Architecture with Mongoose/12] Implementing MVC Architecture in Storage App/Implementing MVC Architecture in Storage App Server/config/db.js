import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb://sharvil:sharvil123@localhost:27017/storageApp",
    );

    console.log("Database Connected");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to the database");
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Database Disconnected!");
  process.exit();
});
