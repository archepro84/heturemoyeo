const request = require("supertest");
const app = require("../app");
const clearData = require("./clearData")
const supertest = require("supertest");
const { test, expect } = require("@jest/globals");

// sign API 테스트
test("POST /api/sign 경로에 요청했을 떄 Authorization 헤더가 있을 경우 실패 (401)", async () => {
    const res = await supertest(app)
        .post("/api/sign")
        .set("authorization", clearData.Authorization,)
        .send();
    expect(res.status).toEqual(401);
});
test("POST /api/sign 경로에 전혀 다른 값을 가져오면 실패 (400)", async () => {
    const res = await supertest(app)
        .post("/api/sign/")
        .send({
            userId: 2,
        });
    expect(res.status).toEqual(400);
});
//412 DB 이메일 중복
//412 DB 닉네임 중복
// FIXME SEED로 첫 데이터 설정 후 실행하면 오류가 발생하지 않음
test("POST /api/sign 경로에 해당 조건형식에 맞게 작성하여야만 회원가입 성공(200)", async () => {
    const res = await supertest(app)
        .post("/api/sign/")
        .send({
            email: "cccc@gmail.com",
            name: "cccc",
            nickname: "cccc",
            password: "qwert!@#$",
            confirm: "qwert!@#$",
            profileImg: ".img",
            statusMessage: "잠을 자고 싶다",
            likeItem: ["game", "item"],
        });
    expect(res.status).toEqual(200);
});



test("POST /api/sign/email 경로에 요청했을 떄 Authorization 헤더가 있을 경우 실패 (401)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email ")
        .set("authorization", clearData.Authorization,)
        .send();
    expect(res.status).toEqual(401);
});
test("POST /api/sign/email 경로에 같은 이메일이 있을 시 회원가입 실패(412)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email")
        .send({ email: clearData.Email, });
    expect(res.status).toEqual(412);
});
test("POST /api/sign/email 경로에 전혀 다른 값을 가져오면 실패 (400)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email")
        .send({ nickname: clearData.Nickname, });
    expect(res.status).toEqual(400);
});
test("POST /api/sign/email 경로에 이메일이 없을 시 성공(200)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email")
        .send({ email: clearData.SignEmail, });
    expect(res.status).toEqual(200);
});



test("POST /api/sign/nickname 경로에 같은 닉네임이 있을 시 회원가입 실패(412)", async () => {
    const res = await supertest(app).post("/api/sign/nickname").send({
        nickname: clearData.Nickname,
    });
    expect(res.status).toEqual(412);
});
test("POST /api/sign/nickname 경로에 전혀 다른 것을 인증하면 실패(400)", async () => {
    const res = await supertest(app).post("/api/sign/nickname").send({
        email: clearData.Email,
    });
    expect(res.status).toEqual(400);
});
test("POST /api/sign/nickname 경로에 같은 닉네임이 없을 시 회원가입 성공(200)", async () => {
    const res = await supertest(app).post("/api/sign/nickname").send({
        nickname: "zxcvbnm",
    });
    expect(res.status).toEqual(200);
});



test("POST /api/sign/password 경로에 요청했을 떄 Authorization 헤더가 있을 경우 실패 (401)", async () => {
    const res = await supertest(app)
        .post("/api/sign/password ")
        .set("authorization", clearData.Authorization,)
        .send();
    expect(res.status).toEqual(401);
});
test("POST /api/sign/password 경로에 비밀번호와 비밀번호 확인이 일치하지 않으면 실패 (412) ", async () => {
    const res = await supertest(app).post("/api/sign/password").send({
        password: clearData.Password,
        confirm: "asdfg!@#$%",
    });
    expect(res.status).toEqual(412);
});
test("POST /api/sign/password 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const res = await supertest(app).post("/api/sign/password").send({
        email: clearData.Email,
    });
    expect(res.status).toEqual(400);
});
test("POST /api/sign/password 경로에 비밀번호와 비밀번호 확인이 같아야 회원가입 성공 (200) ", async () => {
    ;
    const res = await supertest(app).post("/api/sign/password").send({
        password: clearData.Password,
        confirm: clearData.Password,
    });
    expect(res.status).toEqual(200);
});
