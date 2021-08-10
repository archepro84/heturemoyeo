const Joi = require("joi")
const joiSchema = {
    Joi,
    userIdSchema: Joi.object({
        userId: Joi.number().min(1).required(),
    }),
    userIdNumberSchema: Joi.number().min(1).required(),
    postIdSchema: Joi.object({
        postId: Joi.number().min(1).required(),
    }),
    startLimitSchema: Joi.object({
        start: Joi.number().min(0).required(),
        limit: Joi.number().min(1).required()
    }),
    emailSchema: Joi.object({
        email: Joi.string()
            .pattern(new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$"))
            .required(),
    }),
    authDataSchema: Joi.object({
        email: Joi.string()
            .pattern(new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$"))
            .required(),
        authData: Joi.string().min(6).max(6).required(),
    }),
    newPassSchema: Joi.object({
        authId: Joi.number().min(1).required(),
        email: Joi.string()
            .pattern(new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$"))
            .required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .required(),
        confirm: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .required(),
    }),
    loginSchema: Joi.object({
        email: Joi.string()
            .pattern(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i)
            .required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .required(),
    }),
    postSchema: Joi.object({
        title: Joi.string().min(1).max(100).required(),
        postImg: Joi.string().allow(null, '').required(),
        content: Joi.string().max(1000),
        maxMember: Joi.number().max(255).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        place: Joi.string(),
        lat: Joi.number().min(-90).max(90).allow(null),
        lng: Joi.number().min(-180).max(180).allow(null),
        bring: Joi.string(),
        tag: Joi.array().required(),
    }),
    postPutSchema: Joi.object({
        postId: Joi.number().min(1).required(),
        title: Joi.string().min(1).max(100).allow(null, "").required(),
        postImg: Joi.string().allow(null, '').required(),
        content: Joi.string().max(1000),
        maxMember: Joi.number().max(255).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        place: Joi.string(),
        lat: Joi.number().min(-90).max(90).allow(null),
        lng: Joi.number().min(-180).max(180).allow(null),
        bring: Joi.string(),
        tag: Joi.array().required(),
    }),
    chatSchema: Joi.object({
        postId: Joi.number().min(1).required(),
        message: Joi.string().max(255).required(),
    }),
    // FIXME SQL Injection 처리 필요
    keywordSchema: Joi.object({
        keyword: Joi.string().required()
    }),
    searchPostSchema: Joi.object({
        keyword: Joi.string().required().allow(null),
        searchDate: Joi.date().allow(null),
        start: Joi.number().min(0).required(),
        limit: Joi.number().min(1).required(),
    }),
    signSchema: Joi.object({
        email: Joi.string()
            .pattern(new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$"))
            .required(),
        name: Joi.string()
            .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{3,10}$"))
            .required(),
        nickname: Joi.string()
            .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{3,20}$"))
            .required(),
        password: Joi.string()
            .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$"))
            .required(),
        confirm: Joi.string()
            .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$")),
        profileImg: Joi.string().max(5000).allow(null, ""),
        statusMessage: Joi.string().min(2).max(250),
        likeItem: Joi.array().required(),
    }),
    nicknameSchema: Joi.object({
        nickname: Joi.string()
            .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{3,20}$"))
            .required()
    }),
    confirmSchema: Joi.object({
        password: Joi.string()
            .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$"))
            .required(),
        confirm: Joi.string()
            .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$"))
            .required(),
    }),
    signDeleteSchema: Joi.object({
        email: Joi.string()
            .pattern(new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$"))
            .required(),
        password: Joi.string()
            .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$"))
            .required(),
    }),
    statusMessageSchema: Joi.object({
        statusMessage: Joi.string().allow(null, '').required()
    }),
    userModifySchema : Joi.object({
        nickname: Joi.string()
            .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{3,20}$"))
            .required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .required(),
        newpassword: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .allow(null, '')
            .required(),
        confirm: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            // .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$"))
            .allow(null, '')
            .required(),

        profileImg: Joi.string().max(5000).allow(null, ''),

        likeItem: Joi.array().required(),
    }),
}

module.exports = joiSchema