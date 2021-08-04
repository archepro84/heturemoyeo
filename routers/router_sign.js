const express = require("express");
const router = express.Router();
const Joi = require("joi");
const logincheckmiddleware = require("../middleware/login-check-middleware");
const {Users, Likes} = require("../models");
const {Op} = require("sequelize");
const crypto = require("crypto");

// 회원가입시 해당 조건.
const signSchema = Joi.object({
    email: Joi.string()
        .pattern(
            new RegExp(
                "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$"
            )
        )
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

    confirm: Joi.string().pattern(
        new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$")
    ),

    profileImg: Joi.string().max(5000).allow(null, ""),

    statusMessage: Joi.string().min(2).max(250),

    likeItem: Joi.array().required(),
});

const emailSchema = Joi.string()
    .pattern(new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$"))
    .required()

const nicknameSchema = Joi.string()
    .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{3,20}$"))
    .required()
const confirmSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$"))
        .required(),
    confirm: Joi.string()
        .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$"))
        .required(),
})

// 전체적인 회원가입.
router.route("/")
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const {
                email,
                name,
                nickname,
                password,
                profileImg,
                statusMessage,
                likeItem,
            } = await signSchema.validateAsync(req.body);
            const cryptoPass = crypto.createHash('sha512').update(password).digest('base64')

            const userId = await Users.create({
                email,
                name,
                nickname,
                password: cryptoPass,
                profileImg,
                statusMessage,
            }).then((user) => {
                if (!user) {
                    res.status(401).send({
                        errorMessage: "회원정보를 생성하는데 실패하였습니다.",
                    });
                    return;
                }
                return user.null; // then안의 user로 id값을 넣어줌
            });

            let result = [];
            for (const x of likeItem) {
                result.push({userId, likeItem: x})
            }

            await Likes.bulkCreate(result);

            res.send();
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            res.status(401).send({
                errorMessage: "회원가입에 실패하였습니다.",
            });
        }
    });

// 이메일 중복확인
router.route("/email")
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const email = await emailSchema.validateAsync(req.body.email)

            const user = await Users.findOne({
                where: {email}
            });
            if (user) {
                res.status(401).send({
                    errorMessage: "동일한 이메일이 존재합니다. 다시 입력해주세요.",
                });
                return;
            }
            res.send();
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            res.status(401).send({errorMessage: "이메일 검사에 실패하였습니다."});
        }
    });

// 닉네임 중복확인
router.route("/nickname")
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const nickname = await nicknameSchema.validateAsync(req.body.nickname)
            const nick = await Users.findOne({
                where: {nickname},
            });

            if (nick) {
                res.status(401).send({
                    errorMessage: "동일한 닉네임이 존재합니다. 다시 입력해주세요.",
                });
                return;
            }

            res.send();
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            res.status(401).send({errorMessage: "닉네임 검사에 실패하였습니다."});
        }
    });

//비밀번호 확인
router.route("/password")
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const {password, confirm} = await confirmSchema.validateAsync(req.body);

            if (password !== confirm) {
                res.status(401).send({
                    errorMessage: "비밀번호가 일치하지 않습니다.",
                });
                return;
            }

            res.send();
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            res.status(401).send({errorMessage: "비밀번호 검사에 일치하지 않았습니다."});
        }
    });

module.exports = router