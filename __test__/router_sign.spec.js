const request = require("supertest");
const app = require("../app");
const clearData = require("./clearData")
const supertest = require("supertest");
const { test, expect } = require("@jest/globals")
const crypto = require("crypto");

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
test("POST /api/sign 경로에 같은 전화번호가 존재하면 실패 (400)", async () => {
    const res = await supertest(app)
        .post("/api/sign/")
        .send({
            phone: "01011111111",
            name: "cccc",
            nickname: "cccc",
            password: "!@#4qwer",
            confirm: "!@#4qwer",
            profileImg: ".img",
            statusMessage: "Sleep",
            likeItem: ["game"],
        });
    expect(res.status).toEqual(400);
});
test("POST /api/sign 경로에 같은 닉네임이 존재하면 실패 (400)", async () => {
    const res = await supertest(app)
        .post("/api/sign/")
        .send({
            phone: "01011111111",
            name: "cccc",
            nickname: "KKK",
            password: "!@#4qwer",
            confirm: "!@#4qwer",
            profileImg: ".img",
            statusMessage: "Sleep",
            likeItem: ["game"],
        });
    expect(res.status).toEqual(400);
});
// test("POST /api/sign 경로에 해당 조건형식에 맞게 작성하여야만 회원가입 성공(201)", async () => {
//     const res = await supertest(app)
//         .post("/api/sign/")
//         .send({
//             authId: 1,
//             phone: "01012341234",
//             name: "cccc",
//             nickname: "cccc",
//             password: "!@#4qwer",
//             confirm: "!@#4qwer",
//             profileImg: ".img",
//             statusMessage: "Sleep",
//             likeItem: ["game"],
//         });
//     expect(res.status).toEqual(201);
// });



test("DELETE /api/sign 경로에 요청했을 떄 Authorization 헤더가 없을 실패 (401)", async () => {
    const res = await supertest(app)
        .delete("/api/sign")
        .send();
    expect(res.status).toEqual(401);
});
test("DELETE /api/sign 경로에 전혀 다른 값을 가져오면 실패 (400)", async () => {
    const res = await supertest(app)
        .delete("/api/sign/")
        .set(
            "authorization",
            clearData.Authorization,
        )
        .send({
            userId: 2,
        });
    expect(res.status).toEqual(400);
});
test("DELETE /api/sign 경로에 전화번호가 틀리면 실패 (401)", async () => {
    const res = await supertest(app)
        .delete("/api/sign/")
        .set(
            "authorization",
            clearData.Authorization,
        )
        .send({
            phone: "01012341234",
            password: "!@#4qwer",
        });
    expect(res.status).toEqual(401);
});
test("DELETE /api/sign 경로에 비밀번호가 틀리면 실패 (401)", async () => {
    const res = await supertest(app)
        .delete("/api/sign/")
        .set(
            "authorization",
            clearData.Authorization,
        )
        .send({
            phone: "01011111111",
            password: "!@#4qwe",
        });
    expect(res.status).toEqual(401);
});
// test("DELETE /api/sign 경로에 정보를 알맞게 입력하면 삭제 성공 (201)", async () => {
//     const res = await supertest(app)
//         .delete("/api/sign/")
//         .set(
//             "authorization",
//             clearData.Authorization,
//         )
//         .send({
//             phone: "01099999999",
//             password: "!@#4qwer",
//         });
//     expect(res.status).toEqual(201);
// });




test("POST /api/sign/phone 경로에 요청했을 떄 Authorization 헤더가 있을 경우 실패 (401)", async () => {
    const res = await supertest(app)
        .post("/api/sign/phone ")
        .set("authorization", clearData.Authorization,)
        .send();
    expect(res.status).toEqual(401);
});
test("POST /api/sign/phone 경로에 전혀 다른 값을 가져오면 실패 (400)", async () => {
    const res = await supertest(app)
        .post("/api/sign/phone")
        .send({ nickname: clearData.Nickname, });
    expect(res.status).toEqual(400);
});
test("POST /api/sign/phone 경로에 같은 전화번호가 있을 시 회원가입 실패(412)", async () => {
    const res = await supertest(app)
        .post("/api/sign/phone")
        .send(
            {
                phone: clearData.Phone
            }
        );
    expect(res.status).toEqual(412);
});
// test("POST /api/sign/phone 경로에 같은 전화번호가 없을 시 성공(201)", async () => {
//     const res = await supertest(app)
//         .post("/api/sign/phone")
//         .send({
//             phone: clearData.SignPhone,
//         }
//         );
//     expect(res.status).toEqual(201);
// });




test("POST /api/sign/phone/auth 경로에 요청했을 떄 Authorization 헤더가 있을 경우 실패 (401)", async () => {
    const res = await supertest(app)
        .post("/api/sign/phone/auth ")
        .set(
            "authorization",
            clearData.Authorization,
        )
        .send();
    expect(res.status).toEqual(401);
});
test("POST /api/sign/phone/auth 경로에 전혀 다른 값을 가져오면 실패 (400)", async () => {
    const res = await supertest(app)
        .post("/api/sign/phone/auth")
        .send(
            {
                nickname: clearData.Nickname
            }
        );
    expect(res.status).toEqual(400);
});
test("POST /api/sign/phone/auth 경로에 이미 사용중인 번호가 있을 경우 실패 (400)", async () => {
    const res = await supertest(app)
        .post("/api/sign/phone/auth")
        .send(
            {
                phone: "01011111111",
                authData: "12345"
            }
        );
    expect(res.status).toEqual(400);
});
test("POST /api/sign/phone/auth 경로에 인증번호가 일치 하지 않으면 실패 (400)", async () => {
    const res = await supertest(app)
        .post("/api/sign/phone/auth")
        .send(
            {
                phone: "01012345678",
                authData: "12345"
            }
        );
    expect(res.status).toEqual(400);
});
// test("POST /api/sign/phone/auth 경로에 알맞게 정보를 입력하면 성공 (201)", async () => {
//     const res = await supertest(app)
//         .post("/api/sign/phone/auth")
//         .send(
//             {
//                 phone: "01012345678",
//                 authData: "12345"
//             }
//         );
//     expect(res.status).toEqual(201);
// });




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
