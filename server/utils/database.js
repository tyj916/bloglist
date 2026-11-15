const config = require('./config');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const logger = require('./logger');

let mongod

const connectToDatabase = async() => {
  if (process.env.NODE_ENV === 'test') {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log("Connected to MongoDB Memory Server");
  } else {
    try {
      await mongoose.connect(config.MONGODB_URI, { family: 4 });
      console.log("Connected to MongoDB Atlas");
    } catch (error) {
      logger.error("Error connecting to MongoDB:", error.message);
    }
  }
};

const closeDatabase = async() => {
  await mongoose.connection.close();

  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectToDatabase, closeDatabase }
