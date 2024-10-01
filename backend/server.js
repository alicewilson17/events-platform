const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())
app.listen(5432, () => console.log("Server on localhost:5432"))

