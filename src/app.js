/**
 * All the middleware is imported and consumed here to be used by the application
 */

const express = require('express')
const config = require('../config')
require('express-async-errors')
const app = express()
const cors = require('cors')
const userRouter = require('./routes/userRoutes')
const typingTestRouter = require('./routes/typingTestRoutes')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
// const ticketsRouter = require('./controllers/tickets')
// const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
// app.use(middleware.requestLogger)

app.use('/api/user', userRouter);
app.use('/api/typingtest', typingTestRouter);

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app