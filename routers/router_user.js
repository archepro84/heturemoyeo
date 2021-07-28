const express = require("express");
const router = express.Router();
const Joi = require('joi')
const {Users, sequelize, Sequelize} = require("../models")
const authmiddleware = require("../middleware/auth-middleware")

const userIdSchema = Joi.number().min(1).required();


router.route('/me')
    .post(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user

            const query = `
                SELECT u.userId, u.email, u.name, u.nickname, u.profileImg, u.statusMessage,
                (SELECT GROUP_CONCAT(likeItem ORDER BY likeItem ASC SEPARATOR ', ')
                    FROM Likes 
                    WHERE userId = u.userId
                    GROUP BY userId) AS likeItem
                FROM Users AS u
                WHERE userId = ${userId};`
            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    let likeItem = Array();
                    if (result[0].likeItem)
                        for (const Item of result[0].likeItem.split(', '))
                            likeItem.push(Item)
                    res.send({
                        userId: result[0].userId,
                        email: result[0].email,
                        name: result[0].name,
                        nickname: result[0].nickname,
                        profileImg: result[0].profileImg,
                        statusMessage: result[0].statusMessage,
                        likeItem
                    })
                })
        } catch (error) {
            res.status(401).send(
                {errorMessage: "정보를 찾을 수 없습니다."}
            )
        }
    })


router.route("/target/all")
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = await userIdSchema.validateAsync(
                Object.keys(req.query).length ? req.query.userId : req.body.userId
            );
            const {rating, statusMessage} = await Users.findByPk(userId)
                .then((user) => {
                    if (!user) {
                        res.status(412).send({
                            errorMessage: "유저 정보를 찾을 수 없습니다.",
                        });
                        return;
                    }
                    return user["dataValues"];
                });
            res.send({rating, statusMessage});
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            res.status(412).send(
                {errorMessage: "유저 속성값을 불러오는데 실패했습니다."});
        }
    });


router.route('/target/friend')
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const targetUserId = await userIdSchema.validateAsync(
                Object.keys(req.query).length ? req.query.userId : req.body.userId
            );

            if (userId == targetUserId) {
                res.status(412).send({errorMessage: "동일한 아이디를 조회할 수 없습니다."})
                return;
            }

            const query = `
                SELECT u.userId, u.email, u.name, u.nickname, u.profileImg, u.statusMessage,
                (SELECT GROUP_CONCAT(likeItem ORDER BY likeItem ASC SEPARATOR ', ')
                    FROM Likes 
                    WHERE userId = u.userId
                    GROUP BY userId) AS likeItem
                FROM Users AS u
                WHERE userId = ${targetUserId} AND 'Y' = (SELECT COALESCE(MIN('Y'), 'N')
                    FROM Friends
                    WHERE EXISTS (select a.1
                        FROM (SELECT DISTINCT 1
                            FROM  Friends
                            WHERE giveUserId  = ${targetUserId} AND receiveUserId  = ${userId}) AS a
                        JOIN (SELECT DISTINCT 1
                            FROM  Friends
                            WHERE giveUserId = ${userId} AND receiveUserId  = ${targetUserId}) AS b))`

            // 검색된 데이터가 없을 경우 에러가 발생한다.
            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    let likeItem = Array();
                    if (result[0].likeItem)
                        for (const Item of result[0].likeItem.split(', '))
                            likeItem.push(Item)
                    res.send({
                        nickname: result[0].nickname,
                        rating: result[0].rating,
                        profileImg: result[0].profileImg,
                        statusMessage: result[0].statusMessage,
                        likeItem,
                    })
                })
        } catch (error) {
            res.status(401).send(
                {errorMessage: "정보를 찾을 수 없습니다."}
            )
        }
    })


router.route('/target/post')
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const targetUserId = await userIdSchema.validateAsync(
                Object.keys(req.query).length ? req.query.userId : req.body.userId
            );
            if (userId == targetUserId) {
                res.status(412).send({errorMessage: "동일한 아이디를 조회할 수 없습니다."})
                return;
            }

            const query = `
                SELECT nickname, rating, profileImg, statusMessage, 
                (SELECT GROUP_CONCAT(likeItem ORDER BY likeItem ASC SEPARATOR ', ')
                    FROM Likes 
                    WHERE userId = u.userId
                    GROUP BY userId) AS likeItem,
                (SELECT COUNT(*)  
                    FROM (SELECT DISTINCT postId FROM Channels WHERE userId = ${userId}) AS a
                    JOIN (SELECT DISTINCT postId FROM Channels WHERE userId = ${targetUserId} ) AS b
                    ON a.postId = b.postId) AS scheduleCount,
                (SELECT title FROM Posts WHERE postId = (SELECT a.postId
                    FROM (SELECT DISTINCT postId FROM Channels WHERE userId = ${userId}) AS a
                    JOIN (SELECT DISTINCT postId FROM Channels WHERE userId = ${targetUserId}) AS b
                    ON a.postId = b.postId ORDER BY a.postId DESC LIMIT 1)) AS scheduleTitle,
                (SELECT COALESCE(MIN('Y'), 'N')
                    FROM Friends
                    WHERE EXISTS (select a.1
                        FROM (SELECT DISTINCT 1
                            FROM  Friends
                            WHERE giveUserId  = ${userId} AND receiveUserId  = ${targetUserId}) AS a
                        JOIN (SELECT DISTINCT 1
                            FROM  Friends
                            WHERE giveUserId  = ${targetUserId} AND receiveUserId  = ${userId}) AS b)) AS isFriend
                FROM Users AS u
                WHERE userId = ${targetUserId}
                    AND userId IN (SELECT DISTINCT userId
                        FROM Channels
                        WHERE postId IN (SELECT postId FROM Channels WHERE userId = ${userId})
                            AND userId != ${userId})`

            // 검색된 데이터가 없을 경우 에러가 발생한다.
            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    let likeItem = Array();
                    if (result[0].likeItem)
                        for (const Item of result[0].likeItem.split(', '))
                            likeItem.push(Item)
                    res.send({
                        nickname: result[0].nickname,
                        rating: result[0].rating,
                        profileImg: result[0].profileImg,
                        statusMessage: result[0].statusMessage,
                        likeItem,
                        scheduleCount: result[0].scheduleCount,
                        scheduleTitle: result[0].scheduleTitle,
                        isFriend: result[0].scheduleTitle == 'Y' ? true : false,
                    })
                })
        } catch (error) {
            res.status(401).send(
                {errorMessage: "정보를 찾을 수 없습니다."}
            )
        }
    })


router.route("/status")
    .put(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user;
            const {statusMessage} = await userSchema.validateAsync(req.body);

            await Users.update(
                {statusMessage},
                {
                    where: {userId},
                }
            ).then((statusMsg) => {
                if (statusMsg) {
                    res.send({});
                }
            });
        } catch (error) {
            res.status(401).send({errorMessage: "정보를 찾을 수 없습니다."});
        }
    });


module.exports = router