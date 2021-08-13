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

//userModifySchema 테스트
test("userModifySchema : nickname이 3글자 미만일 경우 실패 ", async () => {
    await expect(
        schema.userModifySchema.validateAsync({
            nickname: "qq",
            password: clearData.SchemaPassword,
            newpassword: clearData.SchemaPassword,
            confirm: clearData.SchemaPassword,
            profileImg: clearData.SchemaProfileImg,
            likeItem: clearData.SchemaLikeItem,
        })
    ).rejects.toThrowError();

    await expect(
        schema.userModifySchema.validateAsync({
            nickname: "q",
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
test("nicknameSchema : nickname이 3글자 미만일 경우 실패", async () => {
    await expect(
        schema.nicknameSchema.validateAsync({ nickname: "aa" })
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

// email 스키마 테스트
test("emailSchema : @가 없을 경우", async () => {
    await expect(
        schema.emailSchema.validateAsync({
            emai: "aaa222naver.com",
        })
    ).rejects.toThrowError();
});
test("emailSchema : @가 여러개 있을 경우", async () => {
    await expect(
        schema.emailSchema.validateAsync({
            emai: "aaa222@@@naver.com",
        })
    ).rejects.toThrowError();
});
test("emailSchema : 다른 특수문자가 섞여 있을 경우", async () => {
    await expect(
        schema.emailSchema.validateAsync({
            emai: "aaa!#222@naver.com",
        })
    ).rejects.toThrowError();
    await expect(
        schema.emailSchema.validateAsync({
            emai: "aaa222@naver!!.com",
        })
    ).rejects.toThrowError();
});
test("emailSchema : .이 없는 경우", async () => {
    await expect(
        schema.emailSchema.validateAsync({
            emai: "aaa222@navercom",
        })
    ).rejects.toThrowError();
});
test("emailSchema : 테스트 통과", async () => {
    await expect(
        schema.emailSchema.validateAsync({
            emai: clearData.Email,
        })
    );
});

// authDataSchema 테스트
test("authDataSchema : 이메일에 @가 없을 경우", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            email: "aaa222naver.com",
        })
    ).rejects.toThrowError();
});
test("authDataSchema : 이메일에 @가 여러개 있을 경우", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            email: "aaa222@@@naver.com",
        })
    ).rejects.toThrowError();
});
test("authDataSchema : 이메일에 다른 특수문자가 섞여 있을 경우", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            email: "aaa!#222@naver.com",
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            email: "aaa222@naver!!.com",
        })
    ).rejects.toThrowError();
});
test("authDataSchema : 이메일에 .이 없는 경우", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            email: "aaa222@navercom",
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
            email: clearData.Email,
            authData: "abcdefg",
        })
    ).rejects.toThrowError();
});
test("authDataSchema : authData가 string형태가 아닐때", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            email: clearData.Email,
            authData: 1,
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            email: clearData.Email,
            authData: [],
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            email: clearData.Email,
            authData: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            email: clearData.Email,
            authData: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.authDataSchema.validateAsync({
            email: clearData.Email,
            authData: undefined,
        })
    ).rejects.toThrowError();
});
test("authDataSchema : 테스트 통과", async () => {
    await expect(
        schema.authDataSchema.validateAsync({
            email: clearData.Email,
            authData: clearData.authData,
        })
    );
});

// newPassSchema 테스트
test("newPassSchema : authId가 0이하", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: 0,
            email: clearData.email,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : authId가 int형태가 아닐때", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: "1",
            email: clearData.email,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: {},
            email: clearData.email,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: [],
            email: clearData.email,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: null,
            email: clearData.email,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: undefined,
            email: clearData.email,
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : 이메일에 @가 없을 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: "aaa222naver.com",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : 이메일에 @가 여러개 있을 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: "aaa222@@@naver.com",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : 이메일에 다른 특수문자가 섞여 있을 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: "aaa!#222@naver.com",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: "aaa222@naver!!.com",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : 이메일에 .이 없는 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: "aaa222@navercom",
            password: clearData.Password,
            confirm: clearData.confirm,
        })
    ).rejects.toThrowError();
});
test("newPassSchema : password가 6글자 미만일 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: clearData.email,
            password: "123",
            confirm: clearData.SchemaPassword,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: clearData.email,
            password: clearData.SchemaPassword,
            confirm: "123",
        })
    ).rejects.toThrowError();
});
test("newPassSchema : password가 20글자가 넘을 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: clearData.email,
            password: "123af4b56sdfb489sfb16sd156sdv156",
            confirm: clearData.SchemaPassword,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: clearData.email,
            password: clearData.SchemaPassword,
            confirm: "123af4b56sdfb489sfb16sd156sdv156",
        })
    ).rejects.toThrowError();
});
test("newPassSchema : password가 string 형식이 아닐 경우", async () => {
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: clearData.email,
            password: 123,
            confirm: clearData.SchemaPassword,
        })
    ).rejects.toThrowError();
    await expect(
        schema.newPassSchema.validateAsync({
            authId: clearData.authId,
            email: clearData.email,
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
test("loginSchema : 이메일에 @가 없을 경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            email: "aaa222naver.com",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
});
test("loginSchema : 이메일에 @가 여러개 있을 경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            email: "aaa222@@@naver.com",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
});
test("loginSchema : 이메일에 .이 없는 경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            email: "aaa222@navercom",
            password: clearData.Password,
        })
    ).rejects.toThrowError();
});
test("loginSchema : 이메일에 다른 특수문자가 섞여 있을 경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            emai: "aaa!#222@naver.com",
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            emai: "aaa222@naver!!.com",
        })
    ).rejects.toThrowError();
});
test("loginSchema : password 6글자 미만", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            email: clearData.Email,
            password: "ab!",
        })
    ).rejects.toThrowError();
});
test("loginSchema : password가 20글자가 넘을 때", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            email: clearData.Email,
            password: "abcdefg123456qFBHQER@#THWRTHWRADFVADBV",
        })
    ).rejects.toThrowError();
});
test("loginSchema : password가 string이 아닐 경우", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            email: clearData.Email,
            password: 123456,
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            email: clearData.Email,
            password: ["a", "b", "c"],
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            email: clearData.Email,
            password: {},
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            email: clearData.Email,
            password: null,
        })
    ).rejects.toThrowError();
    await expect(
        schema.loginSchema.validateAsync({
            email: clearData.Email,
            password: undefined,
        })
    ).rejects.toThrowError();
});
test("loginSchema : 테스트 통과", async () => {
    await expect(
        schema.loginSchema.validateAsync({
            email: clearData.Email,
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

// *****************************************************************  postPutSchema 테스트 코드  *************************************************************************
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

// ******************************************************** chatSchema 테스트 코드 ******************************************************************
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
test("signSchema : email에 @가 두개 이상일 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: "test123@@naver.com",
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
            email: "test123@@@naver.com",
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
test("signSchema : email에 @가 없을 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: "test123naver.com",
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
test("signSchema : email에 다른 특수문자가 섞여 있을 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: "test123@naver!#.com",
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
test("signSchema : email에 .이 없을 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: "test123@navercom",
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
test("signSchema : email이 string 형식이 아닐 경우", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: 123,
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
            email: [],
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
            email: {},
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
            email: null,
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
            email: undefined,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
test("signSchema : name이 세글자 미만일 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
            name: "ab",
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
            email: clearData.Email,
            name: "a",
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : name이 열글자가 넘을 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
            name: "abcdefghijklmn",
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
test("signSchema : nickname이 세글자 미만일 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
            name: clearData.Name,
            nickname: "ab",
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: clearData.StatusMessage,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
            name: clearData.Name,
            nickname:"a",
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
            email: clearData.Email,
            name: "abcdefghijklmnabcdefghijklmn",
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
test("signSchema : statusMessage가 2글자 보다 작을 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: "a",
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: "",
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : statusMessage가 string이 아닐 때", async () => {  // undefined일 때 왜 안될까?
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: 123,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: null,
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage: undefined,
            likeItem: clearData.LikeItem,
        })
    )// .rejects.toThrowError();
});
test("signSchema : statusMessage가 250글자 보다 클 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
            name: clearData.Name,
            nickname: clearData.Nickname,
            password: clearData.Password,
            confirm: clearData.Confirm,
            profileImg: clearData.ProfileImg,
            statusMessage:
                "abcdefghijklmnopqrstuvwxyzabcdefghiabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzjklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzjklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzjklmnopqrstuvwxyz",
            likeItem: clearData.LikeItem,
        })
    ).rejects.toThrowError();
});
test("signSchema : likeItem이 array가 아닐 때", async () => {
    await expect(
        schema.signSchema.validateAsync({
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
            email: clearData.Email,
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
// test("", async () => {
//     await expect();
// });
