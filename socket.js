const SocketIO = require("socket.io")
const socketAuthMiddleWare = require("./middleware/socket-auth-middleware")
const socketAuthMiddleWareChat = require("./middleware/socket-auth-middleware_chat")
const {Channels, Posts, sequelize, Sequelize} = require("./models")
const redis = require('redis')
const fs = require("fs");
const Joi = require("./routers/joi_Schema");
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
})
const geo = require('georedis').initialize(redisClient)

// setInterval(function () {
//     // 만약 생성된지 6시간 지난 location이 있다면, 지워라
// redisClient.DEL('geo:locations', function (error, reply) {
//     if (error) console.log(error);
// })
// }, 60000)

module.exports = (server, app) => {
    let loginUser = {} //접속한 UserId가 사용하는 Socket의 아이디를 설정한다.
    let loginChatUser = {}; // 모임의 접속한 유저들을 저장하는 객체
    const geoOptions = {
        withCoordinates: true, // 일치하는 항목의 경도, 위도 좌표를 반환, default false
        withDistances: true, // 지정된 중심에서 항목의 거리를 반환, default false
        order: 'ASC', // 가장 가까운 것 부터 정렬, 'DESC' or true (same as 'ASC'), default false
        units: 'm', // m (Meters), km (Kilometers), mi (Miles), ft (Feet), default 'm'
        count: 50, // N개의 일치하는 항목으로 결과를 제한, default undefined (All)
        accurate: true, // Useful if in emulated mode and accuracy is important, default false
    }

    // GeoRedis Location 더미 데이터 생성
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

        '20': {latitude: 35.85618567277376, longitude: 128.63275935627814}, // 대구 KBS
        '21': {latitude: 35.85742020536634, longitude: 128.63209836072522}, // 수성구청 역
        '22': {latitude: 35.856331197160394, longitude: 128.6286777048585}, // 대구여고 마을
        '23': {latitude: 35.85719220896354, longitude: 128.62764924344924}, // W 오피스텔
        '24': {latitude: 35.85752603220386, longitude: 128.62628896758892}, // 대구여고 마을
        '25': {latitude: 35.85573882947642, longitude: 128.6294985578524}, // 대구여고 마을
        '26': {latitude: 35.866305268282744, longitude: 128.59284327495126}, // 반월당
    }
    geo.addLocations(locationSet, function (err, reply) {
        if (err) console.error(err)
    })

    const io = SocketIO(server, {
        path: "/socket.io",
        cors: {origins: '*:*'},
    })

    app.set('io', io); // Socket을 Express Router에서 사용할 수 있도록 설정
    const location = io.of('/location'); // 사용자 위치 Location 소켓 네임 스페이스
    const room = io.of("/room"); // 모임 리스트 소켓 네임 스페이스
    const chat = io.of("/chat"); // 대화방 소켓 네임 스페이스


    location.use(socketAuthMiddleWare) // Location Socket 미들 웨어
    location.on("connection", async (socket) => { // 사용자 위치 네임 스페이스
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const {userId: socketUserId} = socket.user;
        const MAX_DISTANCE = 700000;
        let radiusDistance = 700000;
        console.log('Location Socket Connect / IP :', ip, socket.id);
        console.log(socketUserId);

        if (loginUser[socketUserId]) {
            console.log(`Duplicatie Socket Id : ${loginUser[socketUserId]}, ${socket.id}`);

            // 이전에 접속한 유저에게 연결을 종료한다는 메시지를 보냅니다.
            location.to(loginUser[socketUserId]).emit("closeEvent");
            // 접속을 시도한 유저에게 연결을 종료한다는 메시지를 보냅니다.
            location.to(socket.id).emit("closeEvent");

            // 이전에 접속한 유저의 연결을 종료합니다.
            await location.to(loginUser[socketUserId]).disconnectSockets();

            // 로그인 중인 유저 목록에서 접속중인 유저를 삭제합니다.
            delete loginUser[socketUserId]
            return;
        }

        loginUser[socketUserId] = socket.id

        //사용자의 위치정보를 지정된 시간마다 가져온다.
        socket.on("latlng", (locationData) => {
            try {
                const {lat, lng} = locationData;

                // Redis의 geo:locations 만료시간을 기록하는 별도의 테이블을 생성한다.
                redisClient.ZADD('geo:locations:expire', new Date().getTime(), socketUserId)

                // Redis 내부에 geo:locations에 이미 데이터가 존재하더라도 덮어쓰기 된다. ☆
                geo.addLocation(socketUserId, {latitude: lat, longitude: lng}, (error, reply) => {
                    if (error) console.error(error);
                })
            } catch (error) {
                console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            }
        })

        //사용자의 검색 반경을 지정한다.
        socket.on("changeDistance", (distanceData) => {
            try {
                Joi.socketDistanceSchema.validateAsync(distanceData)
                    .then((result) => {
                        const {distance} = result;
                        if (distance <= MAX_DISTANCE)
                            radiusDistance = distance
                    })
            } catch (error) {
                console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            }
        })

        // 3초마다 접속한 클라이언트로 지정한 반경 이내에 존재하는 다른 유저의 위치정보를 전송
        // GEORADIUSBYMEMBER geo:locations 1 5000 m WITHCOORD ASC
        socket.interval = setInterval(() => {
            // GEORADIUSBYMEMBER의 member룰 숫자로 정의할 경우 형식 에러가 발생한다.
            geo.nearby(`${socketUserId}`, radiusDistance, geoOptions, function (err, locations) {
                if (err) console.error(err)
                else socket.emit("userLocation", locations)
            })
        }, 3000);

        //Location 소켓 접속 종료 시
        socket.on("disconnect", () => {
            delete loginUser[socketUserId]
            console.log("Location Socket Client Disconnect / IP :", ip, socketUserId);

            clearInterval(socket.interval);
        })

        //Location 소켓 에러 발생 시
        socket.on("error", (error) => {
            console.error(error);
        })
    });

    // 모임 리스트 네임 스페이스
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


    
    chat.use(socketAuthMiddleWareChat) 
    chat.on("connect", async (socket) => { // 대화방 네임 스페이스
        const req = socket.request; // Request
        const {userId: socketUserId, nickname} = socket.user

        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //접속한 유저의 IP를 가져옴
        const postId = Number(socket.handshake.query.postId); // get Query로 들어온 postId 값을 roomId로 지정한다.

        if (Object.keys(loginChatUser).indexOf(String(postId)) == -1) { // postId 방이 생성되어있는지 확인한다.
            loginChatUser[postId] = {}
        }
        loginChatUser[postId][socketUserId] = socket.id
        io.loginChatUser = loginChatUser;

        console.log('chat Socket Connect', ip, postId);
        socket.join(postId); //postId를 기준으로 socket 방을 join 한다.

        socket.on("disconnect", () => {
            console.log("chat Socket Client Disconnect IP : ", ip);

            delete loginChatUser[postId][socketUserId]
            clearInterval(socket.interval);
        })

        socket.on("error", (error) => {
            console.error(error);
        })
    })

}
