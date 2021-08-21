const express = require("express");
const {Users, Posts} = require("../models");
const jwt = require("jsonwebtoken");
const loginCheckMiddleware = require("../middleware/login-check-middleware");
const crypto = require("crypto");
const {loginSchema, postSchema} = require("./joi_Schema")
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

router.route('/test')
    .post((req, res) => {
        const token = jwt.sign({userId: 2}, process.env.SECRET_KEY);
        res.cookie("authorization", token);
        res.status(200).send({token});
    })

router.route('/se/test')
    .get(async (req, res) => {
        try {
            let {
                title,
                postImg,
                content,
                maxMember,
                startDate,
                endDate,
                place,
                bring,
                lat,
                lng,
                tag,
            } = await postSchema.validateAsync(req.body);
            console.log(lng);

            //type 에서 'Point'를 정확하게 작성해야한다.
            const location = {type: 'Point', coordinates: [37.562110, 126.941069]};
            const postId = await Posts.create({
                userId: 1,
                title: "Hello",
                maxMember: 5,
                startDate: 100000000,
                endDate: 100000001,
                location: location,
            })
                .then((result) => {
                    // console.log(result['dataValues']);
                    return result.null;
                })

            await Posts.findOne({
                attributes: ['postId', 'userId', 'location', 'createdAt'],
                where: {postId}
            })
                .then((result) => {
                    console.log(result['dataValues']);
                    console.log(result['dataValues'].location);
                })

            res.send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send("실패")
        }
    })

module.exports = router;
