/**
 * Entry point for the node.js application
 */

const app = require('./app')
const http = require('http')
const config = require('../config')
// const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`Server running on port 3000`)
})



/*
  Routes and Services:
  -analyzing typing data
  -users

  Data Models For:
  -users
  -typing data


  User Routes:
  /user/login (POST)
  /user/register (POST)

  Typing Routes:
  /typingtest
  GET: get all typing data for current user (which data?)
  --I will need to list statistics I will want to report to the user
  POST: submit new data from a finished typing test and return the results after analyzing on the server


  All Typing Data Routes:
  /all/typingtest
  GET: get all typing data for all users
  --this is still kind of vague and doesn't specify which data

*/