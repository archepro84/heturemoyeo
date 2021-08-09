const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/auth-middleware");
const {Messages, Channels, sequelize, Sequelize} = require("../models");
const Joi = require("joi");

const postIdSchema = Joi.object({
    postId: Joi.number().min(1).required(),
});

const startLimitSchema = Joi.object({
    start: Joi.number().min(0).required(),
    limit: Joi.number().min(1).required()
})
const chatSchema = Joi.object({
    postId: Joi.number().min(1).required(),
    message: Joi.string().max(255).required(),
})

router.route('/chat')
    .post(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {postId, message} = await chatSchema.validateAsync(req.body);

            // userId가 채널에 접속해있을 경우 nickname, profileImg를 출력한다.
            const query = `
                SELECT u.nickname, u.profileImg
                FROM Channels AS c
                JOIN Users AS u
                ON u.userId = c.userId 
                WHERE c.postId = ${postId} 
                    AND c.userId = ${userId}`
            // postId, message
            // postId , userId, nickname, profileImg, createdAd

            const {nickname, profileImg} = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    if (!Object.keys(result).length) throw Error("채널에 접속되어 있지 않습니다.")
                    return result[0]
                })

            const {messageId, updatedAt} = await Messages.create({userId, postId, message})
                .then((result) => {
                    return {messageId: result.null, updatedAt: result['dataValues'].updatedAt};
                })

            console.log("req.app.get room/chat POST", postId);

            req.app.get("io").of("/chat").to(postId).emit("chat", {
                messageId, userId, nickname, profileImg, message, updatedAt
            });

            res.send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "채팅 전송에 실패 하였습니다.",
            });
        }
    })

router.route('/:postId')
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {postId} = await postIdSchema.validateAsync(req.params);
            const {start, limit} = await startLimitSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

            // TODO 회원이 아닌 경우 축출 하도록 설정

            const query = `
                SELECT m.messageId, m.userId, u.nickname, u.profileImg, m.message, m.updatedAt 
                FROM Messages AS m
                JOIN Users AS u
                ON m.userId = u.userId
                WHERE m.postId = ${postId}
                    AND ${userId} IN (SELECT userId 
                        FROM Channels 
                        WHERE postId = ${postId})
                ORDER BY m.messageId DESC
                LIMIT ${start}, ${limit}`

            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    // if (!Object.keys(result).length)
                    //     throw Error('데이터를 가져올 수 없습니다.')
                    res.send(result)
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "데이터를 가져올 수 없습니다.",
            });
        }
    })

router.route('/join')
    .post(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {postId} = await postIdSchema.validateAsync(req.body);

            const findData = await Channels.findOne({
                attributes: ['userId'],
                where: {postId, userId}
            })
            if (findData) {
                res.status(406).send({
                    errorMessage: "모임에 참여 중이거나 해당하는 모임이 존재하지 않습니다."
                })
                return;
            }

            await Channels.create({postId, userId})

            res.status(200).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임에 입장할 수 없습니다.",
            });
        }
    })

router.route('/exit')
    .post(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {postId} = await postIdSchema.validateAsync(req.body);

            const findData = await Channels.findOne({
                attributes: ['userId'],
                where: {postId, userId}
            })

            if (!findData) {
                res.status(406).send({
                    errorMessage: "모임에 참가하고 있지 않습니다."
                })
                return;
            }

            await Channels.destroy({where: {postId, userId}})

            res.status(200).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임 퇴장에 실패 하였습니다.",
            });
        }
    })

module.exports = router