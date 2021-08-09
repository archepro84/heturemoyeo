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

test("회원정보 수정(비밀번호가 동일하지 않은 경우)", async () => {
    const response = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            nickname: "pink",
            password: "!@#4qwer",
            newpassword: "123456!",
            confirm: "432155@",
            profileImg: "testUrl",
            likeItem: ["game", "board", "kukuku"],
        });
    expect(response.status).toEqual(401);
});

test("회원정보를 찾을 수 없는 경우", async () => {
    const response = await request(app)
        .put("/api/user")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg4LCJpYXQiOjE2MjgxMzA4MDd9.2oJbgYeI5FRtrl90STEwzZTQl4b_ABN8IW6O-cCL3E4"
        )
        .send({
            nickname: "pink",
            password: "!@#4qwer",
            newpassword: "123456!",
            confirm: "432155@",
            profileImg: "testUrl",
            likeItem: ["game", "board", "kukuku"],
        });
    expect(response.status).toEqual(401);
});

test("로그인 유저 정보 확인", async () => {
    const response = await request(app)
        .post("/api/user/me")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send();
    expect(response.status).toEqual(200);
});

// friend api 테스트
test("친구 리스트 보여주기", async () => {
    const response = await request(app)
        .get("/api/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(200);
});

test("친구 리스트 보여주기(입력 형식이 맞지 않을 때)", async () => {
    const response = await request(app)
        .get("/api/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            start: "z",
            limit: 5,
        });
    expect(response.status).toEqual(412);
});

test("친구 리스트 보여주기(입력 형식이 맞지 않을 때)", async () => {
    const response = await request(app)
        .get("/api/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            start: "z",
            limit: 5,
        });
    expect(response.status).toEqual(412);
});

test("친구 리스트 보여주기(친구가 없을 때)", async () => {
    const response = await request(app)
        .get("/api/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(412);
});

test("친구 요청 및 수락(요청을 보내는 userId와 받는 userId가 같을 때)", async () => {
    const response = await request(app)
        .post("/api/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(412);
});

test("이미 등록된 친구에게 친구 요청을 한 경우", async () => {
    const response = await request(app)
        .post("/api/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            userId: 2,
        });
    expect(response.status).toEqual(412);
});

test("친구 요청 성공", async () => {
    const response = await request(app)
        .post("/api/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTYyODEzMDgwN30.cfe753aceaac0fDUNHls3f6jh4YwVLb7ckGGB_zKmoE"
        )
        .send({
            userId: 5,
        });
    expect(response.status).toEqual(200);
});

test("친구 요청을 받은 리스트 불러오기(성공했을 때)", async () => {
    const response = await request(app)
        .get("/api/friend/request")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTYyODEzMDgwN30.cfe753aceaac0fDUNHls3f6jh4YwVLb7ckGGB_zKmoE"
        )
        .send({
            start: 0,
            limit: 5
        });
    expect(response.status).toEqual(200);
});

test("친구 요청을 받은 리스트 불러오기(요청 목록이 없을 때)", async () => {
    const response = await request(app)
        .get("/api/friend/request")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(412);
});

test("친구 요청을 받은 리스트 불러오기(입력형식이 맞지 않을 때)", async () => {
    const response = await request(app)
        .get("/api/friend/request")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            start: 0,
            limit: 'z',
        });
    expect(response.status).toEqual(412);
});

// 친구 목록 검색
test("친구 목록 검색(성공시)", async () => {
    const response = await request(app)
        .get("/api/search/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            start: 0,
            limit: 5,
            keyword: "ri",
        });
    expect(response.status).toEqual(200);
});

test("친구 목록 검색(키워드 입력을 받지 못한 경우)", async () => {
    const response = await request(app)
        .get("/api/search/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(412);
});

test("친구 목록 검색(검색 결과가 없는 경우)", async () => {
    const response = await request(app)
        .get("/api/search/friend")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            start: 0,
            limit: 5,
            keyword: "p"
        });
    expect(response.status).toEqual(200);
});

test("전체 유저 검색", async () => {
    const response = await request(app)
        .get("/api/search/user")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            keyword: "Riot",
        });
    expect(response.status).toEqual(200);
});

test("전체 유저 검색(찾지 못한 경우)", async () => {
    const response = await request(app)
        .get("/api/search/user")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            keyword: "abcdefg",
        });
    expect(response.status).toEqual(400);
});

// post 관련 api 테스트
test("구인 중인 글 보기", async () => {
    const response = await request(app)
        .get("/api/post/posts")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(200);
});

test("구인 중인 글 보기(입력값이 잘못된 경우)", async () => {
    const response = await request(app)
        .get("/api/post/posts")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            start: 'z',
            limit: 5,
        });
    expect(response.status).toEqual(412);
});

test("구인 중인 글 보기(입력값이 잘못된 경우)", async () => {
    const response = await request(app)
        .get("/api/post/posts")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            start: "z",
            limit: 5,
        });
    expect(response.status).toEqual(412);
});

test("게시글 쓰기", async () => {
    const response = await request(app)
        .post("/api/post")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            title: "방탈출 카페 인원 급구중 마이크필수?",
            postImg: "https://wwww.mmmmmm",
            content: "안녕하세요 방입니다.",
            maxMember: 5,
            startDate: "2021-03-21",
            endDate: "2021-03-21",
            place: "강원도 둔둔리 둔둔초등학교",
            bring: "3등분",
            tag: ["방탈출", "마이크필수", "대구시"],
        });
    expect(response.status).toEqual(200);
});

test("게시글 쓰기(잘못된 양식으로 글을 쓸 경우)", async () => {
    const response = await request(app)
        .post("/api/post")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            title: "방탈출 카페 인원 급구중 마이크필수?",
            postImg: "https://wwww.mmmmmm",
            content: "안녕하세요 방입니다.",
            maxMember: 5,
            startDate: "test",
            endDate: "2021-03-21",
            place: "강원도 둔둔리 둔둔초등학교",
            bring: "3등분",
            tag: ["방탈출", "마이크필수", "대구시"],
        });
    expect(response.status).toEqual(412);
});

test("게시글 쓰기(잘못된 양식으로 글을 쓸 경우)", async () => {
    const response = await request(app)
        .post("/api/post")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            title: "방탈출 카페 인원 급구중 마이크필수?",
            postImg: "https://wwww.mmmmmm",
            content: "안녕하세요 방입니다.",
            maxMember: 5,
            startDate: "test",
            endDate: "2021-03-21",
            place: "강원도 둔둔리 둔둔초등학교",
            bring: "3등분",
            tag: ["방탈출", "마이크필수", "대구시"],
        });
    expect(response.status).toEqual(412);
});

test("일정 장소의 정보를 가져오기", async () => {
    const response = await request(app)
        .get("/api/post")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            postId: 3
        });
    expect(response.status).toEqual(200);
});

test("일정 장소의 정보를 가져오기(없는 postId값을 받았을 때)", async () => {
    const response = await request(app)
        .get("/api/post")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            postId: 80,
        });
    expect(response.status).toEqual(401);
});

test("post 삭제", async () => {
    const response = await request(app)
        .delete("/api/post")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send({
            postId: 7,
        });
    expect(response.status).toEqual(200);
});

test("post 삭제(userId로 작성한 포스트가 없을 경우)", async () => {
    const response = await request(app)
        .delete("/api/post")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTYyODEzMDgwN30.ZFPLSuuTXHlagh05L2TSNa8cXOearckSvQnWzaUFzRY"
        )
        .send({
            postId: 6,
        });
    expect(response.status).toEqual(412);
});

test("post 삭제(postId의 양식이 잘못됐을 경우)", async () => {
    const response = await request(app)
        .delete("/api/post")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTYyODEzMDgwN30.ZFPLSuuTXHlagh05L2TSNa8cXOearckSvQnWzaUFzRY"
        )
        .send({
            postId: "z",
        });
    expect(response.status).toEqual(412);
});


// room api 테스트
test("대화방 메시지 불러오기)", async () => {
    const response = await request(app)
        .get("/api/room/1")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTYyODEzMDgwN30.ZFPLSuuTXHlagh05L2TSNa8cXOearckSvQnWzaUFzRY"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(200);
});


test("대화방 메시지 불러오기(userId의 메시지 데이터가 없는 경우)", async () => {
    const response = await request(app)
        .get("/api/room/1")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTYyODEzMDgwN30.cfe753aceaac0fDUNHls3f6jh4YwVLb7ckGGB_zKmoE"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(400);
});


test("대화방 메시지 불러오기(잘못된 postId를 받은 경우)", async () => {
    const response = await request(app)
        .get("/api/room/7")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(400);
});


test("대화방 채팅 전송", async () => {
    const response = await request(app)
        .post("/api/room/chat")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            postId: 1,
            message: "test",
        });
    expect(response.status).toEqual(200);
});



test("대화방 채팅 전송(잘못된 형태의 데이터 전달)", async () => {
    const response = await request(app)
        .post("/api/room/chat")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            postId: 1,
            message: 2,
        });
    expect(response.status).toEqual(400);
});



test("대화방 채팅 전송(잘못된 형태의 데이터 전달)", async () => {
    const response = await request(app)
        .post("/api/room/chat")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send({
            postId: 1,
            message: 2,
        });
    expect(response.status).toEqual(400);
});


test("친구 목록, 일정에 속해있는 유저 목록", async () => {
    const response = await request(app)
        .get("/api/user/myusers")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4"
        )
        .send();
    expect(response.status).toEqual(200);
});

test("친구 목록, 일정에 속해있는 유저 목록(유저가 채널에 없는 경우)", async () => {
    const response = await request(app)
        .get("/api/user/myusers")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTYyODEzMDgwN30.cfe753aceaac0fDUNHls3f6jh4YwVLb7ckGGB_zKmoE"
        )
        .send();
    expect(response.status).toEqual(200);
});

test("친구 목록, 일정에 속해있는 유저 목록(친구가 없는 경우)", async () => {
    const response = await request(app)
        .get("/api/user/myusers")
        .set(
            "authorization",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYyODEzMDgwN30.oNFbHrwA1IhM_Dnd09BmhLVEeCzz0QMsc5tWC7vWgTo"
        )
        .send();
    expect(response.status).toEqual(200);
});