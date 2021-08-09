const app = require("./app");
const supertest = require("supertest");
const { test, expect } = require("@jest/globals");

test("/api/user/me 경로에 요청했을 떄 status code가 200이어야 한다.", async () => {
    const res = await supertest(app)
        .post("/api/user/me")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTYyODA3NTc5N30.S7YxSEYFbPDem5x1nerjJZI3jYTfj2-cso-Fti-_vmE"
        )
        .send();
    expect(res.status).toEqual(200);
});

test("/api/user/me 경로에 요청했을 떄 status code가 400이여야 한다.", async () => {
    const res = await supertest(app).post("/api/user/me").send();
    expect(res.status).toEqual(401);
});

test("로그인 할 때 입력할 이메일 주소에 '@' 문자가 1개만 있어야 이메일 형식이다.", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: "qwert@gmail.com",
        password: "qwer!@#",
    });
    expect(res.status).toEqual(200);
});
test("로그인 할때 입력할 이메일 주소에 '@@' 문자가 2개 이상 이면 실패 ", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: "rhkstlr@@@gmail.com",
        password: "qwert!@#$",
    });
    expect(res.status).toEqual(401);
});
test("로그인 할 떄 이메일 주소에 '@'문자가 없으면 이메일 형식이 아닌다.", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: "rhkstlrgmail.com",
        password: "qwert!@#$",
    });
    expect(res.status).toEqual(401);
});
test("로그인시 비밀번호가 6자 이하이면 로그인 실패", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: "rhkstlr@gmail.com",
        password: "qwe!@#",
    });
    expect(res.status).toEqual(401);
});
test("회원가입시 같은 이메일이 있을 시 회원가입 실패", async () => {
    const res = await supertest(app).post("/api/sign/email").send({
        email: "rhkstlr@gmail.com",
    });
    expect(res.status).toEqual(401);
});
test("회원가입시 같은 닉네임이 있을 시 회원가입 실패", async () => {
    const res = await supertest(app).post("/api/sign/password").send({
        nickname: "nickname",
    });
    expect(res.status).toEqual(401);
});
test("회원가입시 비밀번호와 비밀번화 확인이 같아야 회원가입을 할 수 있습니다. ", async () => {
    const res = await supertest(app).post("/api/sign/password").send({
        password: "qwert!@#$",
        confirm: "qwert!@#$",
    });
    expect(res.status).toEqual(200);
});
// test("회원가입시 해당 조건들이 들어 있어야 회원가입이 이루어 진다.", async () => {
//     const res = await supertest(app)
//         .post("/api/sign/")
//         .send({
//             email: "ffff@gmail.com",
//             name: "lsh",
//             nickname: "zzxcvvb",
//             password: "qwert!@#$",
//             confirm: "qwert!@#$",
//             profileImg: ".img",
//             statusMessage: "잠을 자고 싶다",
//             likeItem: ["game", "item"],
//         });
//     expect(res.status).toEqual(200);
// });
// test("회원가입시 statusMessage, porfileImg, likeItem 비어 있어도 회원가입 가능", async () => {
//     const res = await supertest(app)
//         .post("/api/sign")
//         .send({
//             email: "mmmm@gmail.com",
//             name: "zxcv",
//             nickname: "1234",
//             password: "qwert!@#$",
//             confirm: "qwert!@#$",
//             profileImg: " ",
//             statusMessage: null,
//             likeItem: ["hi"],
//         });
//     expect(res.status).toEqual(200);
// });
// test("회원가입시 email, name, nickname, password,confirm이 없을 경우에 회원가입 불가", async () => {
//     const res = await supertest(app)
//         .post("/api/sign")
//         .send({
//             email: "",
//             name: "",
//             nickname: "",
//             password: "",
//             confirm: "",
//             profileImg: " ",
//             statusMessage: null,
//             likeItem: ["hi"],
//         });
//     expect(res.status).toEqual(401);
// });
// test("비밀번호 찾기에서 보낼 이메일을 작성 후 보내지면 status가 200이어야 한다.", async () => {
//     const res = await supertest(app).post("/api/find/password/email").send({
//         email: "rhkstlr00@icloud.com",
//     });
//     expect(res.status).toEqual(200);
// });
// test("이메일로 받은 인증번호를 작성 하고 인증이 되었으면 통과", async () => {
//     const res = await supertest(app).post("/api/find/password/auth").send({
//         email: "rhkstlr00@icloud.com",
//         authData: "1234567",
//     });
//     expect(res.status).toEqual(200);
// });
// test("비밀번호 인증 통과후 비밀번호 변경이 되었으면 통과", async () => {
//     const res = await supertest(app).post("/api/find/password/newpass").send({
//         aurhId: 2,
//         email: "rhkstlr00@icloud.com",
//         password: "asdf!@#$",
//         confirm: "asdf!@#$",
//     });
//     expect(res.status).toEqual(200);
// });
test("메인페이지의 유저정보확인 및 토근이 잘 이루어 졌으면 status 200이어야 한다.", async () => {
    const res = await supertest(app)
        .get("/api/user/target/all")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTYyODA3NTc5N30.S7YxSEYFbPDem5x1nerjJZI3jYTfj2-cso-Fti-_vmE"
        )
        .send({
            userId: 20,
        });
    expect(res.status).toEqual(200);
});
test("메인페이지 접근시 토큰이 없을 경우에 접근 할 수 가 없다", async () => {
    const res = await supertest(app).get("/api/user/target/all").send({
        userId: 20,
    });
    expect(res.status).toEqual(401);
});
test("사용자와 친구등록 되어 있는 사람만 정보를 가져온다.", async () => {
    const res = await supertest(app)
        .get("/api/user/target/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTYyODA3NTc5N30.S7YxSEYFbPDem5x1nerjJZI3jYTfj2-cso-Fti-_vmE"
        )
        .send({
            userId: 3,
        });
    expect(res.status).toEqual(200);
});
test("사용자와 친구가 아닐 경우 정보를 가져올 수 없다.", async () => {
    const res = await supertest(app)
        .get("/api/user/target/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTYyODA3NTc5N30.S7YxSEYFbPDem5x1nerjJZI3jYTfj2-cso-Fti-_vmE"
        )
        .send({
            userId: 7,
        });
    expect(res.status).toEqual(401);
});
test("일정이 같은 사람들일 경우에 대화방으로 이동", async () => {
    const res = await supertest(app)
        .get("/api/user/target/post")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTYyODA3NTc5N30.S7YxSEYFbPDem5x1nerjJZI3jYTfj2-cso-Fti-_vmE"
        )
        .send({
            userId: 3,
        });
    expect(res.status).toEqual(200);
});
test("나의 페이지에서 상태메세지 변경이 성공 되었을 경우", async () => {
    const res = await supertest(app)
        .put("/api/user/status")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTYyODA3NTc5N30.S7YxSEYFbPDem5x1nerjJZI3jYTfj2-cso-Fti-_vmE"
        )
        .send({
            statusMessage: "제발 되게 해주세요",
        });
    expect(res.status).toEqual(200);
});
