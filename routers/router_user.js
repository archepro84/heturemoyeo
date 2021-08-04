const express = require("express");
const router = express.Router();
const Joi = require('joi')
const {Users, Likes, sequelize, Sequelize} = require("../models")
const authmiddleware = require("../middleware/auth-middleware")

const userIdSchema = Joi.number().min(1).required();
const statusMessageSchema = Joi.object({
    statusMessage: Joi.string().allow(null, '').required()
});


// 회원가입시 해당 조건.
const userModifySchema = Joi.object({
    nickname: Joi.string()
        .pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{3,20}$"))
        .required(),

    password: Joi.string()
        .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
        .required(),

    newpassword: Joi.string()
        .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
        .allow(null, '')
        .required(),

    confirm: Joi.string()
        .pattern(/^(?=.*[a-zA-Z0-9])((?=.*\d)|(?=.*\W)).{6,20}$/)
        // .pattern(new RegExp("^(?=.*[a-zA-Z0-9])((?=.*\\d)|(?=.*\\W)).{6,20}$"))
        .allow(null, '')
        .required(),

    profileImg: Joi.string().max(5000).allow(null, ''),

    likeItem: Joi.array().required(),
});


router.route('/')
    .put(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user
            let {
                nickname,
                password,
                newpassword,
                confirm,
                profileImg,
                likeItem
            } = await userModifySchema.validateAsync(req.body)

            if (newpassword != confirm) {
                res.status(401).send({errorMessage: "비밀번호가 동일하지 않습니다."})
                return;
            } else if (newpassword == '' && confirm == '') {
                // 패스워드도 변경안함
                newpassword = password;
            }

            const updateCount = await Users.update({nickname, password: newpassword, profileImg},
                {where: {userId, password}})

            if (updateCount < 1) throw Error("변경된 데이터가 존재하지 않습니다.")

            let result = [];
            for (const x of likeItem) {
                result.push({
                    userId,
                    likeItem: x
                })
            }

            await Likes.bulkCreate(result)

            res.send()
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            res.status(401).send(
                {errorMessage: "정보를 찾을 수 없습니다."}
            )
        }
    })


router.route('/me')
    .post(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user
            const query = `
                SELECT u.userId, u.email, u.name, u.nickname, u.profileImg, u.statusMessage, u.rating,
                (SELECT GROUP_CONCAT(likeItem ORDER BY likeItem ASC SEPARATOR ', ')
                    FROM Likes 
                    WHERE userId = u.userId
                    GROUP BY userId) AS likeItem
                FROM Users AS u
                WHERE userId = ${userId};`
            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    let likeItem = [];
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
                        rating: result[0].rating,
                        likeItem
                    })
                })
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
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
                        throw Error("유저 정보를 찾을 수 없습니다.")
                        // res.status(412).send({
                        //   errorMessage: "유저 정보를 찾을 수 없습니다.",
                        // });
                        // return;
                    }
                    return user["dataValues"];
                });
            res.send({
                nickname: null,
                rating,
                profileImg: null,
                statusMessage,
                likeItem: [],
                scheduleCount: null,
                scheduleTitle: null,
                isFriend: null,
            });
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
                    let likeItem = [];
                    if (result[0].likeItem)
                        for (const Item of result[0].likeItem.split(', '))
                            likeItem.push(Item)
                    res.send({
                        nickname: result[0].nickname,
                        rating: result[0].rating,
                        profileImg: result[0].profileImg,
                        statusMessage: result[0].statusMessage,
                        likeItem,
                        scheduleCount: null,
                        scheduleTitle: null,
                        isFriend: null,
                    })
                })
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
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
                    let likeItem = [];
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
            const {statusMessage} = await statusMessageSchema.validateAsync(req.body);

            await Users.update(
                {statusMessage},
                {
                    where: {userId},
                }
            ).then((statusMsg) => {
                if (statusMsg < 1) throw Error("정보를 찾을 수 없습니다.")
                res.send();
            });
        } catch (error) {
            res.status(401).send({errorMessage: "정보를 찾을 수 없습니다."});
        }
    });


router.route('/myusers')
    .get(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user;

            const query = `
                SELECT 
                (SELECT GROUP_CONCAT(r.receiveUserId ORDER BY r.receiveUserId ASC SEPARATOR ', ') 
                FROM (SELECT receiveUserId
                    FROM Friends
                    WHERE giveUserId = ${userId}) AS r
                WHERE r.receiveUserId IN (SELECT giveUserId
                    FROM Friends
                    WHERE receiveUserId = ${userId})) AS friendUsers,
                    
                (SELECT GROUP_CONCAT(u.userId ORDER BY u.userId ASC SEPARATOR ', ')
                FROM (SELECT DISTINCT userId 
                    FROM Channels 
                    WHERE postId IN (SELECT postId 
                        FROM Channels 
                        WHERE userId = ${userId})
                        AND userId != ${userId}
                    ORDER BY userId ASC ) AS u)  AS scheduleUsers`

            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    let friendUsers = [];
                    let scheduleUsers = [];

                    if (result[0].friendUsers)
                        for (const Item of result[0].friendUsers.split(', '))
                            friendUsers.push(Item)
                    if (result[0].scheduleUsers)
                        for (const Item of result[0].scheduleUsers.split(', '))
                            scheduleUsers.push(Item)
                    res.send({friendUsers, scheduleUsers})
                })
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "정보를 찾을 수 없습니다."});
        }
    })

module.exports = router