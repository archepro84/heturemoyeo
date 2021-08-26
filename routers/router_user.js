const express = require("express");
const router = express.Router();
const {Posts, Users, Likes, sequelize, Sequelize} = require("../models")
const authmiddleware = require("../middleware/auth-middleware")
const crypto = require("crypto");
const {userIdNumberSchema, statusMessageSchema, userModifySchema} = require("./joi_Schema")


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
                res.status(412).send({errorMessage: "비밀번호가 일치하지 않습니다."})
                return;
            } else if (newpassword == '' && confirm == '') {
                // 패스워드도 변경안함
                newpassword = password;
            }

            const cryptoPass = crypto.createHash('sha512').update(password).digest('base64')
            const cryptoNewPass = crypto.createHash('sha512').update(newpassword).digest('base64')

            const updateCount = await Users.update({nickname, password: cryptoNewPass, profileImg},
                {where: {userId, password: cryptoPass}})

            if (updateCount < 1) {
                res.status(412).send({errorMessage: "변경된 데이터가 존재하지 않습니다."})
            }

            let result = [];
            for (const x of likeItem) {
                result.push({
                    userId,
                    likeItem: x
                })
            }

            await Likes.bulkCreate(result)

            res.status(201).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "정보를 찾을 수 없습니다."}
            )
        }
    })

router.route('/me')
    .post(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user
            const query = `
                SELECT u.userId, u.phone, u.name, u.nickname, u.profileImg, u.statusMessage, u.rating,
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
                    res.status(200).send({
                        userId: result[0].userId,
                        phone: result[0].phone,
                        name: result[0].name,
                        nickname: result[0].nickname,
                        profileImg: result[0].profileImg,
                        statusMessage: result[0].statusMessage,
                        rating: result[0].rating,
                        likeItem
                    })
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(401).send(
                {errorMessage: "정보를 찾을 수 없습니다."}
            )
        }
    })

router.route("/target/all")
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = await userIdNumberSchema.validateAsync(
                Object.keys(req.query).length ? req.query.userId : req.body.userId
            );
            const userInfoData = await Users.findByPk(userId)

            if (!userInfoData) {
                res.status(412).send({
                    errorMessage: "유저 정보를 찾을 수 없습니다.",
                });
                return;
            }

            const {rating, statusMessage} = userInfoData["dataValues"];

            res.status(200).send({
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
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "유저 속성값을 불러오는데 실패했습니다."
            });
        }
    });

router.route('/target/friend')
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const targetUserId = await userIdNumberSchema.validateAsync(
                Object.keys(req.query).length ? req.query.userId : req.body.userId
            );

            if (userId == targetUserId) {
                res.status(412).send({errorMessage: "동일한 아이디를 조회할 수 없습니다."})
                return;
            }

            const query = `
                SELECT u.userId, u.phone, u.name, u.nickname, u.profileImg, u.statusMessage,
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
                    res.status(200).send({
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
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "정보를 찾을 수 없습니다."}
            )
        }
    })

router.route('/target/post')
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const targetUserId = await userIdNumberSchema.validateAsync(
                Object.keys(req.query).length ? req.query.userId : req.body.userId
            );

            let userIdList = []

            if (userId == targetUserId) {
                res.status(412).send({errorMessage: "동일한 아이디를 조회할 수 없습니다."})
                return;
            }

            const isScheduleQuery = `
                SELECT DISTINCT userId
                FROM Channels
                WHERE postId IN (SELECT postId FROM Channels WHERE userId = ${userId})
                    AND userId != ${userId}`
            await sequelize.query(isScheduleQuery, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    for (const x of result) {
                        userIdList.push(x.userId)
                    }
                })

            if (userIdList.indexOf(targetUserId) == -1) {
                res.status(412).send({
                    errorMessage: "같은 모임을 참여하고 있지않습니다."
                })
                return;
            }

            const query = `
                SELECT u.nickname, u.rating, u.profileImg, u.statusMessage, 
                    (SELECT GROUP_CONCAT(likeItem ORDER BY likeItem ASC SEPARATOR ', ')
                        FROM Likes 
                        WHERE userId = u.userId
                        GROUP BY userId) AS likeItem,
                    GROUP_CONCAT(s.postId ORDER BY s.postId DESC SEPARATOR ', ') AS scheduleItem,
                    CASE WHEN 2 = (SELECT COUNT(DISTINCT giveUserId) 
                        FROM Friends 
                        WHERE (giveUserId = ${userId} AND receiveUserId = ${targetUserId}) 
                            OR (giveUserId = ${targetUserId} AND receiveUserId = ${userId})) THEN 'Y' ELSE 'N' END AS isFriend
                FROM Users AS u
                JOIN (SELECT a.postId
                   FROM (SELECT DISTINCT postId FROM Channels WHERE userId = ${userId}) AS a
                   JOIN (SELECT DISTINCT postId FROM Channels WHERE userId = ${targetUserId}) AS b
                   ON a.postId = b.postId) AS s
                WHERE userId = ${targetUserId}`

            // 검색된 데이터가 없을 경우 에러가 발생한다.
            let findData = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})

            const {nickname, rating, profileImg, statusMessage, likeItem, scheduleItem, isFriend} = findData[0]

            let likeList = [];
            let scheduleList = [];

            if (likeItem)
                for (const Item of likeItem.split(', '))
                    likeList.push(Item)

            if (scheduleItem)
                for (const Item of scheduleItem.split(', '))
                    scheduleList.push(Item)

            // 동일한 Schedule에 소속되어있기 때문에 sheduleItem이 null일 경우는 존재하지않는다.
            await Posts.findOne({
                attributes: ['title'],
                // where: {postId: scheduleList[0]} // 가장 늦게 만들어진 방
                where: {postId: scheduleList[scheduleList.length - 1]} // 가장 일찍 만들어진 방
            })
                .then((result) => {
                    const scheduleTitle = result['dataValues'].title;
                    res.status(200).send({
                        nickname,
                        rating,
                        profileImg,
                        statusMessage,
                        likeItem: likeList,
                        scheduleCount: scheduleList.length,
                        scheduleTitle,
                        isFriend: isFriend == 'Y' ? true : false,
                    })
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
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
                {where: {userId},}
            ).then((statusMsg) => {
                if (statusMsg < 1) throw Error("정보를 찾을 수 없습니다.")
                res.status(201).send();
            });
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "정보를 찾을 수 없습니다."});
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
                    res.status(200).send({friendUsers, scheduleUsers})
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "친구 및 일정 정보를 찾을 수 없습니다."});
        }
    })

module.exports = router