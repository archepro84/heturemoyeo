const SocketIO = require("socket.io")
const socketAuthMiddleWare = require("./middleware/socket-auth-middleware")
const {Posts, sequelize, Sequelize} = require("./models")
const redis = require('redis')
const fs = require("fs");
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
})
const geo = require('georedis').initialize(redisClient)


setInterval(function () {
    // 만약 생성된지 6시간 지난 location이 있다면, 지워라

}, 60000)

module.exports = (server, app) => {
    let loginUser = {} //접속한 UserId가 사용하는 Socket의 아이디를 설정한다.
    const geoOptions = {
        withCoordinates: true, // 일치하는 항목의 경도, 위도 좌표를 반환, default false
        withDistances: true, // 지정된 중심에서 항목의 거리를 반환, default false
        order: 'ASC', // 가장 가까운 것 부터 정렬, 'DESC' or true (same as 'ASC'), default false
        units: 'm', // m (Meters), km (Kilometers), mi (Miles), ft (Feet), default 'm'
        accurate: true, // Useful if in emulated mode and accuracy is important, default false
    }


    const locationSet = {
        '2': {latitude: 37.5671461, longitude: 126.9309533},
        '3': {latitude: 37.5679144, longitude: 126.9344071},
        '4': {latitude: 37.562110, longitude: 126.941069},
        '5': {latitude: 37.564304, longitude: 126.933688},
        '6': {latitude: 37.561851, longitude: 126.944231},
        '7': {latitude: 37.559209, longitude: 126.939785},
        '8': {latitude: 37.5663129, longitude: 126.9316755},
        '11': {latitude: 35.867960744332244, longitude: 128.6352843455837}, //마 보노 유치원
        '12': {latitude: 35.8663227899076, longitude: 128.63512890641002}, // 새범어
        '13': {latitude: 35.86514753509743, longitude: 128.63606790888352}, //비성 빌라
        '14': {latitude: 35.86529023619457, longitude: 128.63485306412625}, //약국
        '15': {latitude: 35.86717621007772, longitude: 128.63068483731408}, //LPG
        '16': {latitude: 35.86517136691063, longitude: 128.6336549866826}, // 인생의 갈림길
    }
    geo.addLocations(locationSet, function (err, reply) {
        if (err) console.error(err)
    })

    const io = SocketIO(server, {
        path: "/socket.io",
        cors: {origins: '*:*'},
    })

    app.set('io', io);
    const location = io.of('/location');
    const room = io.of("/room");
    const chat = io.of("/chat");


    location.use(socketAuthMiddleWare)
    location.on("connection", async (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const {userId: socketUserId} = socket.user;
        console.log('Location Socket Connect / IP :', ip);

        if (loginUser[socketUserId]) {
            console.log(`Duplicatie Socket Id : ${loginUser[socketUserId]}, ${socket.id}`);

            // 이전에 접속한 유저에게 연결을 종료한다는 메시지를 보냅니다.
            location.to(loginUser[socketUserId]).emit("closeEvent");
            // 접속을 시도한 유저에게 연결을 종료한다는 메시지를 보냅니다.
            location.to(socket.id).emit("closeEvent");

            // 이전에 접속한 유저의 연결을 종료합니다.
            await io.in(loginUser[socketUserId]).fetchSockets();

            // 로그인 중인 유저 목록에서 접속중인 유저를 삭제합니다.
            delete loginUser[socketUserId]
            return;
        }

        loginUser[socketUserId] = socket.id

        socket.on("latlng", (LocationData) => {
            try {
                const {lat, lng} = LocationData;
                // Redis 내부에 geo:locations에 이미 데이터가 존재하더라도 덮어쓰기 된다. ☆
                geo.addLocation(socketUserId, {latitude: lat, longitude: lng}, (error, reply) => {
                    if (error) console.error(error);
                    // else console.log(`add Location : ${reply}`);
                })
            } catch (error) {
                console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            }
        })

        // 3초마다 클라이언트로 모든 유저의 위치 전송
        // GEORADIUSBYMEMBER geo:locations 1 5000 m WITHCOORD ASC
        socket.interval = setInterval(() => {
            // GEORADIUSBYMEMBER의 member룰 숫자로 정의할 경우 형식 에러가 발생한다.
            geo.nearby(`${socketUserId}`, 50000, geoOptions, function (err, locations) {
                if (err) console.error(err)
                else {
                    socket.emit("userLocation", locations)
                }
            })
        }, 3000);

        socket.on("disconnect", () => {
            delete loginUser[socketUserId]
            console.log("Location Socket Client Disconnect / IP :", ip, socketUserId);

            clearInterval(socket.interval);
        })

        socket.on("error", (error) => {
            console.error(error);
        })
    });

    room.on("connect", (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('room Socket Connect', ip);

        socket.on("disconnect", () => {
            console.log("room Socket Client Disconnect", ip, socket.id);
            clearInterval(socket.interval);
        })

        socket.on("error", (error) => {
            console.error(error);
        })
    })

    let loginChatUser = {};

    chat.use(socketAuthMiddleWare)
    chat.on("connect", (socket) => {
        const req = socket.request; // Request
        const {socketUserId: userId, nickname} = socket.user
        //접속한 유저의 IP를 가져옴
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // get Query로 들어온 postId 값을 roomId로 지정한다.
        const postId = Number(socket.handshake.query.postId);

        // loginChatUser[postId] = socket.id

        console.log('chat Socket Connect', ip, postId);
        //postId를 기준으로 socket 방을 join 한다.
        socket.join(postId);


        socket.on("disconnect", () => {
            console.log("chat Socket Client Disconnect IP : ", ip);
            clearInterval(socket.interval);
        })

        socket.on("error", (error) => {
            console.error(error);
        })
    })

}