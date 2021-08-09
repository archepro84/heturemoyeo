const request = require("supertest");
const app = require("../app");

// user api 테스트
test("회원정보 수정(닉네임,프로필, 이미지, 태그 변경)", async () => {
    const response = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            nickname: "pink",
            password: "!@#4qwer",
            newpassword: "",
            confirm: "",
            profileImg: "testUrl",
            likeItem: ["game", "board", "kukuku"],
        });
    expect(response.status).toEqual(200);
});
