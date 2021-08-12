const request = require("supertest");
const app = require("../app");
const clearData = require("./clearData")
const { test, expect } = require("@jest/globals");

// friend API 테스트
test("GET /api/friend 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/friend")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/friend 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .get("/api/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/friend 경로에 친구가 등록 되어 있지 않으면 불러오기 실패 (412) ", async () => {
    const response = await request(app)
        .get("/api/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: 0,
            limit: 5
        });
    expect(response.status).toEqual(412);
});
test("GET /api/friend 경로에 입력 형식이 잘못되어 있으면 실패 (412) ", async () => {
    const response = await request(app)
        .get("/api/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: "a",
            limit: 5
        });
    expect(response.status).toEqual(412);
});
test("GET /api/friend 경로에 친구가 등록되어 있으면 불러오기 성공(200) ", async () => {
    const response = await request(app)
        .get("/api/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: 0,
            limit: 5
        });
    expect(response.status).toEqual(200);
});



test("POST /api/friend 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .post("/api/friend")
        .send();
    expect(response.status).toEqual(401);
});
test("POST /api/friend 경로에 전혀 다른 값을 가져 오면 실패 (400) ", async () => {
    const response = await request(app)
        .post("/api/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 1
        });
    expect(response.status).toEqual(400);
});
test("POST /api/friend 경로에 유저가 없으면 친구요청 실패 (412) ", async () => {
    const response = await request(app)
        .post("/api/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1
        });
    expect(response.status).toEqual(401);
});
test("POST /api/friend 경로에 유저가 이미 등록 되어 있으면 실패 (412) ", async () => {
    const response = await request(app)
        .post("/api/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1
        });
    expect(response.status).toEqual(401);
});
test("POST /api/friend 경로에 유저가 있으면 친구요청 성공 (200) ", async () => {
    const response = await request(app)
        .post("/api/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1
        });
    expect(response.status).toEqual(200);
});
test("POST /api/friend 경로에 친구요청한 사람 있으면 수락 성공 (200) ", async () => {
    const response = await request(app)
        .post("/api/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 3
        });
    expect(response.status).toEqual(200);
});



test("GET /api/friend/request 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/friend/request")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/friend/request 경로에 전혀 다른 값을 가져 오면 실패 (400) ", async () => {
    const response = await request(app)
        .get("/api/friend/request")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1
        });
    expect(response.status).toEqual(400);
});
test("GET /api/friend/request 경로에 받은 요청이 없을 경우 실패 (412) ", async () => {
    const response = await request(app)
        .get("/api/friend/request")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: 0,
            limit: 5
        });
    expect(response.status).toEqual(412);
});
test("GET /api/friend/request 경로에 입력 형식이 알맞지 않으면 실패 (412) ", async () => {
    const response = await request(app)
        .get("/api/friend/request")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: "a",
            limit: 5
        });
    expect(response.status).toEqual(412);
});
test("GET /api/friend/request 경로에 형식이 알맞게 사용하거나 친구요청이 들어와 있으면 성공 (200) ", async () => {
    const response = await request(app)
        .get("/api/friend/request")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: 0,
            limit: 5
        });
    expect(response.status).toEqual(412);
});
