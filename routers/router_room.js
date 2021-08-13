const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/auth-middleware");
const {Invites, Messages, Channels, Posts, sequelize, Sequelize} = require("../models");
const {postIdSchema, startLimitSchema, chatSchema, userIdpostIdSchema, inviteIdSchema} = require("./joi_Schema")


router.route('/:postId')
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {postId} = await postIdSchema.validateAsync(req.params);
            const {start, limit} = await startLimitSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

            const findChannel = await Channels.findOne({where: {postId, userId}})

            if (!findChannel) {
                res.status(412).send({errorMessage: "해당 방에 참여 하고 있지않습니다."})
                return;
            }

            const query = `
                SELECT m.messageId, m.userId, u.nickname, u.profileImg, m.message, m.updatedAt 
                FROM Messages AS m
                LEFT JOIN Users AS u
                ON m.userId = u.userId
                WHERE m.postId = ${postId}
                    AND ${userId} IN (SELECT userId 
                        FROM Channels 
                        WHERE postId = ${postId})
                    AND m.createdAt >= (SELECT createdAt FROM Channels WHERE userId = ${userId} AND postId = ${postId} LIMIT 1)
                ORDER BY m.messageId DESC
                LIMIT ${start}, ${limit}`

            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    res.status(200).send(result)
                })

        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "대화방을 불러올 수 없습니다.",
            });
        }
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

            const searchData = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})

            if (!Object.keys(searchData).length) {
                res.status(412).send({
                    errorMessage: "채널에 접속되어 있지 않습니다."
                })
                return;
            }
            const {nickname, profileImg} = searchData[0];

            const {messageId, updatedAt} = await Messages.create({userId, postId, message})
                .then((result) => {
                    return {messageId: result.null, updatedAt: result['dataValues'].updatedAt};
                })

            console.log("req.app.get room/chat POST", postId);
            req.app.get("io").of("/chat").to(postId).emit("chat", {
                messageId, userId, nickname, profileImg, message, updatedAt
            });

            res.status(201).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "채팅 전송에 실패 하였습니다.",
            });
        }
    })

router.route('/join')
    .post(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {postId} = await postIdSchema.validateAsync(req.body);

            // // JOIN을 제외하고 구현하였음. include에서 에러가 발생해서 SQL로 선회
            // const sequelizeQuery = {
            //     attributes: [
            //         [sequelize.fn('COUNT', sequelize.col('userId')), 'currentMember'],
            //         [sequelize.literal(`CASE WHEN 1 = (SELECT DISTINCT 1 FROM Channels WHERE postId=${postId} AND userId=${userId}) THEN 'Y' ELSE 'N' END`), 'isExist'],
            //     ],
            //     where: {
            //         postId,
            //     },
            // }
            // const findData = await Channels.findOne(sequelizeQuery)
            // console.log(findData);

            const query = `SELECT COUNT(c.userId) AS currentMember,
                    p.maxMember,    
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Channels WHERE postId = ${postId} AND userId = ${userId}) THEN 'Y' ELSE 'N' END AS 'isExist'
                FROM Channels AS c
                JOIN Posts AS p 
                ON c.postId = p.postId
                WHERE c.postId = ${postId}
                GROUP BY c.postId`

            const findData = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    return result[0]
                })

            if (!findData) {
                res.status(406).send({
                    errorMessage: "해당하는 모임이 존재하지 않습니다."
                })
                return;
            }
            if (findData.isExist == 'Y') {
                res.status(406).send({
                    errorMessage: "해당하는 모임에 이미 참여 중 입니다."
                })
                return;
            }

            const {currentMember, maxMember} = findData;
            if (currentMember >= maxMember) {
                res.status(406).send({
                    errorMessage: "모임의 입장가능 인원이 초과되어 입장이 불가능합니다."
                })
                return;
            }
            // 마지막으로 입장하였을 경우 모임 Room 정보 및 위치 정보를 삭제한다.
            if (currentMember == maxMember - 1) {
                console.log("Room Over DeletePosts");
                req.app.get('io').of('/room').emit('removeRoom', {postId})
                req.app.get('io').of('/location').emit('removePost', {postId})
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

            const query = `
                SELECT p.title, p.postImg, COUNT(c.userId) AS currentMember, p.maxMember,
                    p.startDate, p.endDate, p.place,
                    ST_Y(p.location) AS lat, ST_X(p.location) AS lng,
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Channels WHERE postId = ${postId} AND userId = ${userId}) THEN 'Y' ELSE 'N' END AS isExist
                FROM Posts AS p
                JOIN Channels AS c
                ON p.postId = c.postId
                WHERE p.postId = ${postId}
                GROUP BY c.postId`
            const findData = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    return result[0]
                })

            if (!findData) {
                res.status(406).send({
                    errorMessage: "해당하는 모임이 존재하지 않습니다."
                })
                return;
            }
            const {title, postImg, currentMember, maxMember, startDate, endDate, place, lat, lng, isExist} = findData;

            if (isExist == 'N') {
                res.status(406).send({
                    errorMessage: "해당하는 모임에 참여하고 있지 않습니다."
                })
                return;
            }

            await Channels.destroy({where: {postId, userId}})

            if ((currentMember >= maxMember) && (lat && lng)) {
                console.log("Room Ready NewPots");
                req.app.get('io').of('/room').emit('newRoom', {
                    postId,
                    title,
                    postImg,
                    currentMember,
                    maxMember,
                    startDate,
                    endDate,
                    place
                })
                req.app.get('io').of('/location').emit('newPost', {postId, lat, lng})
            }

            res.status(200).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임 퇴장에 실패 하였습니다.",
            });
        }
    })

router.route('/invite')
    .post(authmiddleware, async (req, res) => {
        try {
            const giveUserId = res.locals.user.userId;
            const {userId, postId} = await userIdpostIdSchema.validateAsync(req.body);

            if (giveUserId == userId) {
                res.status(412).send({errorMessage: "동일한 사용자에게 초대를 보낼 수 없습니다."})
                return;
            }

            const query = `
                SELECT COUNT(c.userId) AS currentMember, p.maxMember, 
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Invites WHERE giveUserId = ${giveUserId} AND receiveUserId = ${userId} AND postId = ${postId}) THEN 'Y' ELSE 'N' END AS isInvite,
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Channels WHERE userId = ${userId} AND postId = ${postId}) THEN 'Y' ELSE 'N' END AS isExist,
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Posts WHERE postId = ${postId} AND userId = ${giveUserId}) THEN 'Y' ELSE 'N' END AS isMaster
                FROM Posts AS p
                JOIN Channels AS c
                ON p.postId= c.postId
                WHERE p.postId = ${postId} 
                GROUP BY c.postId`

            const findData = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    return result[0];
                })

            if (!findData) {
                res.status(406).send({
                    errorMessage: "해당하는 모임이 존재하지 않습니다."
                })
                return;
            }

            if (findData.currentMember >= findData.maxMember) {
                res.status(406).send({
                    errorMessage: "모임의 인원이 초과되어 초대를 할 수 없습니다."
                })
                return;
            }

            const {isInvite, isExits, isMaster} = findData

            if (isMaster == 'N') {
                res.status(401).send({
                    errorMessage: "해당하는 모임의 방장이 아닙니다."
                })
                return;
            } else if (isInvite == 'Y') {
                res.status(406).send({
                    errorMessage: "이미 초대한 사용자 입니다."
                })
                return;
            } else if (isExits) {
                res.status(406).send({
                    errorMessage: "이미 대화방에 참여 중 입니다."
                })
                return;
            }

            await Invites.create({giveUserId, receiveUserId: userId, postId});
            res.status(201).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임 초대에 실패 하였습니다.",
            });
        }
    })

router.route('/invite/accept')
    .post(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {inviteId} = await inviteIdSchema.validateAsync(req.body);

            const query = `
               SELECT i.postId, COUNT(c.userId) AS currentMember, p.maxMember,
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Channels WHERE userId = ${userId} AND postId = i.postId) THEN 'Y' ELSE 'N' END AS isExist
                FROM Invites AS i
                JOIN Posts AS p
                ON i.postId = p.postId
                JOIN Channels AS c
                ON c.postId = p.postId
                WHERE i.inviteId = ${inviteId}
                    AND i.receiveUserId = ${userId}
                GROUP BY c.postId`

            const findData = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    return result[0];
                })

            if (!findData) { // inviteId가 없을 경우 발생
                res.status(412).send({
                    errorMessage: "해당하는 초대이벤트가 존재하지 않습니다."
                })
                return;
            }

            // 구조분해로 인한 과부화를 줄이기 위해 변수를 따로 선언하지 않음
            if (findData.currentMember >= findData.maxMember) {
                await Invites.destroy({where: {inviteId}})
                res.status(406).send({
                    errorMessage: "모임의 인원이 초과되어 입장 할 수 없습니다."
                })
                return;
            }

            if (findData.isExist == 'Y') {
                await Invites.destroy({where: {inviteId}})
                res.status(406).send({
                    errorMessage: "이미 모임에 참여 중 입니다."
                })
                return;
            }

            //모임의 인원이 가득찼을 경우 소켓으로 메시지를 보낸다.
            if (findData.currentMember == findData.maxMember - 1) {
                req.app.get("io").of('/room').emit('removeRoom', {postId: findData.postId})
                req.app.get("io").of('/location').emit('removePost', {postId: findData.postId})
            }

            await Invites.destroy({where: {inviteId}})
            await Channels.create({postId: findData.postId, userId});

            res.status(201).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임 초대에 실패 하였습니다.",
            });
        }
    })

router.route('/invite/reject')
    .post(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {inviteId} = await inviteIdSchema.validateAsync(req.body);


            const inviteQuery = {
                attributes: ['postId'],
                where: {inviteId, receiveUserId: userId}
            }
            const findData = await Invites.findOne(inviteQuery)

            if (!findData) { // userId가 다르거나 inviteId가 일치하지않을 경우
                res.status(412).send({
                    errorMessage: "해당하는 초대이벤트가 존재하지 않습니다."
                })
                return;
            }

            await Invites.destroy({where: {inviteId, receiveId: userId}})
            res.status(201).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임 초대에 실패 하였습니다.",
            });
        }
    })

module.exports = router