const request = require("supertest");
const app = require("../app");
const clearData = require("./clearData")
const { test, expect } = require("@jest/globals");

// search api 테스트
test("GET /api/search/friend 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/search/friend")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/search/friend 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .get("/api/search/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/search/friend 경로에 키워드 입력을 받지 못하면 실패(412) ", async () => {
    const response = await request(app)
        .get("/api/search/friend")
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
test("GET /api/search/friend 경로에 검색 결과가 없을 경우 실패(412) ", async () => {
    const response = await request(app)
        .get("/api/search/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            keyword: "p",
            start: 0,
            limit: 5
        });
    expect(response.status).toEqual(412);
});
test("GET /api/search/friend 경로에 입력 입력 형식이 잘못 되었을 경우(412) ", async () => {
    const response = await request(app)
        .get("/api/search/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            keyword: "p",
            start: "z",
            limit: 5
        });
    expect(response.status).toEqual(412);
});
test("GET /api/search/friend 경로에 정보들을 알맞게 입력하였을 경우 성공 (200) ", async () => {
    const response = await request(app)
        .get("/api/search/friend")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            keyword: clearData.keyword,
            start: 0,
            limit: 5
        });
    expect(response.status).toEqual(200);
});



test("GET /api/search/user 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/search/user")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/search/user 경로에 전혀 다른 값을 가져오면 실패 (400)", async () => {
    const response = await request(app)
        .get("/api/search/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/search/user 경로에 이메일 형식이 알맞으면 성공 (200)", async () => {
    const response = await request(app)
        .get("/api/search/user")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            keyword: clearData.Email,
        });
    expect(response.status).toEqual(200);
});



test("GET /api/search/friend/request 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/search/friend/request")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/search/friend/request 경로에 전혀 다른 값을 가져오면 실패 (400)", async () => {
    const response = await request(app)
        .get("//api/search/friend/request")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/search/friend/request 경로에 받은 요청이 없을 경우 실패 (412)", async () => {
    const response = await request(app)
        .get("//api/search/friend/request")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            keyword: "h",
            start: 0,
            limit: 5
        });
    expect(response.status).toEqual(412);
});
test("GET /api/search/friend/request 경로에 키워드가 없을 경우 실패 (412)", async () => {
    const response = await request(app)
        .get("//api/search/friend/request")
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
test("GET /api/search/friend/request 경로에 입력 형식이 잘못 되었을 경우 실패 (412)", async () => {
    const response = await request(app)
        .get("/api/search/friend/request")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            keyword: "wo",
            start: "wo",
            limit: 5
        });
    expect(response.status).toEqual(412);
});
test("GET /api/search/friend/request 경로에 형식이 잘 맞게 썼으면 성공 (200)", async () => {
    const response = await request(app)
        .get("/api/search/friend/request")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            keyword: "wo",
            start: 0,
            limit: 5
        });
    expect(response.status).toEqual(412);
});



test("GET /api/search/post 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/search/post")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/search/post 경로에 전혀 다른 값을 가져오면 실패 (400)", async () => {
    const response = await request(app)
        .get("//api/search/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/search/post 경로에 알맞은 정보를 입력하면 검색 성공 (200)", async () => {
    const response = await request(app)
        .get("//api/search/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            keyword: "보드",
            searchData: 2012 - 08 - 11,
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(200);
});