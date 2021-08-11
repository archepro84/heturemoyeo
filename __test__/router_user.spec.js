const request = require("supertest");
const app = require("../app");
const clearData = require("./clearData")
const { test, expect } = require("@jest/globals");

// user API 테스트
test("POST /api/user/me 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const res = await supertest(app).post("/api/user/me").send();
    expect(res.status).toEqual(401);
});
test("POST /api/user/me 경로에 요청했을 떄 Authorization 헤더가 있을 경우 성공 (200)", async () => {
    const res = await supertest(app)
        .post("/api/user/me")
        .set("authorization", clearData.Authorization,)
        .send();
    expect(res.status).toEqual(200);
});



test("POST /api/user/target/all 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const res = await supertest(app).post("/api/user/target/all").send();
    expect(res.status).toEqual(401);
});
test("GET /api/user/target/all 경로에 유저정보 확인 할 때 유저 정보가 없으면 실패 (412) ", async () => {
    const res = await supertest(app)
        .get("/api/user/target/all")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 20,
        });
    expect(res.status).toEqual(412);
});
test("GET /api/user/target/all 경로에 유저정보 확인 할 때 전혀 다른 id값을 가져오면 실패 (400) ", async () => {
    const res = await supertest(app)
        .get("/api/user/target/all")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 2,
        });
    expect(res.status).toEqual(400);
});
test("GET /api/user/target/all 경로에 유저정보 확인 시 정확한 id값을 입력하면 성공 (200) ", async () => {
    const res = await supertest(app)
        .get("/api/user/target/all")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(res.status).toEqual(200);
});



test("GET /api/user/target/friend 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const res = await request(app)
        .get("/api/user/target/friend")
        .send();
    expect(res.status).toEqual(401);
});
test("GET /api/user/target/friend 경로에 친구로 등록이 되어 있지 않으면 실패 (412)", async () => {
    const res = await supertest(app)
        .get("/api/user/target/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 100,
        });
    expect(res.status).toEqual(412);
});
test("GET /api/user/target/friend 경로에 전혀 다른 id값을 주면 실패 (400)", async () => {
    const res = await supertest(app)
        .get("/api/user/target/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            name: "gwan",
        });
    expect(res.status).toEqual(400);
});
test("GET /api/user/target/friend 경로에 친구로 등록이 되어 있으면 성공 (200)", async () => {
    const res = await supertest(app)
        .get("/api/user/target/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 3,
        });
    expect(res.status).toEqual(200);
});



test("GET /api/user/target/post 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const res = await request(app)
        .get("/api/user/target/post")
        .send();
    expect(res.status).toEqual(401);
});
test("GET /api/user/target/post 경로에 일정이 같지 않은 사람을 불러오면 실패 (412)", async () => {
    const res = await request(app)
        .get("/api/user/target/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 777
        });
    expect(res.status).toEqual(412);
});
test("GET /api/user/target/post 경로에 일정이 같지 않은 사람을 불러오면 실패 (400)", async () => {
    const res = await request(app)
        .get("/api/user/target/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 777
        });
    expect(res.status).toEqual(400);
});
test("GET /api/user/target/post 경로에 일정이 같은 사람을 불러오면 성공 (200)", async () => {
    const res = await request(app)
        .get("/api/user/target/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1
        });
    expect(res.status).toEqual(200);
});



test("PUT /api/user/status 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const res = await request(app)
        .put("/api/user/status")
        .send();
    expect(res.status).toEqual(401);
});
test("PUT /api/user/status 경로에 전혀 다른 값을 가져오면 실패 (400)", async () => {
    const res = await request(app)
        .put("/api/user/status")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1
        });
    expect(res.status).toEqual(400);
});
test("PUT /api/user/status 경로에 알맞게 수정할 내용을 입력하였으면 성공 (200)", async () => {
    const res = await request(app)
        .put("/api/user/status")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            statusMessage: "테스트코드는 노가다이다."
        });
    expect(res.status).toEqual(200);
});



test("PUT /api/user 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const res = await request(app)
        .put("/api/user")
        .send();
    expect(res.status).toEqual(401);
});
test("PUT /api/user 경로에 전혀 다른 값을 가져오면 실패(400)", async () => {
    const res = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1
        });
    expect(res.status).toEqual(400);
});
test("PUT /api/user 경로에 nickname이 없을 경우 실패 (412)", async () => {
    const res = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            nickname: "",
            password: clearData.Password,
            newpassword: clearData.PutPassword,
            confirm: clearData.PutPassword,
            profileImg: clearData.PutImg,
            likeItem: clearData.PutlikeItem,
        });
    expect(res.status).toEqual(412);
});
test("PUT /api/user 경로에 기존 password가 맞지 않으면 실패 (412)", async () => {
    const res = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            nickname: clearData.Nickname,
            password: "zcxvqr!@",
            newpassword: clearData.PutPassword,
            confirm: clearData.PutPassword,
            profileImg: clearData.PutImg,
            likeItem: clearData.PutlikeItem,
        });
    expect(res.status).toEqual(412);
});
test("PUT /api/user 경로에 변경할 newpassword와 confirm이 서로 맞지 않으면 실패 (412)", async () => {
    const res = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            nickname: clearData.Nickname,
            password: clearData.Password,
            newpassword: clearData.PutPassword,
            confirm: "zxcvadsf!!",
            profileImg: clearData.PutImg,
            likeItem: clearData.PutlikeItem,
        });
    expect(res.status).toEqual(412);
});
test("PUT /api/user 경로에 비밀번호를 변경하지 않아도 성공 (200)", async () => {
    const res = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            nickname: clearData.Nickname,
            password: clearData.Password,
            newpassword: "",
            confirm: "",
            profileImg: clearData.PutImg,
            likeItem: clearData.PutlikeItem,
        });
    expect(res.status).toEqual(412);
});
test("PUT /api/user 경로에 profileImg가 비어 있어도 성공", async () => {
    const res = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            nickname: clearData.Nickname,
            password: clearData.Password,
            newpassword: "",
            confirm: "",
            profileImg: "",
            likeItem: clearData.PutlikeItem,
        });
    expect(res.status).toEqual(412);
});
test("PUT /api/user 경로에 likeItem이 비어 있어도 성공", async () => {
    const res = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            nickname: clearData.Nickname,
            password: clearData.Password,
            newpassword: clearData.PutPassword,
            confirm: clearData.PutPassword,
            profileImg: clearData.PutImg,
            likeItem: [],
        });
    expect(res.status).toEqual(412);
});
test("PUT /api/user 경로에 올바르게 데이터가 들어가면 성공 (200)", async () => {
    const res = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            nickname: clearData.Nickname,
            password: clearData.Password,
            newpassword: clearData.PutPassword,
            confirm: clearData.PutPassword,
            profileImg: clearData.PutImg,
            likeItem: clearData.PutlikeItem,
        });
    expect(res.status).toEqual(412);
});



test("GET /api/user/myusers 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const res = await request(app)
        .get("/api/user/myusers")
        .send();
    expect(res.status).toEqual(401);
});
test("GET /api/user/myusers 경로에 전혀 다른 값을 가져오면 실패(400)", async () => {
    const res = await request(app)
        .get("/api/user/myusers")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1
        });
    expect(res.status).toEqual(400);
});
test("GET /api/user/myusers 메인페이지 접속 시 유저들 띄우기 성공(200)", async () => {
    const res = await request(app)
        .get("/api/user/myusers")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send();
    expect(res.status).toEqual(200);
});
