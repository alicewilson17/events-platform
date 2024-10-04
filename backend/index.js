const express = require("express")
const cors = require("cors")
const pool = require("./db/db")

const app = express()
const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cors())
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})

