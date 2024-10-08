const express = require("express")
const cors = require("cors")
const pool = require("./db/db")

const app = express()
const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Women in Tech Events hub." });
  });

  app.get("/events", (req, res) => {
    res.json({ message: "Here are all the events on offer." });
  });

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})

