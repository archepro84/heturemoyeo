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
const searchPostSchema = Joi.object({
    keyword: Joi.string().required().allow(null),
    searchDate: Joi.date().allow(null),
    start: Joi.number().min(0).required(),
    limit: Joi.number().min(1).required(),
})

router.route('/user')
    .get(authmiddleware, async (req, res) => {
        try {
            const {keyword} = await keywordSchma.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

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
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "유저를 정상적으로 가져올 수 없습니다.",
            });
        }
    })

router.route('/post')
    .get(authmiddleware, async (req, res) => {
        try {
            const {keyword, searchDate, start, limit} = await searchPostSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )
            let query;
            let result = [];


            console.log(keyword, searchDate, start, limit);

            if (searchDate) {
                const createdAt = `${searchDate.getUTCFullYear()}-${searchDate.getUTCMonth() + 1}-${searchDate.getUTCDate()} ${searchDate.getUTCHours()}:00:00`;
                const searchDateEnd = new Date(searchDate.getTime() + (24 * 60 * 60 * 1000))
                const endAt = `${searchDateEnd.getUTCFullYear()}-${searchDateEnd.getUTCMonth() + 1}-${searchDateEnd.getUTCDate()} ${searchDateEnd.getUTCHours()}:00:00`;

                query = `
                    SELECT p.postId, p.title, p.postImg, p.content, COUNT(c.userId) AS currentMember, p.maxMember, p.startDate, p.endDate, p.place  
                    FROM Posts AS p
                    JOIN Channels AS c
                    ON p.postId = c.postId
                    WHERE (p.startDate >= '${createdAt}' 
                        AND startDate < '${endAt}')
                        AND (p.title LIKE '%${keyword ? keyword : ''}%' 
                        OR p.content LIKE '%${keyword ? keyword : ''}%'
                        OR p.postId IN (SELECT DISTINCT postId FROM Tags WHERE tag LIKE '%${keyword ? keyword : ''}%'))
                    GROUP BY c.postId
                    HAVING currentMember < maxMember
                    LIMIT ${start}, ${limit}`
            } else {
                query = `
                    SELECT p.postId, p.title, p.postImg, p.content, COUNT(c.userId) AS currentMember, p.maxMember, p.startDate, p.endDate, p.place  
                    FROM Posts AS p
                    JOIN Channels AS c
                    ON p.postId = c.postId
                    WHERE p.title LIKE '%${keyword ? keyword : ''}%' 
                        OR p.content LIKE '%${keyword ? keyword : ''}%'
                        OR p.postId IN (SELECT DISTINCT postId FROM Tags WHERE tag LIKE '%${keyword ? keyword : ''}%')
                    GROUP BY c.postId
                    HAVING currentMember < maxMember
                    LIMIT ${start}, ${limit}`
            }

            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((searchList) => {
                    for (const search of searchList) {
                        result.push({
                            postId: search.postId,
                            title: search.title,
                            postImg: search.postImg,
                            currentMember: search.currentMember,
                            maxMember: search.maxMember,
                            startDate: search.startDate,
                            endDate: search.endDate,
                            place: search.place,
                        })
                    }
                    res.send(result)
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "유저를 정상적으로 가져올 수 없습니다.",
            });
        }
    })

module.exports = router