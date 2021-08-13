const app = require("../app");
const supertest = require("supertest");
const { test, expect } = require("@jest/globals");
const clearData = require("./clearData")

// login API 테스트
//TODO 412 DB의 비밀번호 틀렸을때 / 이메일이 없을 때
test("POST /api/login 이미 로그인된 사용자는 로그인 실패(401)", async () => {
    const res = await supertest(app)
        .post("/api/login")
        .set("authorization", clearData.Authorization,)
        .send({
            email: clearData.Email,
            password: clearData.Password,
        });
    expect(res.status).toEqual(401);
});
test("POST /api/login 이메일 주소에 '@' 문자가 1개만 있어야 로그인 성공(200)", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: clearData.Email,
        password: clearData.Password,
    });
    expect(res.status).toEqual(200);
});
test("POST /api/login 비밀번호가 6 ~ 20글자에 포함될 경우 로그인 성공(200)", async () => {
    let res = await supertest(app).post("/api/login").send({
        email: clearData.Email,
        password: clearData.Password,
    });
    expect(res.status).toEqual(200);

    res = await supertest(app).post("/api/login").send({
        email: "aaaa@email.com",
        password: "qwer!@#",
    });
    expect(res.status).toEqual(200);
});