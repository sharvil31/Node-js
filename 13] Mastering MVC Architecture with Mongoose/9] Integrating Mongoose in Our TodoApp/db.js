import mongoose from "mongoose";

try {
  await mongoose.connect(
    "mongodb://admin:admin@localhost:27017/todoApps?authSource=admin",
  );
  console.log("Database connected");
} catch (error) {
  console.log(error.message);
  process.exit(1); // process is exited beacuse of error
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Client Disconnected!");
  process.exit(0); // We shut dowm ourself not because of an error
});
