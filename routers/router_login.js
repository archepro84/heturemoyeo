const express = require("express");
const {Users} = require("../models");
const jwt = require("jsonwebtoken");
const loginCheckMiddleware = require("../middleware/login-check-middleware");
const crypto = require("crypto");
const {loginSchema} = require("./joi_Schema")
const router = express.Router();

router.route("/")
    .post(loginCheckMiddleware, async (req, res) => {
        try {
            const {phone, password} = await loginSchema.validateAsync(req.body);
            const cryptoPass = crypto.createHash('sha512').update(password).digest('base64')

            const user = await Users.findOne({
                where: {phone, password: cryptoPass},
            });

            if (!user) {
                res.status(412).send({errorMessage: "핸드폰 번호 또는 패스워드가 잘못되었습니다."})
                return;
            }

            const token = jwt.sign({userId: user["dataValues"].userId}, process.env.SECRET_KEY);
            res.cookie("authorization", token);
            res.status(200).send({token});
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "로그인에 실패 하였습니다.",
            });
        }
    });

module.exports = router;
