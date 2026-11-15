const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const { connectToDatabase } = require("./utils/database");

const start = async () => {
  try {
    // logger.info("Connecting to", config.MONGODB_URI);
    logger.info("Connecting to mongodb...");
    await connectToDatabase();
    logger.info("Connected to MongoDB");
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

start();
