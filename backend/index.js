const express = require("express")
const {swaggerDocs, swaggerUi} = require("./utils/swagger")
const cors = require("cors")
const db = require("./db/db")
const authRoutes = require('./routes/authRoutes')
const eventsRoutes = require('./routes/eventsRoutes')
const usersRoutes = require('./routes/usersRoutes')

const { handleCustomErrors, handleInvalidEndpoint, handlePSQLErrors, handleServerError, handleBadMethod } = require("./middleware/errorHandlingMiddleware")

const app = express()

// Serve the Swagger documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }));

//log in and sign up routes
app.use('/api/auth', authRoutes);  // Auth-related routes
app.use('/api/events', eventsRoutes)
app.use('/api/users', usersRoutes) 

//error handling middleware
app.use(handleCustomErrors)
app.use(handleInvalidEndpoint)
app.use(handlePSQLErrors)
app.use(handleServerError)
app.use(handleBadMethod)

module.exports = app