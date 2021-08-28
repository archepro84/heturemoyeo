const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/auth-middleware");
const {Users, sequelize, Sequelize} = require("../models");
const {Op} = require('sequelize');
const {keywordSchema, searchPostSchema} = require("./joi_Schema")


router.route('/user')
    .get(authmiddleware, async (req, res) => {
        try {
            const {keyword} = await keywordSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

            await Users.findOne({
                attributes: ['userId', 'profileImg', 'nickname', 'statusMessage'],
                where: {[Op.or]: [{phone: keyword}, {nickname: keyword}],}
            })
                .then((result) => {
                    res.status(200).send({
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

            if (searchDate) {
                const createdAt = `${searchDate.getUTCFullYear()}-${searchDate.getUTCMonth() + 1}-${searchDate.getUTCDate()} ${searchDate.getUTCHours()}:00:00`;
                const searchDateEnd = new Date(searchDate.getTime() + (24 * 60 * 60 * 1000))
                const endAt = `${searchDateEnd.getUTCFullYear()}-${searchDateEnd.getUTCMonth() + 1}-${searchDateEnd.getUTCDate()} ${searchDateEnd.getUTCHours()}:00:00`;

                query = `
                    SELECT postId, title, postImg, currentMember, maxMember, startDate, endDate, place, tagItem
                    FROM POSTS_VW
                    WHERE (confirmCount < currentMember
                            AND currentMember < maxMember
                            AND startDate >= NOW())
                        AND (startDate >= ${createdAt} 
                            AND startDate < ${endAt})
                        AND (title LIKE '%${keyword ? keyword : ''}%'
                            OR tagItem LIKE '%${keyword ? keyword : ''}%')
                    ORDER BY startDate ASC , postId DESC
                    LIMIT ${start}, ${limit}`
            } else {
                query = `
                    SELECT postId, title, postImg, currentMember, maxMember, startDate, endDate, place, tagItem
                    FROM POSTS_VW
                    WHERE (confirmCount < currentMember
                            AND currentMember < maxMember
                            AND startDate >= NOW())
                        AND (title LIKE '%${keyword ? keyword : ''}%'
                            OR tagItem LIKE '%${keyword ? keyword : ''}%')
                    ORDER BY startDate ASC , postId DESC
                    LIMIT ${start}, ${limit}`
            }

            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((searchList) => {
                    for (const search of searchList) {
                        let tagItem = []
                        if (search.tagItem)
                            for (const Item of search.tagItem.split(', '))
                                tagItem.push(String(Item).trim())
                        result.push({
                            postId: search.postId,
                            title: search.title,
                            postImg: search.postImg,
                            currentMember: search.currentMember,
                            maxMember: search.maxMember,
                            startDate: search.startDate,
                            endDate: search.endDate,
                            place: search.place,
                            tag: tagItem,
                        })
                    }
                    res.status(200).send(result)
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "대화방을 정상적으로 가져올 수 없습니다.",
            });
        }
    })

router.route('/room')
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {keyword, start, limit} = await searchPostSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

            let result = [];

            const query = `
                SELECT postId, title, postImg, confirmCount, currentMember, maxMember, startDate, endDate, place, tagItem, 
                    CASE WHEN currentMember <=confirmCount THEN 'Y' ELSE 'N' END AS isConfirm
                FROM POSTS_VW
                WHERE postId IN (SELECT postId FROM Channels WHERE userId = ${userId})
                    AND (title LIKE '%${keyword}%'
                    OR tagItem LIKE '%${keyword}%')
                ORDER BY startDate ASC , postId DESC
                LIMIT ${start}, ${limit}`
            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((searchList) => {
                    for (const search of searchList) {
                        let tagItem = []
                        if (search.tagItem)
                            for (const Item of search.tagItem.split(', '))
                                tagItem.push(String(Item).trim())
                        result.push({
                            postId: search.postId,
                            title: search.title,
                            postImg: search.postImg,
                            currentMember: search.currentMember,
                            maxMember: search.maxMember,
                            startDate: search.startDate,
                            endDate: search.endDate,
                            place: search.place,
                            tag: tagItem,
                        })
                    }
                    res.status(200).send(result)
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "대화방을 정상적으로 가져올 수 없습니다.",
            });
        }

    })

module.exports = router