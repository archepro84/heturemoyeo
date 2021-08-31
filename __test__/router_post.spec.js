const request = require("supertest");
const app = require("../app");
const clearData = require("./clearData")
const { test, expect } = require("@jest/globals");
// TODO Seeder 이후 만들어야함

// post api 테스트

test("GET /api/post 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/post")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/post 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .get("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/post 경로에 알맞는 정보를 입력하면 모임 상세페이지로 이동 성공 (200) ", async () => {
    const response = await request(app)
        .get("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 1,
        });
    expect(response.status).toEqual(200);
});





test("POST /api/post 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .post("/api/post")
        .send();
    expect(response.status).toEqual(401);
});
test("POST /api/post 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .post("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("POST /api/post 경로에 유저에 대한 정보가 없으면 실패 (400) ", async () => {
    const response = await request(app)
        .post("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 10,
        });
    expect(response.status).toEqual(400);
});
test("POST /api/post 경로에 title에 빈값이면 실패 (400) ", async () => {
    const response = await request(app)
        .post("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            title: "",
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostmaxMamber,
            startDate: clearData.PoststartDate,
            endDate: clearData.PostendDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            Ing: clearData.PostIng,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(400);
});
test("POST /api/post 경로에 maxMember가 빈값이면 실패 (400) ", async () => {
    const response = await request(app)
        .post("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            title: clearData.PostTitle,
            postImg: clearData.postImg,
            content: clearData.PostContent,
            maxMember: "",
            startDate: clearData.PoststartDate,
            endDate: clearData.PostendDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            Ing: clearData.PostIng,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(400);
});
test("POST /api/post 경로에 startDate가 빈값이면 실패 (400) ", async () => {
    const response = await request(app)
        .post("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostmaxMamber,
            startDate: "",
            endDate: clearData.PostendDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            Ing: clearData.PostIng,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(400);
});
test("POST /api/post 경로에 endDate가 빈값이면 실패 (412) ", async () => {
    const response = await request(app)
        .post("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostmaxMamber,
            startDate: new Date().getTime() + 10000,
            endDate: new Date().getTime() - 10000,
            place: clearData.PostPlace,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(412);
});
// test("POST /api/post 경로에 데이터를 알맞게 작성하면 성공 (201) ", async () => {
//     const response = await request(app)
//         .post("/api/post")
//         .set(
//             "authorization",
//             clearData.Authorization
//         )
//         .send({
//             title: clearData.PostTitle,
//             postImg: clearData.PostImg,
//             content: clearData.PostContent,
//             maxMember: clearData.PostmaxMamber,
//             startDate: new Date().getTime() + 10000,
//             endDate: new Date().getTime() + 10000,
//             place: clearData.PostPlace,
//             bring: "No",
//             tag: [
//                 "Tag"
//             ]
//         });
//     expect(response.status).toEqual(201);
// });




test("PUT /api/post 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .put("/api/post")
        .send();
    expect(response.status).toEqual(401);
});
test("PUT /api/post 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("PUT /api/post 경로에 모임이 존재 하지 않으면 실패 (412) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 13,
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: 5,
            startDate: new Date(),
            endDate: new Date(),
            place: clearData.PostPlace,
            lat: 37.56211,
            lng: 126.941069,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(412);
});
test("PUT /api/post 경로에 postId가 존재하지 않으면 실패 (400) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: "",
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: 5,
            startDate: new Date(),
            endDate: new Date(),
            place: clearData.PostPlace,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(400);
});
test("PUT /api/post 경로에 title에 아무 값도 주지 않으면 실패 (412) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 13,
            title: "",
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: 5,
            startDate: new Date(),
            endDate: new Date(),
            place: clearData.PostPlace,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(412);
});
test("PUT /api/post 경로에 content에 아무 값도 주지 않으면 실패 (400) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 13,
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: "",
            maxMember: 5,
            startDate: new Date(),
            endDate: new Date(),
            place: clearData.PostPlace,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(400);
});
test("PUT /api/post 경로에 maxMember에 아무값도 주지 않으면 실패 (400) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 13,
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: "",
            startDate: new Date(),
            endDate: new Date(),
            place: clearData.PostPlace,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(400);
});
test("PUT /api/post 경로에 시작 시간이 비어 있으면 실패 (400) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 13,
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: 5,
            startDate: "",
            endDate: new Date(),
            place: clearData.PostPlace,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(400);
});
test("PUT /api/post 경로에 끝나는 시간이 비어 있으면 실패 (412) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 13,
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: 5,
            startDate: new Date().getTime() + 10000,
            endDate: new Date().getTime() - 10000,
            place: clearData.PostPlace,
            bring: clearData.PostBring,
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(412);
});
test("PUT /api/post 경로에 bring이 비어 있으면 실패 (400) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 13,
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: 5,
            startDate: new Date(),
            endDate: new Date(),
            place: clearData.PostPlace,
            lat: 37.56211,
            lng: 126.941069,
            bring: "",
            tag: clearData.PostTag
        });
    expect(response.status).toEqual(400);
});
test("PUT /api/post 경로에 tag가 비어 있으면 실패 (400) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 13,
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: 5,
            startDate: new Date(),
            endDate: new Date(),
            place: clearData.PostPlace,
            lat: 37.56211,
            lng: 126.941069,
            bring: clearData.PostBring,
            tag: ""
        });
    expect(response.status).toEqual(400);
});
// test("PUT /api/post 경로가 확정된 모임이면 실패 (406) ", async () => {
//     const response = await request(app)
//         .put("/api/post")
//         .set(
//             "authorization",
//             clearData.Authorization
//         )
//         .send({
//             postId: 28,
//             title: clearData.PostTitle,
//             postImg: clearData.PostPostImg,
//             content: clearData.PostContent,
//             maxMember: 1,
//             startDate: new Date().getTime() + 10000,
//             endDate: new Date().getTime() + 10000,
//             place: clearData.PostPlace,
//             bring: "Hi",
//             tag: [
//                 "No!"
//             ]
//         });
//     expect(response.status).toEqual(406);
// });
test("PUT /api/post 경로에 현재 참여 인원보다 적은 인원 수이면 실패 (400) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 10,
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: -1,
            startDate: new Date().getTime() + 10000,
            endDate: new Date().getTime() + 10000,
            place: clearData.PostPlace,
            bring: "Hi",
            tag: [
                "No!"
            ]
        });
    expect(response.status).toEqual(400);
});
test("PUT /api/post 경로에 올바른 정보를 입력하면 성공 (201) ", async () => {
    const response = await request(app)
        .put("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 12,
            title: clearData.PostTitle,
            postImg: clearData.PostPostImg,
            content: clearData.PostContent,
            maxMember: 3,
            startDate: new Date().getTime() + 10000,
            endDate: new Date().getTime() + 10000,
            place: clearData.PostPlace,
            bring: "Hi",
            tag: [
                "No!"
            ]
        });
    expect(response.status).toEqual(201);
});




test("DELETE /api/post 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .delete("/api/post")
        .send();
    expect(response.status).toEqual(401);
});
test("DELETE /api/post 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .delete("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("DELETE /api/post 경로에 postId가 없으면 실패 (412) ", async () => {
    const response = await request(app)
        .delete("/api/post")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            postId: 100,
        });
    expect(response.status).toEqual(412);
});
// test("DELETE /api/post 경로에 postId가 있으면 삭제 성공 (200)) ", async () => {
//     const response = await request(app)
//         .delete("/api/post")
//         .set(
//             "authorization",
//             clearData.Authorization
//         )
//         .send({
//             postId: 26,
//         });
//     expect(response.status).toEqual(201);
// });




//전체 모임 가져오기
test("GET /api/post/posts 경로에 알맞게 정보를 입력하면 성공 (200) ", async () => {
    const response = await request(app)
        .get("/api/post/posts")
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




test("GET /api/post/posts/my 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/post/posts/my")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/post/posts/my 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .get("/api/post/posts/my")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/post/posts/my 경로에 알맞게 정보를 입력하면 성공 (200) ", async () => {
    const response = await request(app)
        .get("/api/post/posts/my")
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




test("GET /api/post/posts/my 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .get("/api/post/posts/my")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/post/posts/location 경로에 알맞는 정보를 입력하면 성공 (200)", async () => {
    const response = await request(app)
        .get("/api/post/posts/location")
        .send();
    expect(response.status).toEqual(200);
});




test("GET /api/post/posts/master 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/post/posts/master")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/post/posts/master 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .get("/api/post/posts/master")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/post/posts/master 경로에 알맞는 정보를 입력하면 성공 (200) ", async () => {
    const response = await request(app)
        .get("/api/post/posts/master")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(200);
});



test("GET /api/post/posts/invite 경로에 요청했을 떄 Authorization 헤더가 없을 경우 실패 (401)", async () => {
    const response = await request(app)
        .get("/api/post/posts/invite")
        .send();
    expect(response.status).toEqual(401);
});
test("GET /api/post/posts/invite 경로에 전혀 다른 값을 가져오면 실패 (400) ", async () => {
    const response = await request(app)
        .get("/api/post/posts/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            userId: 1,
        });
    expect(response.status).toEqual(400);
});
test("GET /api/post/posts/invite 경로에 알맞는 정보를 입력하면 성공 (200) ", async () => {
    const response = await request(app)
        .get("/api/post/posts/invite")
        .set(
            "authorization",
            clearData.Authorization
        )
        .send({
            start: 0,
            limit: 5,
        });
    expect(response.status).toEqual(200);
});