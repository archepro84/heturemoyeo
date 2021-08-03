const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/auth-middleware");
const authmiddlewareAll = require("../middleware/auth-middlewareAll")
const {Users, Posts, Tags, sequelize, Sequelize} = require("../models");
const {Op} = require('sequelize');
const Joi = require("joi");


// FIXME SQL Injection 처리 필요
const keywordSchma = Joi.object({
    keyword: Joi.string().required()
})

router.route('/user')
    .get(authmiddleware, async (req, res) => {
        try {
            const {keyword} = await keywordSchma.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

                `
                SELECT userId, profileImg, nickname, statusMessage
                FROM Users
                WHERE email=${keyword} OR nickname=${keyword}
                LIMIT 0, 1` // 밑과 동일
            await Users.findOne({
                attributes: ['userId', 'profileImg', 'nickname', 'statusMessage'],
                where: {
                    [Op.or]: [{email: keyword}, {nickname: keyword}],
                }
            })
                .then((result) => {
                    res.send({
                        userId: result['dataValues'].userId,
                        profileImg: result['dataValues'].profileImg,
                        nickname: result['dataValues'].nickname,
                        statusMessage: result['dataValues'].statusMessage,
                    })
                })
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "유저를 정상적으로 가져올 수 없습니다.",
            });
        }
    })

module.exports = router