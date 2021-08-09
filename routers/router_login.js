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
            const {email, password} = await loginSchema.validateAsync(req.body);
            const cryptoPass = crypto.createHash('sha512').update(password).digest('base64')

            const user = await Users.findOne({
                where: {email, password: cryptoPass},
            });

            if (!user) {
                res.status(401).send({errorMessage: "이메일 또는 패스워드가 잘못되었습니다."})
                return;
            }

            const token = jwt.sign({userId: user["dataValues"].userId}, process.env.SECRET_KEY);
            res.cookie("authorization", token);
            res.status(200).send({token});
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(401).send({
                errorMessage: "요청한 데이터가 올바르지 않습니다.",
            });
        }
    });

router.route('/test')
    .post((req, res) => {
        const token = jwt.sign({userId: 2}, process.env.SECRET_KEY);
        res.cookie("authorization", token);
        res.status(200).send({token});
    })

module.exports = router;
