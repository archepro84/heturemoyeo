const express = require("express")
const Http = require("http")
const cors = require("cors")
const router = require("./routers/router")
const cookieparser = require("cookie-parser")
const socketIO = require("./socket");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger/swagger-output.json");
const morgan = require("morgan")

require('dotenv').config();
const port = 4001
const app = express()

const http = Http.createServer(app)
    .listen(port, () => {
        console.log(`localhost: http://localhost:${port}`);
    })

app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: ["http://localhost:3000", "moyeora.org"],
    credentials: true
}))
app.use(morgan("combined"));
app.use(express.static('public'));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(
    session({
        resave: false, // Session 재저장 여부
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET, // Session 암호화 Key
        rolling: true, // 로그인 상태에서 페이지 이동 시마다 Session값 변경 여부
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
);

app.use("/api", router)

socketIO(http, app);
