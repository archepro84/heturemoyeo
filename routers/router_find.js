const express = require("express");
const router = express.Router();
const logincheckmiddleware = require("../middleware/login-check-middleware");
const {
    Users,
    Auths,
    Messages,
    Channels,
    sequelize,
    Sequelize,
} = require("../models");
const MessageFuntion = require("../message-funtion");
const { phoneSchema, authDataSchema, newPassSchema } = require("./joi_Schema");
const crypto = require("crypto");
require("dotenv").config();

router.route("/password/phone").post(logincheckmiddleware, async (req, res) => {
    try {
        const { phone } = await phoneSchema.validateAsync(req.body);
        const user = await Users.findOne({ where: { phone } });

        if (!user) {
            res.status(412).send({
                errorMessage: "등록된 번호가 존재하지 않습니다.",
            });
            return;
        }

        const authData = MessageFuntion.RandomCode(6);

        if (user == null) {
            res.status(412).send({
                errorMessage: "유저 정보를 찾을 수 없습니다.",
            });
            return;
        }

        const message = "헤쳐모여 인증번호: " + authData;

        //문자 메시지 발송
        MessageFuntion.send_message(phone, message);

        const cryptoAuthData = crypto
            .createHash("sha512")
            .update(authData)
            .digest("base64");

        // Sequelize에서 PROCEDURE를 사용하는 방법
        await sequelize.query("CALL SP_Auths_INSERT(:phone, :authData)", {
            replacements: { phone, authData: cryptoAuthData }, // :phone, :authData에 데이터를 넣어준다.
            type: Sequelize.QueryTypes.PROCEDURE, //현재 사용하고 있는 Query의 형식을 정의한다.
        });
        res.status(200).send();
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send({
            errorMessage: "인증 메시지를 보낼 수 없습니다.",
        });
    }
});

router.route("/password/auth").post(logincheckmiddleware, async (req, res) => {
    try {
        const { phone, authData } = await authDataSchema.validateAsync(
            req.body
        );
        const nowTime = new Date();
        const authDelay = 5 * 60 * 10 ** 3; // 5분

        const cryptoAuthData = crypto
            .createHash("sha512")
            .update(authData)
            .digest("base64");

        // 구조분해 할당을 줄이고, 변수를 바로 사용할 수 있도록 하자.
        const authsData = await Auths.findOne({
            where: { phone, authData: cryptoAuthData },
        });
        if (!authsData) {
            res.status(412).send({
                errorMessage: "인증번호 검사에 실패 하였습니다.",
            });
            return;
        }
        const { authId, updatedAt } = authsData["dataValues"];

        if (nowTime - updatedAt > authDelay) {
            res.status(408).send({
                errorMessage: "인증 시간을 초과 하였습니다.",
            });
            return;
        }

        await Auths.update(
            { isAuth: 1 },
            { where: { phone, authData: cryptoAuthData } }
        );
        res.status(200).send({ authId });
    } catch (error) {
        // 상위 컨텍스트로 에러를 전파하는게 아니라 클라이언트로 에러를 응답해야 하는 레이어이다.
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send({
            errorMessage: "메시지 인증에 실패 하였습니다.",
        });
    }
});

router
    .route("/password/newpass")
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const { authId, phone, password, confirm } =
                await newPassSchema.validateAsync(req.body);
            const nowTime = new Date();
            const newPassDelay = 30 * 60 * 10 ** 3; // 30분

            if (password != confirm) {
                res.status(412).send({
                    errorMessage: "패스워드가 동일하지 않습니다.",
                });
                return;
            }

            const query = `
            SELECT u.userId, a.authId, a.phone, a.isAuth, a.updatedAt
            FROM Users AS u
            JOIN Auths AS a
            ON u.phone = a.phone
            WHERE a.authId = ${authId}
                AND a.phone = "${phone}"
                AND a.isAuth = 1`;

            const newpassData = await sequelize.query(query, {
                type: Sequelize.QueryTypes.SELECT,
            });
            if (!Object.keys(newpassData).length) {
                res.status(412).send({
                    errorMessage: "인증 번호가 일치하지 않습니다.",
                });
                return;
            }
            const { userId, updatedAt } = newpassData[0];

            if (nowTime - updatedAt > newPassDelay) {
                res.status(408).send({
                    errorMessage: "인증 시간을 초과 하였습니다.",
                });
                return;
            }

            const cryptoPass = crypto
                .createHash("sha512")
                .update(password)
                .digest("base64");

            //안전하게 변경하기위해 userId를 WHERE절에 추가합니다.
            await Users.update(
                { password: cryptoPass },
                { where: { userId, phone } }
            );

            await Auths.destroy({ where: { authId, phone } });

            res.status(201).send();
        } catch (error) {
            // 상위 컨텍스트로 에러를 전파하는게 아니라 클라이언트로 에러를 응답해야 하는 레이어이다.
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "비밀번호 변경에 실패 하였습니다.",
            });
        }
    });

module.exports = router;
