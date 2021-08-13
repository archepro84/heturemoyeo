const request = require("supertest");
const app = require("../app");

// room api 테스트 (/api/room/:postId)
test("/api/room : 정상작동할 때 (200)", async () => {
    const response = await request(app)
        .get("/api/room/1")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(200);
});
// TODO SEED 이후 400
// TODO SEED 412


// status 400에 해당하는 경우는 joi 검증 실패를 제외하고 없을 것 같다.
// test("/api/room : postId를 찾을 수 없을 때 (postId = 99)", async () => {
//     const response = await request(app)
//         .get("/api/room/99")
//         .set(
//             "authorization",
//             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
//         )
//         .send({
//             start: 0,
//             limit: 5,
//         });
//     expect(response.status).toEqual(400);
// });


test("/api/room : userId를 찾을 수 없을 때 (userId = 99) (401)", async () => {
    const response = await request(app)
        .get("/api/room/1")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk5LCJpYXQiOjE2MjgxMzA4MDd9.QvAx7jqMoYd7MkTuxTFB9_JwEC3Mdid8a9T8rt2jjkY"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(401);
});
test("/api/room : 로그인한 유저가 해당 방에 있지 않을 때 (userId = 4 post = 1) (412)", async () => {
    const response = await request(app)
        .get("/api/room/1")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTYyODEzMDgwN30.cfe753aceaac0fDUNHls3f6jh4YwVLb7ckGGB_zKmoE"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(412);
});

// 대화방 채팅 전송 api (/api/room/chat)
test("/api/room/chat : 대화방 채팅 전송 성공시 (userId: 1, postId:1) (201)", async () => {
    const response = await request(app)
        .post("/api/room/chat")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            postId: 1,
            message: "test",
        });
    expect(response.status).toEqual(201);
});
test("/api/room/chat : 채팅 전송 실패 (유저가 해당 게시글에 있지 않을 경우 userId:1, postId:3) (412)", async () => {
    const response = await request(app)
        .post("/api/room/chat")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            postId: 3,
            message: "wow wow",
        });
    expect(response.status).toEqual(412);
});
test("/api/room/chat : 채팅 전송 실패 (userId가 없는 경우 userId:99, postId:3) (401)", async () => {
    const response = await request(app)
        .post("/api/room/chat")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk5LCJpYXQiOjE2MjgxMzA4MDd9.QvAx7jqMoYd7MkTuxTFB9_JwEC3Mdid8a9T8rt2jjkY"
        )
        .send({
            postId: 3,
            message: "wow wow",
        });
    expect(response.status).toEqual(401);
});
// TODO 추가 400

// 모임 입장 api (/api/room/join)
test("/api/room/join : 모임 입장 성공 (userId:4, postId:3) (200)", async () => {
    const response = await request(app)
        .post("/api/room/join")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTYyODEzMDgwN30.cfe753aceaac0fDUNHls3f6jh4YwVLb7ckGGB_zKmoE"
        )
        .send({
            postId: 3,
        });
    expect(response.status).toEqual(200);
});
test("/api/room/join : 모임에 이미 입장 중일 때 (userId:1, postId:1) (406)", async () => {
    const response = await request(app)
        .post("/api/room/join")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            postId: 1,
        });
    expect(response.status).toEqual(406);
});
// TODO 추가 406 코드 봐야함
test("/api/room/join : 존재하지 않는 모임에 입장하려 할 때 (userId:1, postId:99) (406)", async () => {
    const response = await request(app)
        .post("/api/room/join")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            postId: 99,
        });
    expect(response.status).toEqual(406);
});

// 모임 퇴장 api (/api/room/exit)
test("/api/room/exit : 모임 퇴장 성공 (userId:4, postId:3) (200)", async () => {
    const response = await request(app)
        .post("/api/room/exit")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTYyODEzMDgwN30.cfe753aceaac0fDUNHls3f6jh4YwVLb7ckGGB_zKmoE"
        )
        .send({
            postId: 3,
        });
    expect(response.status).toEqual(200);
});
// TODO 추가 406 해당하는 모임이 없을 때
test("/api/room/exit : 모임에 참가하고 있지 않을 때 (userId:4, postId:1) (406)", async () => {
    const response = await request(app)
        .post("/api/room/exit")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTYyODEzMDgwN30.cfe753aceaac0fDUNHls3f6jh4YwVLb7ckGGB_zKmoE"
        )
        .send({
            postId: 1,
        });
    expect(response.status).toEqual(406);
});
// TODO 추가 400 모임퇴장에 실패했을 때