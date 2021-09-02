const Joi = require("joi");
const joiSchema = {
    Joi,
    //완료
    userIdSchema: Joi.object({
        //완료
        userId: Joi.number().min(1).required(),
    }),
    //완료
    userIdNumberSchema: Joi.number().min(1).required(),
    //완료
    postIdSchema: Joi.object({
        postId: Joi.number().min(1).required(),
    }),
    //완료
    startLimitSchema: Joi.object({
        start: Joi.number().min(0).required(),
        limit: Joi.number().min(1).required(),
    }),
    //완료
    phoneSchema: Joi.object({
        phone: Joi.string()
            .pattern(/^01(?:0|1|[6-9])([0-9]{3}|[0-9]{4})([0-9]{4})$/)
            .required(),
    }),
    //완료
    authDataSchema: Joi.object({
        phone: Joi.string()
            .pattern(/^01(?:0|1|[6-9])([0-9]{3}|[0-9]{4})([0-9]{4})$/)
            .required(),
        authData: Joi.string()
            .min(6)
            .max(6)
            .replace(/[\'\"\`]/g, "")
            .required(),
    }),
    //완료
    newPassSchema: Joi.object({
        authId: Joi.number().min(1).required(),
        phone: Joi.string()
            .pattern(/^01(?:0|1|[6-9])([0-9]{3}|[0-9]{4})([0-9]{4})$/)
            .required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .required(),
        confirm: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .required(),
    }),
    //완료
    loginSchema: Joi.object({
        // 완료
        phone: Joi.string()
            .pattern(/^01(?:0|1|[6-9])([0-9]{3}|[0-9]{4})([0-9]{4})$/)
            .required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .replace(/[\'\"\`]/g, "")
            .required(),
    }),
    //완료
    postSchema: Joi.object({
        // 완료
        title: Joi.string().max(100).allow(null, "").required(),
        postImg: Joi.string().allow(null, "").required(),
        content: Joi.string().max(1000),
        maxMember: Joi.number().min(2).max(255).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        place: Joi.string(),
        lat: Joi.number().min(-90).max(90).allow(null),
        lng: Joi.number().min(-180).max(180).allow(null),
        bring: Joi.string(),
        tag: Joi.array().required(),
    }),
    //완료
    postPutSchema: Joi.object({
        // 완료
        postId: Joi.number().min(1).required(),
        title: Joi.string().min(1).max(100).allow(null, "").required(),
        postImg: Joi.string().allow(null, "").required(),
        content: Joi.string().max(1000),
        maxMember: Joi.number().min(2).max(255).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        place: Joi.string(),
        lat: Joi.number().min(-90).max(90).allow(null),
        lng: Joi.number().min(-180).max(180).allow(null),
        bring: Joi.string(),
        tag: Joi.array().required(),
    }),
    //완료
    chatSchema: Joi.object({
        postId: Joi.number().min(1).required(),
        message: Joi.string().max(255).required(),
    }),
    //완료
    keywordSchema: Joi.object({
        // 완료
        keyword: Joi.string()
            .required()
            .replace(/[\'\"\`]/g, ""),
    }),
    //완료
    searchPostSchema: Joi.object({
        keyword: Joi.string()
            .required()
            .allow(null)
            .replace(/[\'\"\`]/g, ""),
        searchDate: Joi.date().allow(null),
        start: Joi.number().min(0).required(),
        limit: Joi.number().min(1).required(),
    }),
    //완료
    signSchema: Joi.object({
        // authId: Joi.number().min(1).required(),
        phone: Joi.string()
            .pattern(/^01(?:0|1|[6-9])([0-9]{3}|[0-9]{4})([0-9]{4})$/)
            .required(),
        name: Joi.string()
            .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{2,30}$"))
            .required(),
        nickname: Joi.string()
            .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{1,20}$"))
            .required(),
        password: Joi.string()
            .pattern(
                new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$")
            )
            .required(),
        confirm: Joi.string().pattern(
            new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$")
        ),
        profileImg: Joi.string().max(5000).allow(null, ""),
        statusMessage: Joi.string().allow(null, "").max(255).required(),
        likeItem: Joi.array().required(),
    }),
    //완료
    nicknameSchema: Joi.object({
        nickname: Joi.string()
            .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{1,20}$"))
            .required(),
    }),
    //완료
    confirmSchema: Joi.object({
        password: Joi.string()
            .pattern(
                new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$")
            )
            .required(),
        confirm: Joi.string()
            .pattern(
                new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$")
            )
            .required(),
    }),
    //완료
    signDeleteSchema: Joi.object({
        phone: Joi.string()
            .pattern(/^01(?:0|1|[6-9])([0-9]{3}|[0-9]{4})([0-9]{4})$/)
            .required(),
        password: Joi.string()
            .pattern(
                new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$")
            )
            .replace(/[\'\"\`]/g, "")
            .required(),
    }),
    //완료
    statusMessageSchema: Joi.object({
        statusMessage: Joi.string().allow(null, "").max(255).required(),
    }),
    //완료
    userModifySchema: Joi.object({
        nickname: Joi.string()
            .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{1,30}$"))
            .required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .replace(/[\'\"\`]/g, "")
            .required(),
        newpassword: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            .allow(null, "")
            .required(),
        confirm: Joi.string()
            .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
            // .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$"))
            .allow(null, "")
            .required(),

        profileImg: Joi.string().max(5000).allow(null, ""),

        likeItem: Joi.array().required(),
    }),
    //완료
    userIdpostIdSchema: Joi.object({
        userId: Joi.number().min(1).required(),
        postId: Joi.number().min(1).required(),
    }),
    //완료
    inviteIdSchema: Joi.object({
        inviteId: Joi.number().min(1).required(),
    }),
    //완료
    socketDistanceSchema: Joi.object({
        distance: Joi.number().min(100).required(),
    })

};

module.exports = joiSchema;
