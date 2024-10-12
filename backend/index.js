const express = require("express")
const {swaggerDocs, swaggerUi} = require("./utils/swagger")
const cors = require("cors")
const db = require("./db/db")
const authRoutes = require('./routes/authRoutes')
const eventsRoutes = require('./routes/eventsRoutes')
const { handleCustomErrors, handleInvalidEndpoint, handlePSQLErrors, handleServerError, handleBadMethod } = require("./middleware/errorHandlingMiddleware")

const app = express()
const PORT = process.env.PORT || 5001

// Serve the Swagger documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }));

//log in and sign up routes
app.use('/api/auth', authRoutes);  // Auth-related routes
app.use('/api/events', eventsRoutes)

// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to Women in Tech Events hub." });
//   });


//error handling middleware
app.use(handleCustomErrors)
app.use(handleInvalidEndpoint)
app.use(handlePSQLErrors)
app.use(handleServerError)
app.use(handleBadMethod)

  app.get("/users", async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users')
   return res.json(users.rows)
  }
catch(err) {
    console.log(err)
}});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Swagger docs available at ${PORT}/api-docs`)})

module.exports = app