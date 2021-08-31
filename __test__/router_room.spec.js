const request = require("supertest");
const app = require("../app");
const clearData = require("./clearData")
const { test, expect } = require("@jest/globals");

// room api 테스트 (/api/room/:postId)

//대화방 내 유저정보, 확정정보 확인하기
test("GET /api/room/info 경로에 Authorization 헤더가 없을 경우 실패(401)", async () => {
    const response = await request(app)
        .get("/api/room/info")
        .send({
        });
    expect(response.status).toEqual(401);
});
test("GET /api/room/info 경로에 전혀 다른 값을 주면 실패(400)", async () => {
    const response = await request(app)
        .get("/api/room/info")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1
        });
    expect(response.status).toEqual(400);
});
test("GET /api/room/info 경로에 해당 방에 참여하지 않으면 실패(412)", async () => {
    const response = await request(app)
        .get("/api/room/info")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 3
        });
    expect(response.status).toEqual(412);
});
test("GET /api/room/info 경로에 해당 방에 담여 하고 있으면 성공(200)", async () => {
    const response = await request(app)
        .get("/api/room/info")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 1
        });
    expect(response.status).toEqual(200);
});



//대화방 메시지 불러오기
test("GET /api/room/postId 경로에  Authorization 헤더가 없을 경우 실패(401)", async () => {
    const response = await request(app)
        .get("/api/room/1")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/room/postId 경로에 알맞지 않는 정보를 입력하면 실패 (400)", async () => {
    const response = await request(app)
        .get("/api/room/99")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: 0,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/room/postId 경로에 해당 방에 참여하고 있지 않으면 실패 (412)", async () => {
    const response = await request(app)
        .get("/api/room/4")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(412);
});
test("GET /api/room/postId 경로에 알맞는 정보를 입력하면 성공 (200)", async () => {
    const response = await request(app)
        .get("/api/room/1")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(200);
});



// 대화방 채팅 전송 api (/api/room/chat)
test("POST /api/room/chat : 채팅 전송 실패 (userId가 없는 경우 userId:99, postId:3) (401)", async () => {
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
test("POST /api/room/chat : 알맞지 않는 정보를 입력하면 실패(400)", async () => {
    const response = await request(app)
        .post("/api/room/chat")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            postId: 3,
        });
    expect(response.status).toEqual(400);
});
test("POST /api/room/chat : 채팅 전송 실패 (유저가 해당 게시글에 있지 않을 경우 userId:1, postId:3) (412)", async () => {
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
test("POST /api/room : 로그인한 유저가 해당 방에 있지 않을 때 (userId = 4 post = 1) (412)", async () => {
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
test("POST /api/room/chat : 대화방 채팅 전송 성공시 (userId: 1, postId:1) (201)", async () => {
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




// 모임 입장 api (/api/room/join)
test("POST /api/room/join 경로에 Authorization 헤더가 없을 경우 실패(401)", async () => {
    const response = await request(app)
        .post("/api/room/join")
        .send({
        });
    expect(response.status).toEqual(401);
});
test("POST /api/room/join : 알맞지 않는 정보를 입력하면 실패(400)", async () => {
    const response = await request(app)
        .post("/api/room/join")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 3,
        });
    expect(response.status).toEqual(400);
});
test("POST /api/room/join : 모임에 이미 입장 중일 때 (userId:1, postId:1) (406)", async () => {
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
test("POST /api/room/join : 존재하지 않는 모임에 입장하려 할 때 (userId:1, postId:99) (406)", async () => {
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
// test("POST /api/room/join : 모임 입장 성공 (userId:4, postId:3) (200)", async () => {
//     const response = await request(app)
//         .post("/api/room/join")
//         .set(
//             "authorization",
//             clearData.Authorization
//         )
//         .send({
//             postId: 3,
//         });
//     expect(response.status).toEqual(200);
// });



// 모임 퇴장 api (/api/room/exit)
test("POST /api/room/exit 경로에 Authorization 헤더가 없을 경우 실패(401)", async () => {
    const response = await request(app)
        .post("/api/room/exit")
        .send({
        });
    expect(response.status).toEqual(401);
});
test("POST /api/room/exit : 알맞지 않는 정보를 입력하면 실패(400)", async () => {
    const response = await request(app)
        .post("/api/room/exit")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 3,
        });
    expect(response.status).toEqual(400);
});
test("POST /api/room/exit : 모임이 존재하지 않으면 실패 (406)", async () => {
    const response = await request(app)
        .post("/api/room/exit")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 7,
        });
    expect(response.status).toEqual(406);
});
test("POST /api/room/exit : 방장은 모임에서 나가려고 하면 실패(403)", async () => {
    const response = await request(app)
        .post("/api/room/exit")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 1,
        });
    expect(response.status).toEqual(403);
});
test("POST /api/room/exit : 이미 확정된 모임에 나가려고 하면 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/exit")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 2,
        });
    expect(response.status).toEqual(403);
});
test("POST /api/room/exit : 해당 모임에 참여하고 있지 않으면 실패 (406)", async () => {
    const response = await request(app)
        .post("/api/room/exit")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 4,
        });
    expect(response.status).toEqual(406);
});
// test("POST /api/room/exit : 모임 퇴장 성공 (200)", async () => {
//     const response = await request(app)
//         .post("/api/room/exit")
//         .set(
//             "authorization",
//             clearData.Authorization
//         )
//         .send({
//             postId: 3,
//         });
//     expect(response.status).toEqual(200);
// });



//모임 초대하기
test("POST /api/room/invite 경로에 Authorization 헤더가 없을 경우 실패(401)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .send({
        });
    expect(response.status).toEqual(401);
});
test("POST /api/room/invite : 알맞지 않는 정보를 입력하면 실패(400)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 3,
        });
    expect(response.status).toEqual(400);
});
test("POST /api/room/invite : 동일한 사용자에게 초대를 보내면 실패(412)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
            postId: 1
        });
    expect(response.status).toEqual(412);
});
test("POST /api/room/invite : 유저 정보가 없으면 실패(412)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 11,
            postId: 1
        });
    expect(response.status).toEqual(412);
});
test("POST /api/room/invite : 해당 모임이 존재 하지 않으면 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 7,
            postId: 7
        });
    expect(response.status).toEqual(406);
});
test("POST /api/room/invite : 해당 모임의 인원이 초과되었을 경우 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 7,
            postId: 1
        });
    expect(response.status).toEqual(406);
});
test("POST /api/room/invite : 해당 모임이 확정 되었을 경우 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 7,
            postId: 1
        });
    expect(response.status).toEqual(406);
});
test("POST /api/room/invite : 해당 모임의 방장이 아닐 경우 실패(401)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .set(
            "authorization",
            clearData.Authorization2
        )
        .send({
            userId: 1,
            postId: 3
        });
    expect(response.status).toEqual(401);
});
test("POST /api/room/invite : 해당 모임에 이미 초대 되어 있으면 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 5,
            postId: 1
        });
    expect(response.status).toEqual(406);
});
test("POST /api/room/invite : 해당 모임에 이미 대화방에 참여 중이면 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 5,
            postId: 1
        });
    expect(response.status).toEqual(406);
});
// test("POST /api/room/invite : 해당 모임에 올바르게 초대 할 경우 성공(201)", async () => {
//     const response = await request(app)
//         .post("/api/room/invite")
//         .set(
//             "authorization",
//             clearData.Authorization
//         )
//         .send({
//             userId: 2,
//             postId: 1
//         });
//     expect(response.status).toEqual(201);
// });



//모임 사용자 강퇴
test("POST /api/room/kick 경로에 Authorization 헤더가 없을 경우 실패(401)", async () => {
    const response = await request(app)
        .post("/api/room/kick")
        .send({
        });
    expect(response.status).toEqual(401);
});
test("POST /api/room/kick : 알맞지 않는 정보를 입력하면 실패(400)", async () => {
    const response = await request(app)
        .post("/api/room/kick")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 3,
        });
    expect(response.status).toEqual(400);
});
test("POST /api/room/kick : 자기 자신을 추방할 경우 실패(412)", async () => {
    const response = await request(app)
        .post("/api/room/kick")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
            postId: 1
        });
    expect(response.status).toEqual(412);
});
test("POST /api/room/kick : 해당하는 모임에 방장이 아닐경우 실패 (406)", async () => {
    const response = await request(app)
        .post("/api/room/kick")
        .set(
            "authorization",
            clearData.Authorization2
        )
        .send({
            userId: 5,
            postId: 1
        });
    expect(response.status).toEqual(406);
});
test("POST /api/room/kick : 확정된 모임에서 강퇴할 경우 실패 (406)", async () => {
    const response = await request(app)
        .post("/api/room/kick")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 10,
            postId: 1
        });
    expect(response.status).toEqual(406);
});
test("POST /api/room/kick : 강퇴할 대상이 없을 경우 실패 (406)", async () => {
    const response = await request(app)
        .post("/api/room/kick")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 11,
            postId: 1
        });
    expect(response.status).toEqual(406);
});
// test("POST /api/room/kick : 조건을 충족할 경우 상대 강퇴 성공 (200)", async () => {
//     const response = await request(app)
//         .post("/api/room/kick")
//         .set(
//             "authorization",
//             clearData.Authorization
//         )
//         .send({
//             userId: 2,
//             postId: 1
//         });
//     expect(response.status).toEqual(200);
// });




//모임 초대 수락
test("POST /api/room/invite/accept 경로에 Authorization 헤더가 없을 경우 실패(401)", async () => {
    const response = await request(app)
        .post("/api/room/invite/accept")
        .send({
        });
    expect(response.status).toEqual(401);
});
test("POST /api/room/invite/accept : 알맞지 않는 정보를 입력하면 실패(400)", async () => {
    const response = await request(app)
        .post("/api/room/invite/accept")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 3,
        });
    expect(response.status).toEqual(400);
});
//너무 유동적임
test("POST /api/room/invite/accept : 초대이벤트가 존재하지 않으면 실패(412)", async () => {
    const response = await request(app)
        .post("/api/room/invite/accept")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            inviteId: 99
        });
    expect(response.status).toEqual(412);
});
test("POST /api/room/invite/accept : 모임의 인원이 초과되었을 경우 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/invite/accept")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            inviteId: 1,
        });
    expect(response.status).toEqual(406);
});
// test("POST /api/room/invite/accept : 확정된 모임에 참여 할 경우 실패(406)", async () => {
//     const response = await request(app)
//         .post("/api/room/invite/accept")
//         .set(
//             "authorization",
//             clearData.Authorization
//         )
//         .send({
//             inviteId: 100,
//         });
//     expect(response.status).toEqual(406);
// });
// test("POST /api/room/invite/accept : 이미 모임에 참여 했을 경우 실패(406)", async () => {
//     const response = await request(app)
//         .post("/api/room/invite/accept")
//         .set(
//             "authorization",
//             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYzMDEzNTExOH0.Cs6inqlyYYPBXVzolhZ5YEkWtvTH7Hwpj-TG36r99Cc"
//         )
//         .send({
//             inviteI: 1,
//         });
//     expect(response.status).toEqual(406);
// });
// test("POST /api/room/invite/accept : 조건을 충족 했을 경우 성공 (201)", async () => {
//     const response = await request(app)
//         .post("/api/room/invite/accept")
//         .set(
//             "authorization",
//             clearData.Authorization2
//         )
//         .send({
//             inviteId: 10,
//         });
//     expect(response.status).toEqual(201);
// });




//모임 초대 거절
test("POST /api/room/invite/reject 경로에 Authorization 헤더가 없을 경우 실패(401)", async () => {
    const response = await request(app)
        .post("/api/room/invite/reject")
        .send({
        });
    expect(response.status).toEqual(401);
});
test("POST /api/room/invite/reject : 알맞지 않는 정보를 입력하면 실패(400)", async () => {
    const response = await request(app)
        .post("/api/room/invite/reject")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 3,
        });
    expect(response.status).toEqual(400);
});
test("POST /api/room/invite/reject : 해당 초대이벤트가 존재하지 않을 경우 실패(412)", async () => {
    const response = await request(app)
        .post("/api/room/invite/reject")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            inviteId: 20
        });
    expect(response.status).toEqual(412);
});
// test("POST /api/room/invite/reject : 조건을 충족 시키면 성공(올바르게 초대 메세지가 왔을 경우) (200)", async () => {
//     const response = await request(app)
//         .post("/api/room/invite/reject")
//         .set(
//             "authorization",
//             clearData.Authorization
//         )
//         .send({
//             inviteId: 10
//         });
//     expect(response.status).toEqual(412);
// });


//모임 확정하기
test("POST /api/room/confirm 경로에 Authorization 헤더가 없을 경우 실패(401)", async () => {
    const response = await request(app)
        .post("/api/room/confirm")
        .send({
        });
    expect(response.status).toEqual(401);
});
test("POST /api/room/confirm : 알맞지 않는 정보를 입력하면 실패(400)", async () => {
    const response = await request(app)
        .post("/api/room/confirm")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 3,
        });
    expect(response.status).toEqual(400);
});
test("POST /api/room/confirm : 해당모임에 참가 하고 있지 않으면 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/confirm")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 5
        });
    expect(response.status).toEqual(406);
});
test("POST /api/room/confirm : 이미 확정 되어 있으면 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/confirm")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 1
        });
    expect(response.status).toEqual(406);
});
test("POST /api/room/confirm : 모임에 다른 인원이 존재하지 않을 경우 실패(406)", async () => {
    const response = await request(app)
        .post("/api/room/confirm")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 1
        });
    expect(response.status).toEqual(406);
});
// test("POST /api/room/confirm : 조건을 충족할 경우 모임 확정 성공 (201)", async () => {
//     const response = await request(app)
//         .post("/api/room/confirm")
//         .set(
//             "authorization",
//             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYzMDEzMTUwMH0.zaG_MgfvcrELUGf5DKANYJQfW4wmQpYX73abiWKkFaU"
//         )
//         .send({
//             postId: 6
//         });
//     expect(response.status).toEqual(201);
// });
