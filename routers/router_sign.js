const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const MessageFuntion = require("../message-funtion");
const logincheckmiddleware = require("../middleware/login-check-middleware");
const authmiddleware = require("../middleware/auth-middleware");
const { Users, Likes, Auths, sequelize, Sequelize } = require("../models");
const crypto = require("crypto");
const {
    signSchema,
    phoneSchema,
    confirmSchema,
    signDeleteSchema,
    nicknameSchema,
    phoneSchema,
    authDataSchema,
} = require("./joi_Schema");
const { Router } = require("express");
require("dotenv").config();


// 전체적인 회원가입.
router
    .route("/")
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const {
                authId,
                phone,
                name,
                nickname,
                password,
                profileImg,
                statusMessage,
                likeItem,
            } = await signSchema.validateAsync(req.body);
            const cryptoPass = crypto
                .createHash("sha512")
                .update(password)
                .digest("base64");

            const auth = await Auths.findOne({
                where: {
                    [Op.and]: [{ authId }, { phone }],
                },
            });

            if (auth.isAuth != 1) {
                res.status(412).send({
                    errorMessage: "인증이 정상적으로 되지 않았습니다."
                });
                return;
            } 

            const userId = await Users.create({
                phone,
                name,
                nickname,
                password: cryptoPass,
                profileImg,
                statusMessage,
            }).then((user) => {
                if (!user) {
                    res.status(412).send({
                        errorMessage: "회원정보를 생성하는데 실패하였습니다.",
                    });
                    return;
                }
                return user.null; // then안의 user로 id값을 넣어줌
            });

            let result = [];
            for (const x of likeItem) {
                result.push({ userId, likeItem: x });
            }

            await Likes.bulkCreate(result);

            res.status(201).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "회원가입에 실패하였습니다.",
            });
        }
    })
    .delete(authmiddleware, async (req, res) => {
        try {
            const { phone, password } = await signDeleteSchema.validateAsync(
                req.body
            );
            const cryptoPass = crypto
                .createHash("sha512")
                .update(password)
                .digest("base64");

            const deleteCount = await Users.destroy({
                where: { phone, password: cryptoPass },
            });

            if (!deleteCount) {
                res.status(401).send({
                    errorMessage: "회원 탈퇴에 실패 하였습니다.",
                });
                return;
            }

            res.status(201).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "회원 탈퇴에 실패하였습니다.",
            });
        }
    });

// 폰번호 중복확인
router.route("/phone").post(logincheckmiddleware, async (req, res) => {
    try {
        const { phone } = await phoneSchema.validateAsync(req.body);

        const user = await Users.findOne({
            where: { phone },
        });
        if (user) {
            res.status(412).send({
                errorMessage: "동일한 번호가 존재합니다. 다시 입력해주세요.",
            });
            return;
        }
        res.status(200).send();
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send({ errorMessage: "번호 검사에 실패하였습니다." });
    }
});

// 닉네임 중복확인
router.route("/nickname").post(async (req, res) => {
    try {
        const { nickname } = await nicknameSchema.validateAsync(req.body);
        const nick = await Users.findOne({
            where: { nickname },
        });

        if (nick) {
            res.status(412).send({
                errorMessage: "동일한 닉네임이 존재합니다. 다시 입력해주세요.",
            });
            return;
        }

        res.status(200).send();
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send({ errorMessage: "닉네임 검사에 실패하였습니다." });
    }
});

//비밀번호 확인
router.route("/password").post(logincheckmiddleware, async (req, res) => {
    try {
        const { password, confirm } = await confirmSchema.validateAsync(
            req.body
        );

        if (password !== confirm) {
            res.status(412).send({
                errorMessage: "비밀번호가 일치하지 않습니다.",
            });
            return;
        }

        res.status(200).send();
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send({
            errorMessage: "비밀번호 검사에 일치하지 않았습니다.",
        });
    }
});

//핸드폰 인증문자 발송
router.route("/phone").post(logincheckmiddleware, async (req, res) => {
    try {
        const { phone } = await phoneSchema.validateAsync(req.body);
        const user = await Users.findOne({ where: { phone } });

        if (user == null) {
            const authData = MessageFuntion.RandomCode(6);

            const cryptoAuthData = crypto
                .createHash("sha512")
                .update(authData)
                .digest("base64");

            await sequelize.query("CALL SP_Auths_INSERT(:phone, :authData)", {
                replacements: { phone, authData: cryptoAuthData }, // :phone, :authData에 데이터를 넣어준다.
                type: Sequelize.QueryTypes.PROCEDURE, //현재 사용하고 있는 Query의 형식을 정의한다.
            });

            const message = "헤쳐모여 가입인증 번호: " + authData;

            MessageFuntion.send_message(phone, message);

            res.status(201).send();
        } else {
            res.status(412).send({
                errorMessage: "해당 번호는 이미 사용 중입니다.",
            });
        }
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send({
            errorMessage: "메시지 전송에 실패했습니다.",
        });
    }
});

//핸드폰 번호 인증
router.route("/phone/auth").post(logincheckmiddleware, async (req, res) => {
    try {
        const { phone, authData } = await authDataSchema.validateAsync(req.body);
        const cryptoAuthData = crypto
            .createHash("sha512")
            .update(authData)
            .digest("base64");
        const auth = await Auths.findOne({
            where: {
                [Op.and]: [{ phone }, { authData: cryptoAuthData }],
            },
        });

        if (auth == null) {
            res.status(412).send({
                errorMessage: "인증번호가 맞지 않습니다.",
            });
        } else {
            await Auths.update({ isAuth: 1 }, { where: { phone: phone } })
            .then(result => {
                if (result[0]) {
                    res.status(201).send()
                } else {
                    res.status(412).send({errorMessage: "인증 업데이트가 실패했습니다."})
                }
            });
        }
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send({
            errorMessage: "인증번호를 조회하는데 실패했습니다.",
        });
    }
});

module.exports = router;