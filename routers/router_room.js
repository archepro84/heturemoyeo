const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/auth-middleware");
const MessageFuntion = require("./message-funtion");
const {Users, Invites, Messages, Channels, Posts, sequelize, Sequelize} = require("../models");
const {postIdSchema, startLimitSchema, chatSchema, userIdpostIdSchema, inviteIdSchema} = require("./joi_Schema")


router.route('/info')
    .get(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {postId} = await postIdSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            );

            const findChannel = await Channels.findOne({where: {postId, userId}})

            if (!findChannel) {
                res.status(412).send(
                    {errorMessage: "해당 방에 참여 하고 있지않습니다."}
                )
                return;
            }

            const findUsersList = await Channels.findAll({
                distinct: true,
                attributes: ['userId', 'confirm'],
                where: {postId},
            })

            let userIdList = [];
            let confirmList = {};

            for (const x of findUsersList) {
                const userId = x['dataValues'].userId;
                userIdList.push(userId);
                confirmList[userId] = x['dataValues'].confirm;
            }


            await Users.findAll({
                attributes: ['userId', 'nickname', 'profileImg'],
                where: {
                    userId: {[Sequelize.Op.in]: userIdList}
                }
            })
                .then((findUsers) => {
                    let result = [];

                    for (const x of findUsers) {
                        result.push({
                            userId: x['dataValues'].userId,
                            nickname: x['dataValues'].nickname,
                            profileImg: x['dataValues'].profileImg,
                            confirm: confirmList[x['dataValues'].userId] ? true : false,
                        })
                    }
                    res.status(200).send(result)
                })

        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "대화방의 정보를 불러올 수 없습니다.",
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

            const query = `
            SELECT confirmCount, currentMember, maxMember, 
                CASE WHEN 1 = (SELECT DISTINCT 1 FROM Channels WHERE postId = ${postId} AND userId = ${userId}) THEN 'Y' ELSE 'N' END AS 'isExist'
            FROM POSTS_VW
            WHERE postId = ${postId}`

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

            const {confirmCount, currentMember, maxMember} = findData;
            if (confirmCount >= currentMember) {
                res.status(406).send({
                    errorMessage: "이미 확정된 모임입니다."
                })
                return;
            } else if (currentMember >= maxMember) {
                res.status(406).send({
                    errorMessage: "모임의 입장가능 인원이 초과되어 입장이 불가능합니다."
                })
                return;
            }


            // 현재 1명 / 최대 2명 // 1명이 더들어오면 최대인원이 꽉참

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
                SELECT userId, title, postImg, confirmCount, currentMember, maxMember, startDate, endDate, place, lat, lng, 
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Channels WHERE postId = ${postId} AND userId = ${userId}) THEN 'Y' ELSE 'N' END AS 'isExist'
                FROM POSTS_VW
                WHERE postId = ${postId}`
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
            if (userId == findData['userId']) {
                res.status(403).send({
                    errorMessage: "방장은 모임에서 나갈 수 없습니다."
                })
                return;
            }
            const {
                title,
                postImg,
                confirmCount,
                currentMember,
                maxMember,
                startDate,
                endDate,
                place,
                lat,
                lng,
                isExist
            } = findData;

            if (confirmCount >= currentMember) {
                res.status(406).send({
                    errorMessage: "이미 확정된 모임입니다."
                })
                return;
            }
            if (isExist == 'N') {
                res.status(406).send({
                    errorMessage: "해당하는 모임에 참여하고 있지 않습니다."
                })
                return;
            }


            await Channels.destroy({where: {postId, userId}})

            //현재 5 맥스 5명,
            if ((currentMember >= maxMember) && (lat && lng)) {
                console.log("Room Ready NewPots");
                req.app.get('io').of('/room').emit('newRoom', {
                    postId, title, postImg, currentMember, maxMember, startDate, endDate, place
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
            const message = "헤쳐모여 알림\n그룹에 초대 되었습니다. 앱에서 확인해 보세요.";

            if (giveUserId == userId) {
                res.status(412).send({errorMessage: "동일한 사용자에게 초대를 보낼 수 없습니다."})
                return;
            }

            const user = await Users.findOne({where: {userId}})

            if (user == null) {
                res.status(412).send({errorMessage: "유저 정보를 찾을 수 없습니다."})
                return;
            }

            const phone = user.phone

            // isInvite : 내가 이미 그사람에게 초대문자를 보냈는지
            // isExist : 대상자가 이미 참여중인지
            // isMaster : 내가 그 방의 방장인지
            const query = `
                SELECT 
                    (SELECT COUNT(confirm) FROM Channels WHERE postId = p.postId AND confirm = 1) AS confirmCount,
                    COUNT(c.userId) AS currentMember, p.maxMember, 
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
            } else if (findData.confirmCount >= findData.currentMember) {
                res.status(406).send({
                    errorMessage: "확정된 모임은 초대할 수 없습니다."
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
            } else if (isExits == 'Y') {
                res.status(406).send({
                    errorMessage: "이미 대화방에 참여 중 입니다."
                })
                return;
            }

            await Invites.create({giveUserId, receiveUserId: userId, postId});

            //문자 메시지 발송
            MessageFuntion.send_message(phone, message);

            res.status(201).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임 초대에 실패 하였습니다.",
            });
        }
    })

router.route('/kick')
    .post(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {userId: targetUserId, postId} = await userIdpostIdSchema.validateAsync(req.body);

            if (userId == targetUserId) {
                res.status(412).send({
                    errorMessage: "자신을 추방할 수 없습니다."
                })
                return;
            }

            const query = `
                SELECT confirmCount, currentMember,
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Channels WHERE postId = ${postId} AND userId = ${targetUserId}) THEN 'Y' ELSE 'N' END AS isTargetExist
                FROM POSTS_VW
                WHERE postId = ${postId}
                    AND userId = ${userId}`

            const findData = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})

            if (!Object.keys(findData).length) {
                res.status(406).send({
                    errorMessage: "해당하는 모임의 방장이 아닙니다."
                })
                return;
            }

            const {confirmCount, currentMember, isTargetExist} = findData[0];
            if (confirmCount >= currentMember) {
                res.status(406).send({
                    errorMessage: "확정된 모임에서는 추방할 수 없습니다."
                })
                return;
            } else if (isTargetExist != 'Y') {
                res.status(406).send({
                    errorMessage: "해당하는 대상이 존재하지 않습니다."
                })
                return;
            }

            const postQuery = `
                SELECT title, postImg, currentMember, maxMember, startDate, endDate, place, lat, lng 
                FROM POSTS_VW
                WHERE postId = ${postId}`

            const postData = await sequelize.query(postQuery, {type: Sequelize.QueryTypes.SELECT})
                .then(result => result[0])

            await Channels.destroy({
                where: {postId, userId: targetUserId}
            })

            if (postData.maxMember == postData.currentMember) {
                if (postData.lat && postData.lng) {
                    req.app.get('io').of('/location').emit('newPost', {postId, lat: postData.lat, lng: postData.lng})
                }
                req.app.get("io").of("/room").emit("newRoom", {
                    postId,
                    title: postData.title,
                    postImg: postData.postImg,
                    currentMember: postData.currentMember - 1,
                    maxMember: postData.maxMember,
                    startDate: postData.startDate,
                    endDate: postData.endDate,
                    place: postData.place,
                });
            }

            const io = req.app.get('io')
            if (io.loginChatUser)
                if ((Object.keys(io.loginChatUser).indexOf(String(postId)) != -1)  // Socket 방이 생성되어있고,
                    && io.loginChatUser[postId][targetUserId]) { //해당하는 유저가 Socket에 접속해 있을경우
                    const socketId = io.loginChatUser[postId][targetUserId];
                    console.log(`room kick fetchSockets : [${socketId}]`);
                    await io.of('/chat').to(socketId).emit('kick', {})
                    await io.of('/chat').to(socketId).disconnectSockets();
                }
            res.status(200).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임 퇴장에 실패 하였습니다.",
            });
        }
    })

router.route('/confirm')
    .post(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {postId} = await postIdSchema.validateAsync(req.body);

            const findData = await Channels.findOne({where: {userId, postId}})

            if (!findData) {
                res.status(406).send({
                    errorMessage: "해당하는 모임에 참가하고 있지않습니다."
                })
                return;
            }

            const {channelId, confirm} = findData['dataValues']

            if (confirm == 1) {
                res.status(406).send({
                    errorMessage: "이미 확정버튼을 누른 상태입니다."
                })
                return;
            }

            const query = `
                SELECT
                   (SELECT COUNT(confirm) FROM Channels WHERE postId = ${postId} AND confirm = 1) AS confirmCount ,
                   (SELECT COUNT(userId) FROM Channels WHERE postId = ${postId}) AS currentMember,
                   maxMember,
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Posts WHERE userId = ${userId} AND postid = ${postId} ) THEN 'Y' ELSE 'N' END AS isMaster,
                    ST_X(location) AS lng, ST_Y(location) AS lat
                FROM Posts
                WHERE postId = ${postId}`

            const {
                confirmCount,
                currentMember,
                maxMember,
                isMaster,
                lat, lng,
            } = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    return result[0]
                })

            if (isMaster == 'Y') {
                if (currentMember == 1) {
                    res.status(406).send({
                        errorMessage: "모임에 다른 인원이 존재하지 않습니다."
                    })
                    return;
                } else if (confirmCount < currentMember - 1) {
                    res.status(406).send({
                        errorMessage: "다른 인원이 확정버튼을 누르지 않았습니다."
                    })
                    return;
                }
                if (confirmCount == currentMember - 1
                    && currentMember < maxMember) { // 마지막 확정은 방장만 누를 수 있다.
                    if (lat && lng)
                        req.app.get('io').of('/location').emit('removePost', {postId})
                    req.app.get("io").of("/room").emit("removeRoom", {postId})
                }
            }
            
            await Channels.update({confirm: 1},
                {where: {channelId, userId, postId}})

            res.status(201).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임 확정에 실패 하였습니다.",
            });
        }
    })

router.route('/invite/accept')
    .post(authmiddleware, async (req, res) => {
        try {
            const userId = res.locals.user.userId;
            const {inviteId} = await inviteIdSchema.validateAsync(req.body);

            const query = `
               SELECT p.postId, p.confirmCount, p.currentMember, p.maxMember,
                    CASE WHEN 1 = (SELECT DISTINCT 1 FROM Channels WHERE userId = 1 AND postId = i.postId) THEN 'Y' ELSE 'N' END AS isExist
                FROM POSTS_VW AS p
                JOIN Invites AS i
                ON p.postId = i.postId
                WHERE i.inviteId = ${inviteId}
                    AND i.receiveUserId = ${userId}`

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
            } else if (findData.confirmCount >= findData.currentMember) {
                await Invites.destroy({where: {inviteId}})
                res.status(406).send({
                    errorMessage: "확정된 모임에는 참여할 수 없습니다."
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

            await Invites.destroy({where: {inviteId, receiveUserId: userId}})
            res.status(201).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "모임 초대에 실패 하였습니다.",
            });
        }
    })

module.exports = router