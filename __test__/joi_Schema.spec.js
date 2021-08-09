const schema = require("../routers/joi_Schema")
const clearData = require("./clearData")


test("userIdSchema : userId가 number 형식이 아닐 경우 실패", async () => {
    await expect(schema.userIdSchema.validateAsync({userId: "hello"})).rejects.toThrowError();
    await expect(schema.userIdSchema.validateAsync({userId: 'a'})).rejects.toThrowError();
    await expect(schema.userIdSchema.validateAsync({userId: []})).rejects.toThrowError();
    await expect(schema.userIdSchema.validateAsync({userId: {}})).rejects.toThrowError();
    await expect(schema.userIdSchema.validateAsync({userId: true})).rejects.toThrowError();
});
test("userIdSchema : userId가 1보다 작을 경우 실패", async () => {
    await expect(schema.userIdSchema.validateAsync({userId: 0})).rejects.toThrowError();
    await expect(schema.userIdSchema.validateAsync({userId: -1})).rejects.toThrowError();
});
test("userIdSchema : userId가 비었거나 없을 경우 실패", async () => {
    await expect(schema.userIdSchema.validateAsync({})).rejects.toThrowError();
    await expect(schema.userIdSchema.validateAsync({userId: null})).rejects.toThrowError();
});
test("userIdSchema : userId가 성공", async () => {
    await expect(schema.userIdSchema.validateAsync({userId: 1})) // 성공
});


test("userModifySchema : nickname이 3글자 미만일 경우 실패 ", async () => {
    await expect(schema.userModifySchema.validateAsync({
        nickname: "qq",
        password: clearData.SchemaPassword,
        newpassword: clearData.SchemaPassword,
        confirm: clearData.SchemaPassword,
        profileImg: clearData.SchemaProfileImg,
        likeItem: clearData.SchemaLikeItem,
    }))
        .rejects.toThrowError()

    await expect(schema.userModifySchema.validateAsync({
        nickname: "q",
        password: clearData.SchemaPassword,
        newpassword: clearData.SchemaPassword,
        confirm: clearData.SchemaPassword,
        profileImg: clearData.SchemaProfileImg,
        likeItem: clearData.SchemaLikeItem,
    }))
        .rejects.toThrowError()
});





