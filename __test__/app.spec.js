const app = require("../app");
const supertest = require("supertest");
const {test, expect} = require("@jest/globals");
const clearData = require("./clearData")

test("POST /api/user/me 경로에 요청했을 떄 Authorization 헤더가 있을 경우 성공 (200)", async () => {
    const res = await supertest(app)
        .post("/api/user/me")
        .set("authorization", clearData.Authorization,)
        .send();
    expect(res.status).toEqual(200);
});
test("POST /api/user/me 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const res = await supertest(app).post("/api/user/me").send();
    expect(res.status).toEqual(401);
});


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
test("POST /api/login 입력할 이메일 주소에 '@@' 문자가 2개 이상 이면 실패(401)", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: "rhkstlr@@@gmail.com",
        password: clearData.Password,
    });
    expect(res.status).toEqual(401);
});
test("POST /api/login 이메일 주소에 '@'문자가 없으면 로그인 실패(401)", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: "rhkstlrgmail.com",
        password: clearData.Password,
    });
    expect(res.status).toEqual(401);
});
test("POST /api/login 이메일 주소에 특수문자가 존재하면 실패(401)", async () => {
    let res = await supertest(app).post("/api/login").send({
        email: "dddd!q@gmail.com",
        password: clearData.Password,
    });
    expect(res.status).toEqual(401);

    res = await supertest(app).post("/api/login").send({
        email: "ddddq@gm!ail.com",
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
test("POST /api/login 비밀번호가 5자 이하이면 실패(401)", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: clearData.Email,
        password: "!@#4q",
    });
    expect(res.status).toEqual(401);
});
test("POST /api/login 비밀번호가 21자 이상이면 실패(401)", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: clearData.Email,
        password: "!@#4qwer!@#4qwer!@#4qs",
    });
    expect(res.status).toEqual(401);
});
test("POST /api/login 비밀번호에 특수문자가 포함되어 있지 않을 경우 실패(401)", async () => {
    const res = await supertest(app).post("/api/login").send({
        email: clearData.Email,
        password: "1234qwer",
    });
    expect(res.status).toEqual(401);
});
test("POST /api/login 비밀번호가 6 ~ 20글자에 포함될 경우 로그인 성공(200)", async () => {
    let res = await supertest(app).post("/api/login").send({
        email: clearData.Email,
        password: clearData.Password,
    });
    expect(res.status).toEqual(200);

    res = await supertest(app).post("/api/login").send({
        email: "dqdq@naver.com",
        password: "!@#qwer44q",
    });
    expect(res.status).toEqual(200);
});


test("POST /api/sign/email 이미 로그인된 사용자는 실패(401)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email")
        .set("authorization", clearData.Authorization,)
        .send({email: clearData.SignEmail,});
    expect(res.status).toEqual(401);
});
test("POST /api/sign/email 같은 이메일이 있을 시 회원가입 실패(401)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email")
        .send({email: clearData.Email,});
    expect(res.status).toEqual(401);
});
test("POST /api/sign/email 입력할 이메일 주소에 '@@' 문자가 2개 이상 이면 실패(401)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email")
        .send({email: "rhkstlr@@@gmail.com",});
    expect(res.status).toEqual(401);
});
test("POST /api/sign/email 이메일 주소에 '@'문자가 없으면 실패(401)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email")
        .send({email: "rhkstlrgmail.com",});
    expect(res.status).toEqual(401);
});
test("POST /api/sign/email 이메일 주소에 특수문자가 존재하면 실패(401)", async () => {
    let res = await supertest(app)
        .post("/api/sign/email")
        .send({email: "dddd!q@gmail.com",});
    expect(res.status).toEqual(401);

    res = await supertest(app)
        .post("/api/sign/email")
        .send({email: "ddddq@gm!ail.com",});
    expect(res.status).toEqual(401);
});
test("POST /api/sign/email 이메일 주소에 '@' 문자가 1개만 있어야 성공(200)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email")
        .send({email: clearData.SignEmail,});
    expect(res.status).toEqual(200);
});
test("POST /api/sign/email 이메일이 없을 시 성공(200)", async () => {
    const res = await supertest(app)
        .post("/api/sign/email")
        .send({email: clearData.SignEmail,});
    expect(res.status).toEqual(200);
});


test("회원가입시 같은 닉네임이 있을 시 회원가입 실패", async () => {
    const res = await supertest(app).post("/api/sign/nickname").send({
        nickname: clearData.Nickname,
    });
    expect(res.status).toEqual(401);
});
test("회원가입시 같은 닉네임이 없을 시 회원가입 성공", async () => {
    const res = await supertest(app).post("/api/sign/nickname").send({
        nickname: "AzWxxssaeRRw3QAa",
    });
    expect(res.status).toEqual(200);
});
test("회원가입시 비밀번호와 비밀번호 확인이 같아야 회원가입을 할 수 있습니다. ", async () => {
    const res = await supertest(app).post("/api/sign/password").send({
        password: clearData.Password,
        confirm: clearData.Password,
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

test("메인페이지의 유저정보확인 및 토큰이 잘 이루어 졌으면 status 200이어야 한다.", async () => {
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
