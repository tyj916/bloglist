const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const { connectToDatabase } = require("./utils/database");

console.log("INDEX.JS EXECUTED");

const start = async () => {
  try {
    // logger.info("Connecting to", config.MONGODB_URI);
    console.log("Connecting to mongodb...");
    await connectToDatabase();
    console.log("Connected to MongoDB");
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

start();
