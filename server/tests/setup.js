const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

const connect = async () => {
  mongod = await MongoMemoryServer.create();

  await mongoose.connect(mongod.getUri(), { family: 4 });

  console.log("Connected to in-memory MongoDB");
};

const close = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

module.exports = { connect, close };
