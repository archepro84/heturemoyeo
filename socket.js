const SocketIO = require("socket.io")

module.exports = (server, app) => {
    // let result = {} //모든 User한테 전달한 Object를 설정한다.
    let result = {}
    result[2] = {lat: 37.5671461, lng: 126.9309533}
    result[3] = {lat: 37.5679144, lng: 126.9344071}

    result[4] = {lat: 37.562110, lng: 126.941069}
    result[5] = {lat: 37.564304,  lng: 126.933688}
    result[6] = {lat: 37.561851, lng: 126.944231}
    result[7] = {lat: 37.559209, lng: 126.939785}
    result[8] = {lat: 37.5663129, lng: 126.9316755}

    let socketIdObject = {} //접속한 Socket이 사용하는 UserId를 설정한다.
    const io = SocketIO(server, {path: "/socket.io", cors: {origins: '*:*'}})

    app.set('io', io);
    const location = io.of('/location');
    const room = io.of("/room");
    const chat = io.of("/chat");

    location.on("connection", (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('Location Socket Connect / IP :', ip);

        // TODO 중복 로그인 발생시 모든 세션을 튕기도록 설정
        socket.on("disconnect", () => {
            if (socketIdObject[socket.id]) {
                // TODO Javascript 의 Object Delete의 시간 복잡도는?
                delete result[socketIdObject[socket.id]]
                delete socketIdObject[socket.id]
            }
            console.log("Location Socket Client Disconnect / IP :", ip);
            // console.log("Location Socket Cliend DisConnect / socket ID : ", socket.id);
            clearInterval(socket.interval);
        })

        socket.on("error", (error) => {
            console.error(error);
        })

        // TODO 보내주는 User가 인증받은 User인지 어떻게 확인할 수 있지?
        socket.on("latlng", (LocationData) => {
            try {

                // TODO 코드 선언 구조분해 줄이기
                const {userId, lat, lng} = LocationData;
                socketIdObject[socket.id] = userId

                result[userId] = {lat, lng};
            } catch (error) {
                console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            }
        })

        socket.interval = setInterval(() => { // 3초마다 클라이언트로 메시지 전송
            socket.emit("userLocation", result)
        }, 1000);
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