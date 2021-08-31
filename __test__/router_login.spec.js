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
            Phone: clearData.Phone,
            password: clearData.Password,
        });
    expect(res.status).toEqual(401);
});
test("POST /api/login 경로에 핸드폰번호가 잘못 되었으면 실패(412)", async () => {
    const res = await supertest(app).post("/api/login").send({
        phone: "01011111122",
        password: clearData.Password,
    });
    expect(res.status).toEqual(412);
});
test("POST /api/login 경로에 비밀번호가 잘못 되었으면 실패(412)", async () => {
    const res = await supertest(app).post("/api/login").send({
        phone: clearData.Phone,
        password: "qwer1234$",
    });
    expect(res.status).toEqual(412);
});
test("POST /api/login 경로에 알맞게 입력하면 로그인 성공(200)", async () => {
    const res = await supertest(app).post("/api/login").send({
        phone: clearData.Phone,
        password: clearData.Password,
    });
    expect(res.status).toEqual(200);
});
