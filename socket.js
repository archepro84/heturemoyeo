const SocketIO = require("socket.io")
const socketAuthMiddleWare = require("./middleware/socket-auth-middleware")
const {Posts, sequelize, Sequelize} = require("./models")

module.exports = (server, app) => {
    let userLocation = {} //모든 User한테 전달할 Object를 설정한다.
    let loginUser = {} //접속한 UserId가 사용하는 Socket의 아이디를 설정한다.
    userLocation[2] = {lat: 37.5671461, lng: 126.9309533}
    userLocation[3] = {lat: 37.5679144, lng: 126.9344071}

    userLocation[4] = {lat: 37.562110, lng: 126.941069}
    userLocation[5] = {lat: 37.564304, lng: 126.933688}
    userLocation[6] = {lat: 37.561851, lng: 126.944231}
    userLocation[7] = {lat: 37.559209, lng: 126.939785}
    userLocation[8] = {lat: 37.5663129, lng: 126.9316755}

    const io = SocketIO(server, {path: "/socket.io", cors: {origins: '*:*'}})

    app.set('io', io);
    const location = io.of('/location');
    const room = io.of("/room");
    const chat = io.of("/chat");


    location.use(socketAuthMiddleWare)
    location.on("connection", async (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('Location Socket Connect / IP :', ip);

        if (loginUser[socket.userId]) {
            console.log(`Duplicatie Socket Id : ${loginUser[socket.userId]}, ${socket.id}`);

            // 이전에 접속한 유저에게 연결을 종료한다는 메시지를 보냅니다.
            location.to(loginUser[socket.userId]).emit("closeEvent");
            // 접속을 시도한 유저에게 연결을 종료한다는 메시지를 보냅니다.
            location.to(socket.id).emit("closeEvent");

            // 이전에 접속한 유저의 연결을 종료합니다.
            await io.in(loginUser[socket.userId]).fetchSockets();

            // 로그인 중인 유저 목록에서 접속중인 유저를 삭제합니다.
            delete loginUser[socket.userId]

            return;
        }
        loginUser[socket.userId] = socket.id

        // FIXME 누군가 latlng로 디도스를 건다면? 자동으로 차단할 수 있도록 설정하자.
        socket.on("latlng", (LocationData) => {
            try {
                const {userId, lat, lng} = LocationData;
                userLocation[userId] = {lat, lng}; // TODO 이제는 userId를 미들웨어에서 가져온다.
            } catch (error) {
                console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            }
        })

        socket.on("getPostList", async () => {
            const postList = [];
            await Posts.findAll({
                attributes: ['postId', 'location'],
                where: {location: {[Sequelize.Op.not]: null}}
            })
                .then((result) => {
                    for (const x of result) {
                        postList.push({
                            postId: x['dataValues'].postId,
                            lat: x['dataValues'].location.coordinates[0],
                            lng: x['dataValues'].location.coordinates[1],
                        })
                    }
                    socket.emit('postList', postList)
                })
        })

        // 3초마다 클라이언트로 모든 유저의 위치 전송
        socket.interval = setInterval(() => {
            socket.emit("userLocation", userLocation)
        }, 3000);


        // TODO 중복 로그인 발생시 모든 세션을 튕기도록 설정
        socket.on("disconnect", () => {
            // TODO Javascript 의 Object Delete의 시간 복잡도는?
            delete userLocation[socket.userId]
            delete loginUser[socket.userId]

            console.log("Location Socket Client Disconnect / IP :", ip, socket.userId);
            // console.log("Location Socket Cliend DisConnect / socket ID : ", socket.id);
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

    chat.on("connect", (socket) => {
        // Request
        const req = socket.request;
        //접속한 유저의 IP를 가져옴
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // get Query로 들어온 postId 값을 roomId로 지정한다.
        // TODO join을 할 때 같은 값이라도 type이 다를 경우 전달이 되지 않는다.
        const postId = Number(socket.handshake.query.postId);
        // socket.handshake.query : req.params

        // TODO postId 데이터가 존재하지 않을경우 Conenct를 종료하도록 설정한다. / Nan 나중에 해결
        console.log('chat Socket Connect', ip, postId);

        //postId를 기준으로 socket 방을 join 한다.
        socket.join(postId);

        // join한 방에게 Message를 보낸다.
        // TODO 입장한 사용자의 Nickname을 뿌리도록 설정한다.
        socket.to(postId).emit("join", {
                user: "system",
                chat: `새로운 유저가 입장하셨습니다.`,
            }
        );


        socket.on("disconnect", () => {
            console.log("chat Socket Client Disconnect IP : ", ip);
            // console.log("chat Socket Client Disconnect Socket ID : ", socket.id);

            //TODO session을 통해서 누구인지 확인할 수 있도록 설정해야한다.
            socket.to(postId).emit("exit", {
                user: "system",
                chat: `유저가 퇴장하셨습니다.`,
            });

            clearInterval(socket.interval);
        })

        socket.on("error", (error) => {
            console.error(error);
        })
    })

}