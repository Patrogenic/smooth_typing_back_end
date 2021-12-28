var path = require('path');
require('dotenv').config({path: path.join(__dirname, 'process.env')});

const PORT = 3001
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
