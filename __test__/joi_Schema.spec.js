const schema = require("../routers/joi_Schema");
const clearData = require("./clearData");
// string joi가 undefined일 때 왜 통과될까?

//userIdSchema 테스트
test("userIdSchema : userId가 number 형식이 아닐 경우 실패", async () => {
    await expect(
        schema.userIdSchema.validateAsync({ userId: "hello" })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: "a" })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: [] })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: {} })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: true })
    ).rejects.toThrowError();
});
test("userIdSchema : userId가 1보다 작을 경우 실패", async () => {
    await expect(
        schema.userIdSchema.validateAsync({ userId: 0 })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: -1 })
    ).rejects.toThrowError();
});
test("userIdSchema : userId가 비었거나 없을 경우 실패", async () => {
    await expect(schema.userIdSchema.validateAsync({})).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: null })
    ).rejects.toThrowError();
});
test("userIdSchema : userId가 성공", async () => {
    await expect(schema.userIdSchema.validateAsync({ userId: 1 })); // 성공
});

//userIdNumberSchema 테스트
test("userIdNumberSchema : userId가 number 형식이 아닐 경우 실패", async () => {
    await expect(
        schema.userIdSchema.validateAsync({ userId: "hello" })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: "a" })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: [] })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: {} })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: true })
    ).rejects.toThrowError();
});
test("userIdNumberSchema : userId가 1보다 작을 경우 실패", async () => {
    await expect(
        schema.userIdSchema.validateAsync({ userId: 0 })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: -1 })
    ).rejects.toThrowError();
});
test("userIdNumberSchema : userId가 비었거나 없을 경우 실패", async () => {
    await expect(schema.userIdSchema.validateAsync({})).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({ userId: null })
    ).rejects.toThrowError();
});
test("userIdNumberSchema : userId가 성공", async () => {
    await expect(schema.userIdSchema.validateAsync({ userId: 1 })); // 성공
});


//postIdSchema 테스트
test("postIdSchema : postId가 없거나 1미만일 경우 실패 ", async () => {
    await expect(
        schema.postIdSchema.validateAsync({
            postId: "",
        })
    ).rejects.toThrowError();
    await expect(
        schema.postIdSchema.validateAsync({
            postId: 0,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postIdSchema.validateAsync({
            postId: -1,
        })
    ).rejects.toThrowError();
});
test("postIdSchema : 테스트 성공 ", async () => {
    await expect(
        schema.postIdSchema.validateAsync({
            postId: 1,
        })
    )
});


//startLimitSchema 테스트
test("startLimitSchema: start가 0보다 작을 경우", async () => {
    await expect(
        schema.startLimitSchema.validateAsync({
            start: -1,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
});
test("startLimitSchema : start가 number가 아닐 경우", async () => {
    await expect(
        schema.startLimitSchema.validateAsync({
            start: "abc",
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.startLimitSchema.validateAsync({
            start: [],
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.startLimitSchema.validateAsync({
            start: {},
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.startLimitSchema.validateAsync({
            start: undefined,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.startLimitSchema.validateAsync({
            start: null,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
});
test("startLimitSchema : limit가 1보다 작을 경우", async () => {
    await expect(
        schema.startLimitSchema.validateAsync({
            start: clearData.Start,
            limit: 0,
        })
    ).rejects.toThrowError();
});
test("startLimitSchema : limit가 number가 아닐 경우", async () => {
    await expect(
        schema.startLimitSchema.validateAsync({
            start: clearData.Start,
            limit: "abc",
        })
    ).rejects.toThrowError();
    await expect(
        schema.startLimitSchema.validateAsync({
            start: clearData.Start,
            limit: [],
        })
    ).rejects.toThrowError();
    await expect(
        schema.startLimitSchema.validateAsync({
            start: clearData.Start,
            limit: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.startLimitSchema.validateAsync({
            start: clearData.Start,
            limit: undefined,
        })
    ).rejects.toThrowError();
    await expect(
        schema.startLimitSchema.validateAsync({
            start: clearData.Start,
            limit: null,
        })
    ).rejects.toThrowError();
});
test("startLimitSchema : 테스트 코드 통과", async () => {
    await expect(
        schema.startLimitSchema.validateAsync({
            start: clearData.Start,
            limit: clearData.Limit,
        })
    );
    await expect(
        schema.startLimitSchema.validateAsync({
            start: clearData.Start,
            limit: clearData.Limit,
        })
    );
});


// phone 스키마 테스트
test("phoneSchema : 전화번호가 없을 경우", async () => {
    await expect(
        schema.phoneSchema.validateAsync({
            phone: ""
        })
    ).rejects.toThrowError();
});
test("phoneSchema : 전화번호가 1로 시작할 경우", async () => {
    await expect(
        schema.phoneSchema.validateAsync({
            phone: "11011111111"
        })
    ).rejects.toThrowError();
    await expect(
        schema.phoneSchema.validateAsync({
            phone: "11111111111"
        })
    ).rejects.toThrowError();
});
test("phoneSchema : 다른 특수문자가 섞여 있을 경우", async () => {
    await expect(
        schema.phoneSchema.validateAsync({
            phone: "010.1111.1111"
        })
    ).rejects.toThrowError();
    await expect(
        schema.phoneSchema.validateAsync({
            phone: "010@1111@1111"
        })
    ).rejects.toThrowError();
    await expect(
        schema.phoneSchema.validateAsync({
            phone: "010!1111!1111"
        })
    ).rejects.toThrowError();
});
test("phoneSchema : 전화번호가 11자리 초과이거나 미만일 경우", async () => {
    await expect(
        schema.phoneSchema.validateAsync({
            phone: "0101111111111"
        })
    ).rejects.toThrowError();
    await expect(
        schema.phoneSchema.validateAsync({
            phone: "011111111"
        })
    ).rejects.toThrowError();
});
test("phoneSchema : 테스트 통과", async () => {
    await expect(
        schema.phoneSchema.validateAsync({
            phone: clearData.Phone
        })
    );
});


// authDataSchema 테스트
test("authDataSchema : 전화번호가 없을 경우", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            phone: "",
            authData: clearData.authData,
        })
    ).rejects.toThrowError();
});
test("authDataSchema : 전화번호가 1로 시작할 경우", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            phone: "11011111111",
            authData: clearData.authData,
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            phone: "11111111111",
            authData: clearData.authData,
        })
    ).rejects.toThrowError();
});
test("authDataSchema : 다른 특수문자가 섞여 있을 경우", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            phone: "010.1111.1111",
            authData: clearData.authData,
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            phone: "010@1111@1111",
            authData: clearData.authData,
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            phone: "010!1111!1111",
            authData: clearData.authData,
        })
    ).rejects.toThrowError();
});
test("authDataSchema : 전화번호가 11자리 초과이거나 미만일 경우", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            phone: "0101111111111",
            authData: clearData.authData,
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            phone: "011111111"
        })
    ).rejects.toThrowError();
});
test("authDataSchema : authData가 6글자 미만", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            email: clearData.Email,
            authData: "abc",
        })
    ).rejects.toThrowError();
});
test("authDataSchema : authData가 7글자 이상", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            phone: clearData.Phone,
            authData: "abcdefg",
        })
    ).rejects.toThrowError();
});
test("authDataSchema : authData가 string형태가 아닐때", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            phone: clearData.Phone,
            authData: 1,
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            phone: clearData.Phone,
            authData: [],
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            phone: clearData.Phone,
            authData: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            phone: clearData.Phone,
            authData: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            phone: clearData.Phone,
            authData: undefined,
        })
    ).rejects.toThrowError();
});
test("authDataSchema : 테스트 통과", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            phone: clearData.Phone,
            authData: clearData.authData,
        })
    );
});


// newPassSchema 테스트
test("newPassSchema : authId가 0이하", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: 0,
            phone: clearData.Phone,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : authId가 int형태가 아닐때", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: "1",
            phone: clearData.Phone,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: {},
            phone: clearData.Phone,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: [],
            phone: clearData.Phone,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: null,
            phone: clearData.Phone,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: undefined,
            phone: clearData.Phone,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : 전화번호가 비어 있을 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: "",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : 전화번호에 특수문자가 있을 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: "010.1111.1111",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: "010@1111@1111",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: "010!1111!1111",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: "010#1111#1111",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : 전화번호가 1로 시작할  경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: "11011111111",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: "11111111111",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : 전화번호가 11자리초과 또는 미만일 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: "0101111111111111",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: "01011111",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : password가 6글자 미만일 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: clearData.Phone,
            password: "123",
            confirm: clearData.SchemaPassword,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: clearData.Phone,
            password: clearData.SchemaPassword,
            confirm: "123",
        })
    ).rejects.toThrowError();
});
test("newPassSchema : password가 20글자가 넘을 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: clearData.Phone,
            password: "123af4b56sdfb489sfb16sd156sdv156",
            confirm: clearData.SchemaPassword,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: clearData.Phone,
            password: clearData.SchemaPassword,
            confirm: "123af4b56sdfb489sfb16sd156sdv156",
        })
    ).rejects.toThrowError();
});
test("newPassSchema : password가 string 형식이 아닐 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: clearData.Phone,
            password: 123,
            confirm: clearData.SchemaPassword,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            phone: clearData.Phone,
            password: clearData.SchemaPassword,
            confirm: 123,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : 테스트 성공", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: clearData.email,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    );
});



// loginSchema 테스트 코드
test("loginSchema : 전화번호가 비어 있을 경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            phone: "",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
});
test("loginSchema : 전화번호에 특수 문자가 있을 경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            phone: "010.1111.1111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            phone: "010-1111-1111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            phone: "010@1111@1111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            phone: "010!1111!1111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
});
test("loginSchema : 전화번호가 11자리 초과 미만일  경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            phone: "0101111111111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            phone: "01011111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
});
test("loginSchema : 전화번호가 1로 시작할 경우 경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            phone: "11011111111",
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            phone: "11111111111",
        })
    ).rejects.toThrowError();
});
test("loginSchema : password 6글자 미만", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            phone: clearData.Phone,
            password: "ab!",
        })
    ).rejects.toThrowError();
});
test("loginSchema : password가 20글자가 넘을 때", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            phone: clearData.Phone,
            password: "abcdefg123456qFBHQER@#THWRTHWRADFVADBV",
        })
    ).rejects.toThrowError();
});
test("loginSchema : password가 string이 아닐 경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            phone: clearData.Phone,
            password: 123456,
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            phone: clearData.Phone,
            password: ["a", "b", "c"],
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            phone: clearData.Phone,
            password: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            phone: clearData.Phone,
            password: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            phone: clearData.Phone,
            password: undefined,
        })
    ).rejects.toThrowError();
});
test("loginSchema : 테스트 통과", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            phone: clearData.Phone,
            password: clearData.Password,
        })
    );
});


// postSchema 테스트 코드
test("postSchema : title이 100자가 넘을 경우", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: "abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345",
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : title이 string이 아닐 경우 (null 제외)", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: 123,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: [],
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: {},
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: undefined,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : postImg가 string이 아닐 경우 (null 제외)", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: 123,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: [],
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: {},
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: undefined,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : content가 string이 아닐 경우 (undefined 제외)", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: 123,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: [],
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: {},
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: null,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : maxMember가 최소인원이 2미만 일 경우", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: 1,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: 0,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: -1,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : maxMember가 255가 넘을 경우", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: 300,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : maxMember가 int가 아닐 경우", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: "300",
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: [],
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: {},
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: null,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: undefined,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : startDate가 날짜 형식이 아닐 경우", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: "string",
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: "14-15-166",
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: "14-101-166",
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: ["14-15-166", "abc"],
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: {},
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: null,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: undefined,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : endDate가 날짜 형식이 아닐 경우", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: "string",
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: "14-15-166",
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: "14-101-166",
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: ["14-15-166", "abc"],
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: {},
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: null,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: undefined,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : place가 string이 아닐 때", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: 123,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: [],
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: {},
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: null,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: undefined,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : lat이 -90보다 작거나 90보다 클 때", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: -95,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: 100,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : lat이 string일 때", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: "string",
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : lat이 undefined일 때", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: undefined,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : lng가 -180보다 작거나 180보다 클 때", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: -200,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: 200,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : lat이 string일 때", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: "string",
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : lat이 undefined일 때", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: undefined,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : bring이 string이 아닐 때", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: 123,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: [],
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: {},
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: null,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: undefined,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postSchema : tag가 array가 아닐 때", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: 123,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: "string",
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: undefined,
        })
    ).rejects.toThrowError();
});
test("postSchema : 테스트 통과", async () => {
    await expect(
        schema.postSchema.validateAsync({
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    );
    await expect(
        schema.postSchema.validateAsync({
            title: null,
            postImg: null,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: null,
            lng: null,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    );
    await expect(
        schema.postSchema.validateAsync({
            title: "",
            postImg: "",
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: null,
            lng: null,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    );
});


//postPutSchema 테스트 코드 
test("postPutSchema : postId가 1 미만일 경우", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: 0,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : postId가 int가 아닐 경우", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: "string",
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: [],
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: {},
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: null,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: undefined,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : title이 100자가 넘을 경우", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: "abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345",
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : title이 string이 아닐 경우 (null 제외)", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: 123,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: [],
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: {},
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: undefined,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : postImg가 string이 아닐 경우 (null 제외)", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: 123,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: [],
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: {},
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: undefined,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : content가 string이 아닐 경우 (undefined 제외)", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: 123,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: [],
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: {},
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: null,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : maxMember가 최소 인원이 2미만 일 경우", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: 1,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: 0,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: -1,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : maxMember가 255가 넘을 경우", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: 300,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : maxMember가 int가 아닐 경우", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: "300",
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: [],
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: {},
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: null,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: undefined,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : startDate가 날짜 형식이 아닐 경우", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: "string",
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: "14-15-166",
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: "14-101-166",
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: ["14-15-166", "abc"],
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: {},
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: null,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: undefined,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : endDate가 날짜 형식이 아닐 경우", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: "string",
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: "14-15-166",
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: "14-101-166",
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: ["14-15-166", "abc"],
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: {},
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: null,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxmember,
            startDate: clearData.PostStartDate,
            endDate: undefined,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : place가 string이 아닐 때", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: 123,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: [],
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: {},
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: null,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: undefined,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : lat이 -90보다 작거나 90보다 클 때", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: -95,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: 100,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : lat이 string일 때", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: "string",
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : lat이 undefined일 때", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: undefined,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : lng가 -180보다 작거나 180보다 클 때", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: -200,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: 200,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : lat이 string일 때", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: "string",
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : lat이 undefined일 때", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: undefined,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : bring이 string이 아닐 때", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: 123,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: [],
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: {},
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: null,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: undefined,
            tag: clearData.PostTag,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : tag가 array가 아닐 때", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: 123,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: "string",
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: undefined,
        })
    ).rejects.toThrowError();
});
test("postPutSchema : 테스트 통과", async () => {
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: clearData.PostTitle,
            postImg: clearData.PostImg,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: clearData.PostLat,
            lng: clearData.PostLng,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    );
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: null,
            postImg: null,
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: null,
            lng: null,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    );
    await expect(
        schema.postPutSchema.validateAsync({
            postId: clearData.PostId,
            title: "",
            postImg: "",
            content: clearData.PostContent,
            maxMember: clearData.PostMaxMember,
            startDate: clearData.PostStartDate,
            endDate: clearData.PostEndDate,
            place: clearData.PostPlace,
            lat: null,
            lng: null,
            bring: clearData.PostBring,
            tag: clearData.PostTag,
        })
    );
});


// chatSchema 테스트 코드 
test("chatSchema : postId가 1 미만일 경우", async () => {
    await expect(
        schema.chatSchema.validateAsync({
            postId: 0,
            message: clearData.Message,
        })
    ).rejects.toThrowError();
});
test("chatSchema : postId가 int가 아닐 경우", async () => {
    await expect(
        schema.chatSchema.validateAsync({
            postId: "string",
            message: clearData.Message,
        })
    ).rejects.toThrowError();
    await expect(
        schema.chatSchema.validateAsync({
            postId: [],
            message: clearData.Message,
        })
    ).rejects.toThrowError();
    await expect(
        schema.chatSchema.validateAsync({
            postId: {},
            message: clearData.Message,
        })
    ).rejects.toThrowError();
    await expect(
        schema.chatSchema.validateAsync({
            postId: null,
            message: clearData.Message,
        })
    ).rejects.toThrowError();
    await expect(
        schema.chatSchema.validateAsync({
            postId: undefined,
            message: clearData.Message,
        })
    ).rejects.toThrowError();
});
test("chatSchema : postId가 1 미만일 경우", async () => {
    await expect(
        schema.chatSchema.validateAsync({
            postId: 0,
            message: clearData.Message,
        })
    ).rejects.toThrowError();
});
test("chatSchema : message가 string이 아닐 경우", async () => {
    await expect(
        schema.chatSchema.validateAsync({
            postId: clearData.PostId,
            message: 123,
        })
    ).rejects.toThrowError();
    await expect(
        schema.chatSchema.validateAsync({
            postId: clearData.PostId,
            message: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.chatSchema.validateAsync({
            postId: clearData.PostId,
            message: [],
        })
    ).rejects.toThrowError();
});
test("chatSchema : message가 255자가 넘을 경우", async () => {
    await expect(
        schema.chatSchema.validateAsync({
            postId: clearData.PostId,
            message:
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        })
    ).rejects.toThrowError();
});
test("chatSchema : message 테스트 통과", async () => {
    await expect(
        schema.chatSchema.validateAsync({
            postId: clearData.PostId,
            message: clearData.Message,
        })
    );
});


// keywordSchema 테스트 코드
test("keywordSchema : keyword가 string이 아닐 경우", async () => {
    await expect(
        schema.keywordSchema.validateAsync({
            keyword: 0,
        })
    ).rejects.toThrowError();
    await expect(
        schema.keywordSchema.validateAsync({
            keyword: [],
        })
    ).rejects.toThrowError();
    await expect(
        schema.keywordSchema.validateAsync({
            keyword: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.keywordSchema.validateAsync({
            keyword: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.keywordSchema.validateAsync({
            keyword: undefined,
        })
    ).rejects.toThrowError();
});
test("keywordSchema : 테스트 통과", async () => {
    await expect(
        schema.keywordSchema.validateAsync({
            keyword: "test",
        })
    );
});


// searchPostSchema 테스트 코드
test("searchPostSchema : keyword가 string이 아닐 경우 (null 제외)", async () => {
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: 0,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: [],
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: {},
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: undefined,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
});
test("searchPostSchema : searchDate가 Date가 아닐 경우 (null 제외)", async () => {
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: [],
            start: clearData.Start,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: {},
            start: clearData.Start,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: "abc",
            start: clearData.Start,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: undefined,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
});
test("searchPostSchema : start가 0보다 작을 경우", async () => {
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: -1,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
});
test("searchPostSchema : start가 number가 아닐 경우", async () => {
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: "abc",
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: [],
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: {},
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: undefined,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: null,
            limit: clearData.Limit,
        })
    ).rejects.toThrowError();
});
test("searchPostSchema : limit가 1보다 작을 경우", async () => {
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: 0,
        })
    ).rejects.toThrowError();
});
test("searchPostSchema : limit가 number가 아닐 경우", async () => {
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: "abc",
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: [],
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: undefined,
        })
    ).rejects.toThrowError();
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: null,
        })
    ).rejects.toThrowError();
});
test("searchPostSchema : 테스트 코드 통과", async () => {
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: clearData.Keyword,
            searchDate: clearData.SearchDate,
            start: clearData.Start,
            limit: clearData.Limit,
        })
    );
    await expect(
        schema.searchPostSchema.validateAsync({
            keyword: null,
            searchDate: null,
            start: clearData.Start,
            limit: clearData.Limit,
        })
    );
});


// signSchema 테스트 코드
test("signSchema : 전화번호가 없을 경우 ", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: "",
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : 전화번호가 1로 시작할 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: "10111111111",
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: "11111111111",
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : 전화번호에 특수문자가 들어갈 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: "010.1111.1111",
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: "010-1111-1111",
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: "010@1111@1111",
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: "010!1111!1111",
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : 전화번호가 string 형식이 아닐 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: 123,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: [],
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: {},
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: null,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: undefined,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : name이 string 형식이 아닐 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: 123,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: [],
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: {},
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: null,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: undefined,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : name에 특수문자가 섞여 있을 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: "test!!",
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: "test@#$",
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : name이 두글자 미만일 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: "a",
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: "",
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : name이 30글자가 넘을 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: "abcdefghijklmnthsewyfvdswrtyhdsaereq",
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : nickname이 string 형식이 아닐 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: 12,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: [],
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: {},
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: null,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: undefined,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : nickname에 특수문자가 섞여 있을 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: "test!!",
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: "test@#$",
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : nickname이 한글자 미만일 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: "",
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : nickname이 스무글자가 넘을 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: "abcdefghijklmnabcdefghijklasdmn",
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : password, confirm에 한글이 들어간 경우 실패 ", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: "테스트",
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: "테스트",
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : password, confirm이 6글자 미만일 경우 실패 ", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: "a",
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: "",
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: "abcd!",
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: "a",
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: "abcd",
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: "abcd!",
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : password, confirm이 20글자가 넘을 경우 실패 ", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: "abcdefghijskvlksdjfvkladfjblafdebjl",
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: "abcdefghijskvlksdjfvkladfjblafdebjl",
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : password가 비어있을 경우 실패 ", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: "",
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: "",
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : password가 null이거나 undefined일 경우 실패 ", async () => { // undefined일 경우가 실패하지 않음.
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: null,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: undefined,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    )//.rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: null,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: undefined,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    )//.rejects.toThrowError();
});
test("signSchema : profileImg가 string이 아닐 때 (null 제외)", async () => {  // undefined는 왜 안 될까?
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: 123,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: [],
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: {},
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: undefined,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    )//.rejects.toThrowError();
});
test("signSchema : statusMessage가 string이 아닐 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: [],
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: {},
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: 123,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : statusMessage가 255글자 보다 클 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage:
                "abcdefghijklmnopqrasdsadqswrewqrfdsafadsrfdewqre3wrtaegafdsgadstgrwetyerwtregsdfghfsdgeqrwtqrtstuvwxyzabcdefghiabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzjklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzjklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzjklmnopqrstuvwxyz",
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : likeItem이 array가 아닐 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: "abc",
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: 123,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: undefined,
        })
    ).rejects.toThrowError();
});
test("signSchema : 테스트 통과", async () => {
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    );
    await expect(
        schema.signSchema.validateAsync({
            phone: clearData.Phone,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: null,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    );
});


// nicknameSchema 테스트
test("nicknameSchema : nickname이 string 형식이 아닐 경우 실패", async () => {
    await expect(
        schema.nicknameSchema.validateAsync({ userId: 123 })
    ).rejects.toThrowError();
    await expect(
        schema.nicknameSchema.validateAsync({ userId: [] })
    ).rejects.toThrowError();
    await expect(
        schema.nicknameSchema.validateAsync({ userId: {} })
    ).rejects.toThrowError();
    await expect(
        schema.nicknameSchema.validateAsync({ userId: true })
    ).rejects.toThrowError();
});
test("nicknameSchema : nickname이 1글자 미만일 경우 실패", async () => {
    await expect(
        schema.nicknameSchema.validateAsync({ nickname: "" })
    ).rejects.toThrowError();
});
test("nicknameSchema : nickname이 비었거나 없을 경우 실패", async () => {
    await expect(
        schema.nicknameSchema.validateAsync({})
    ).rejects.toThrowError();
    await expect(
        schema.nicknameSchema.validateAsync({ nickname: null })
    ).rejects.toThrowError();
});
test("nicknameSchema : nickname이 성공", async () => {
    await expect(schema.nicknameSchema.validateAsync({ nickname: "홍길동좌" })); // 성공
});


// confirmSchema 테스트
test("confirmSchema : password가 6글자 미만일 경우", async () => {
    await expect(
        schema.confirmSchema.validateAsync({
            password: "123",
            confirm: clearData.SchemaPassword,
        })
    ).rejects.toThrowError();
    await expect(
        schema.confirmSchema.validateAsync({
            password: clearData.SchemaPassword,
            confirm: "123",
        })
    ).rejects.toThrowError();
});
test("confirmSchema : password가 20글자가 넘을 경우", async () => {
    await expect(
        schema.confirmSchema.validateAsync({
            password: "123af4b56sdfb489sfb16sd156sdv156",
            confirm: clearData.SchemaPassword,
        })
    ).rejects.toThrowError();
    await expect(
        schema.confirmSchema.validateAsync({
            password: clearData.SchemaPassword,
            confirm: "123af4b56sdfb489sfb16sd156sdv156",
        })
    ).rejects.toThrowError();
});
test("confirmSchema : password가 string 형식이 아닐 경우", async () => {
    await expect(
        schema.confirmSchema.validateAsync({
            password: 123,
            confirm: clearData.SchemaPassword,
        })
    ).rejects.toThrowError();
    await expect(
        schema.confirmSchema.validateAsync({
            password: clearData.SchemaPassword,
            confirm: 123,
        })
    ).rejects.toThrowError();
});
test("confirmSchema : 테스트 통과", async () => {
    await expect(
        schema.confirmSchema.validateAsync({
            password: "123456abc",
            confirm: "123456abc",
        })
    );
});


// signDeleteSchema 테스트 코드
test("signDeleteSchema : 전화번호가 비어 있을 경우", async () => {
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: "",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
});
test("signDeleteSchema : 전화번호에 특수 문자가 있을 경우", async () => {
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: "010.1111.1111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: "010-1111-1111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: "010@1111@1111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: "010!1111!1111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
});
test("signDeleteSchema : 전화번호가 11자리 초과 미만일  경우", async () => {
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: "0101111111111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: "01011111",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
});
test("signDeleteSchema : 전화번호가 1로 시작할 경우 경우", async () => {
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: "11011111111",
        })
    ).rejects.toThrowError();
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: "11111111111",
        })
    ).rejects.toThrowError();
});
test("signDeleteSchema : password 6글자 미만", async () => {
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: clearData.Phone,
            password: "ab!",
        })
    ).rejects.toThrowError();
});
test("signDeleteSchema : password가 20글자가 넘을 때", async () => {
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: clearData.Phone,
            password: "abcdefg123456qFBHQER@#THWRTHWRADFVADBV",
        })
    ).rejects.toThrowError();
});
test("signDeleteSchema : password가 string이 아닐 경우", async () => {
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: clearData.Phone,
            password: 123456,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: clearData.Phone,
            password: ["a", "b", "c"],
        })
    ).rejects.toThrowError();
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: clearData.Phone,
            password: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: clearData.Phone,
            password: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: clearData.Phone,
            password: undefined,
        })
    ).rejects.toThrowError();
});
test("signDeleteSchema : 테스트 통과", async () => {
    await expect(
        schema.signDeleteSchema.validateAsync({
            phone: clearData.Phone,
            password: clearData.Password,
        })
    );
});


//statusMessageSchema 테스트
test("statusMessageSchema : statusMessage가 string이 아닐 때", async () => {
    await expect(
        schema.statusMessageSchema.validateAsync({
            statusMessage: [],
        })
    ).rejects.toThrowError();
    await expect(
        schema.statusMessageSchema.validateAsync({
            statusMessage: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.statusMessageSchema.validateAsync({
            statusMessage: 123,
        })
    ).rejects.toThrowError();
});
test("statusMessageSchema : statusMessage가 255글자 보다 클 때", async () => {
    await expect(
        schema.statusMessageSchema.validateAsync({
            statusMessage:
                "abcdefghijklmnopqrasdsadqswrewqrfdsafadsrfdewqre3wrtaegafdsgadstgrwetyerwtregsdfghfsdgeqrwtqrtstuvwxyzabcdefghiabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzjklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzjklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzjklmnopqrstuvwxyz",
        })
    ).rejects.toThrowError();
});
test("statusMessageSchema : 테스트 통과", async () => {
    await expect(
        schema.statusMessageSchema.validateAsync({
            statusMessage: clearData.StatusMessage,
        })
    );
    await expect(
        schema.statusMessageSchema.validateAsync({
            statusMessage: "",
        })
    );
});


//userModifySchema 테스트
test("userModifySchema : nickname이 1글자 미만일 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: "",
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
});
test("userModifySchema : nickname에 특수문자가 들어간 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: "qq!@",
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();

    await expect(
        schema.userModifySchema.validateAsync({
            nickname: "&*",
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
});
test("userModifySchema : password, newpassword, confirm에 한글이 들어간 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: "테스트",
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();

    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: clearData.SchemaPassword,
            newpassword: "테스트",
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: "테스트",
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
});
test("userModifySchema : password, newpassword, confirm이 6글자 미만일 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: "a",
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: "",
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: clearData.SchemaPassword,
            newpassword: "abcd!",
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: "zz",
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
});
test("userModifySchema : password, newpassword, confirm이 20글자가 넘을 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: "abcdefghijskvlksdjfvkladfjblafdebjl",
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: clearData.SchemaPassword,
            newpassword: "abcd!",
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: "zz",
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
});
test("userModifySchema : password가 비어있을 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: "",
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
});
test("userModifySchema : password가 null이거나 undefined일 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: null,
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: undefined,
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
});
test("userModifySchema : profileImg가 숫자일 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: 12,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();
});
test("userModifySchema : likeItem이 숫자일 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: 1,
        })
    ).rejects.toThrowError();
});
test("userModifySchema : likeItem이 문자일 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: clearData.SchemaNickname,
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: "test",
        })
    ).rejects.toThrowError();
});
test("userModifySchema : 테스트 성공", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: "홍길동",
            password: "123456@@9",
            newpassword: "sldk13!!",
            confirm: "sldk13!!",
            profileImg:
                "https://cdn.hellodd.com/news/photo/202005/71835_craw1.jpg",
            likeItem: ["test", "길동", "통과 기원"],
        })
    );
});


//userIdpostIdSchema 테스트
test("userIdpostIdSchema : userId가 number 형식이 아닐 경우 실패", async () => {
    await expect(
        schema.userIdSchema.validateAsync({
            userId: "hello",
            postId: 1
        })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({
            userId: "a",
            postId: 1
        })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({
            userId: [],
            postId: 1
        })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({
            userId: {},
            postId: 1
        })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({
            userId: true,
            postId: 1
        })
    ).rejects.toThrowError();
});
test("userIdpostIdSchema : userId가 1보다 작을 경우 실패", async () => {
    await expect(
        schema.userIdSchema.validateAsync({
            userId: 0,
            postId: 1
        })
    ).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({
            userId: -1,
            postId: 1
        })
    ).rejects.toThrowError();
});
test("userIdpostIdSchema : userId가 비었거나 없을 경우 실패", async () => {
    await expect(schema.userIdSchema.validateAsync({})).rejects.toThrowError();
    await expect(
        schema.userIdSchema.validateAsync({
            userId: null,
            postId: 1
        })
    ).rejects.toThrowError();
});
test("userIdpostIdSchema : postId가 1 미만일 경우", async () => {
    await expect(
        schema.userIdpostIdSchema.validateAsync({
            userId: 1,
            postId: 0,
        })
    ).rejects.toThrowError();
});
test("userIdpostIdSchema : postId가 int가 아닐 경우", async () => {
    await expect(
        schema.userIdpostIdSchema.validateAsync({
            userId: 1,
            postId: "string",
        })
    ).rejects.toThrowError();
    await expect(
        schema.userIdpostIdSchema.validateAsync({
            userId: 1,
            postId: [],
        })
    ).rejects.toThrowError();
    await expect(
        schema.userIdpostIdSchema.validateAsync({
            userId: 1,
            postId: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.userIdpostIdSchema.validateAsync({
            userId: 1,
            postId: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.userIdpostIdSchema.validateAsync({
            userId: 1,
            postId: undefined,
        })
    ).rejects.toThrowError();
});
test("userIdpostIdSchema : postId가 1 미만일 경우", async () => {
    await expect(
        schema.userIdpostIdSchema.validateAsync({
            userId: 1,
            postId: 0,
        })
    ).rejects.toThrowError();
});
test("userIdpostIdSchema : 테스트 성공", async () => {
    await expect(schema.userIdSchema.validateAsync({
        userId: 1,
        postId: 1
    }));
});


//inviteIdSchema 테스트
test("inviteIdSchema : inviteId가 number 형식이 아닐 경우 실패", async () => {
    await expect(
        schema.inviteIdSchema.validateAsync({ inviteId: "hello" })
    ).rejects.toThrowError();
    await expect(
        schema.inviteIdSchema.validateAsync({ inviteId: "a" })
    ).rejects.toThrowError();
    await expect(
        schema.inviteIdSchema.validateAsync({ inviteId: [] })
    ).rejects.toThrowError();
    await expect(
        schema.inviteIdSchema.validateAsync({ inviteId: {} })
    ).rejects.toThrowError();
    await expect(
        schema.inviteIdSchema.validateAsync({ inviteId: true })
    ).rejects.toThrowError();
});
test("inviteIdSchema : inviteId가 1보다 작을 경우 실패", async () => {
    await expect(
        schema.inviteIdSchema.validateAsync({ inviteId: 0 })
    ).rejects.toThrowError();
    await expect(
        schema.inviteIdSchema.validateAsync({ inviteId: -1 })
    ).rejects.toThrowError();
});
test("inviteIdSchema : inviteId가 비었거나 없을 경우 실패", async () => {
    await expect(schema.inviteIdSchema.validateAsync({})).rejects.toThrowError();
    await expect(
        schema.inviteIdSchema.validateAsync({ inviteId: null })
    ).rejects.toThrowError();
});
test("inviteIdSchema : inviteId가 성공", async () => {
    await expect(schema.inviteIdSchema.validateAsync({ inviteId: 1 })); // 성공
});


//socketDistanceSchema 테스트
test("socketDistanceSchema : 거리가 100m미만 일 경우 실패", async () => {
    await expect(
        schema.socketDistanceSchema.validateAsync({ distance: 99, })
    ).rejects.toThrowError();
});
test("socketDistanceSchema : 테스트 통과", async () => {
    await expect(
        schema.socketDistanceSchema.validateAsync({ distance: 100, })
    )
});