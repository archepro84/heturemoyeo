const express = require("express");
const router = express.Router();
const {Users, sequelize, Sequelize} = require("../models")
const authmiddleware = require("../middleware/auth-middleware")

router.route('/')
    .post((req, res) => {

    })
    .get((req, res) => {
        res.send({result: "안녕하세요"})
    })

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
module.exports = router