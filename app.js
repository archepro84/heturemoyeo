const express = require("express")
const Http = require("http")
const cors = require("cors")
const router = require("./routers/router")
const port = 4001;

const app = express()
const http = Http.createServer(app)


app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cors())

app.use("/api", router)

http.listen(port, () => {
    console.log(`localhost:  http://localhost:${port}`);
})

module.exports = http