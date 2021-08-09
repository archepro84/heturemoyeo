const express = require("express");
const router = express.Router();
const logincheckmiddleware = require("../middleware/login-check-middleware");
const authmiddleware = require("../middleware/auth-middleware");
const {Users, Likes} = require("../models");
const crypto = require("crypto");
const {signSchema, emailSchema, confirmSchema, signDeleteSchema, nicknameSchema} = require("./joi_Schema")


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
                    res.status(412).send({
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
            const {email, password,} = await signDeleteSchema.validateAsync(req.body);
            const cryptoPass = crypto.createHash('sha512').update(password).digest('base64')

            const deleteCount = await Users.destroy({where: {email, password: cryptoPass}})

            if (!deleteCount) {
                res.status(401).send({
                    errorMessage: "회원 탈퇴에 실패 하였습니다.",
                });
                return;
            }

            res.status(200).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(401).send({
                errorMessage: "회원 탈퇴에 실패하였습니다.",
            });
        }
    });

// 이메일 중복확인
router.route("/email")
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const {email} = await emailSchema.validateAsync(req.body)

            const user = await Users.findOne({
                where: {email}
            });
            if (user) {
                res.status(412).send({
                    errorMessage: "동일한 이메일이 존재합니다. 다시 입력해주세요.",
                });
                return;
            }
            res.status(200).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "이메일 검사에 실패하였습니다."});
        }
    });

// 닉네임 중복확인
router.route("/nickname")
    .post(async (req, res) => {
        try {
            const {nickname} = await nicknameSchema.validateAsync(req.body)
            const nick = await Users.findOne({
                where: {nickname},
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
            res.status(400).send({errorMessage: "닉네임 검사에 실패하였습니다."});
        }
    });

//비밀번호 확인
router.route("/password")
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const {password, confirm} = await confirmSchema.validateAsync(req.body);

            if (password !== confirm) {
                res.status(412).send({
                    errorMessage: "비밀번호가 일치하지 않습니다.",
                });
                return;
            }

            res.status(200).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "비밀번호 검사에 일치하지 않았습니다."});
        }
    });

module.exports = router