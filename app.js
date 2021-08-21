const express = require("express")
const Http = require("http")
const cors = require("cors")
const router = require("./routers/router")
const cookieparser = require("cookie-parser")
const nunjucks = require("nunjucks");
const socketIO = require("./socket");
const session = require("express-session");
// const redis = require('redis')
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger/swagger-output.json");
const morgan = require("morgan")


require('dotenv').config();
const port = 4001
const app = express()

/*const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
})
const geo = require('georedis').initialize(redisClient)*/

// const Https = require("https");
// const fs = require("fs")
// const domainName = 'astraios.shop'
// const options = { // letsencrypt로 받은 인증서 경로를 입력
//     ca: fs.readFileSync(`/etc/letsencrypt/live/${domainName}/fullchain.pem`),
//     key: fs.readFileSync(`/etc/letsencrypt/live/${domainName}/privkey.pem`),
//     cert: fs.readFileSync(`/etc/letsencrypt/live/${domainName}/cert.pem`),
// };
//
//
// const https = Https.createServer(options, app)
//     .listen(443, () => {
//         console.log(`localhost: https://localhost:${port}`);
//     });

const http = Http.createServer(app)
    .listen(port, () => {
        console.log(`localhost: http://localhost:${port}`);
    })

// TODO Test Only Module
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
})

app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    // 맨 뒤에 .shop/중에서 /를 삭제해야 사용할 수 있다.
    origin: ["http://localhost:3000", "moyeora.org"],
    credentials: true
}))
// app.use(morgan("combined"));
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

// app.use((req, res, next) => {
//     req.client = redisClient;
//     req.geo = geo;
//     next();
// })

app.use("/api", router)

app.get('/maps', (req, res) => {
    res.render("maps")
});
app.get('/mapskeywordsearch', (req, res) => {
    res.render("maps_keywordSearch")
});
app.get('/locationaddress', (req, res) => {
    res.render("maps_LocationAddress")
});

app.get('/socketmaps2', (req, res) => {
    res.render("socket_maps2")
});

app.get('/socketmaps3', (req, res) => {
    res.render("socket_maps3")
});

app.get('/socketmaps5', (req, res) => {
    res.render("socket_maps5")
});

app.get('/socketmaps10', (req, res) => {
    res.render("socket_maps10")
});

app.get('/socketmaps46', (req, res) => {
    res.render("socket_maps46")
});

app.get('/socketmaps47', (req, res) => {
    res.render("socket_maps47")
});

app.get('/room', (req, res) => {
    res.render("main_room")
});
app.get('/room/my', (req, res) => {
    res.render("main_room_my")
});

app.get('/chat/:postId', (req, res) => {
    res.render("chat", {postId: req.params.postId})
});


// socketIO(https, app);
socketIO(http, app);

// module.exports = http