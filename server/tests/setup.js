const mongoose = require('mongoose');
const config = require('../utils/config');

const connect = async () => {
  await mongoose.connect(config.MONGODB_URI, { family: 4 });
};

const close = async () => {
  await mongoose.connection.close();
};

module.exports = { connect, close };
