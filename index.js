const connectToMongo = require("./db");
const express = require("express");

connectToMongo();
const app = express()
const port = 5000

app.use(express.json())

//Auth User Route
app.use('/api/auth', require("./routes/auth"))

//Notes
app.use("/api/notes", require("./routes/notes"))



app.listen(port , ()=> console.log(`App listening at port ${port}`))