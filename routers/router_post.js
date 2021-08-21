const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/auth-middleware");
const authmiddlewareAll = require("../middleware/auth-middlewareAll")
const {Channels, Invites, Posts, Tags, sequelize, Sequelize} = require("../models");
const {postIdSchema, postSchema, postPutSchema, startLimitSchema} = require("./joi_Schema")
const startDateLimit = 8 * 24 * 60 * 60 * 1000;
const endDateLimit = 14 * 24 * 60 * 60 * 1000;

router.route("/")
    .get(authmiddleware, async (req, res) => {
        try {
            const {postId} = await postIdSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            );

            const query = `
                SELECT p.title, p.postImg, p.content, u.userId, u.nickname, u.profileImg, u.rating, u.statusMessage, COUNT(*) AS currentMember,
                p.maxMember, p.startDate, p.endDate, p.place, ST_Y(p.location) AS lat, ST_X(p.location) AS lng, p.bring,
                (SELECT GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ', ')
                    FROM Tags
                    WHERE postId = p.postId
                    GROUP BY postId) AS tag
                FROM Posts AS p 
                JOIN Users AS u
                ON p.userId = u.userId
                JOIN Channels AS c
                ON p.postId = c.postId 
                WHERE p.postId = ${postId}
                GROUP BY c.postId`

            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    let tag = [];
                    if (result[0].tag)
                        for (const Item of result[0].tag.split(', '))
                            tag.push(Item)

                    res.status(200).send({
                        title: result[0].title,
                        postImg: result[0].postImg,
                        content: result[0].content,
                        userId: result[0].userId,
                        nickname: result[0].nickname,
                        profileImg: result[0].profileImg,
                        rating: result[0].rating,
                        statusMessage: result[0].statusMessage,
                        currentMember: result[0].currentMember,
                        maxMember: result[0].maxMember,
                        startDate: result[0].startDate,
                        endDate: result[0].endDate,
                        place: result[0].place,
                        lat: result[0].lat,
                        lng: result[0].lng,
                        bring: result[0].bring,
                        tag
                    })
                })

        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "postId의 형식이 잘못됐습니다.",
            });
        }
    })

    .post(authmiddleware, async (req, res) => {
        try {
            let location;
            let tagArray = [];
            const now = new Date();
            const {userId} = res.locals.user;
            let {
                title,
                postImg,
                content,
                maxMember,
                startDate,
                endDate,
                place,
                lat,
                lng,
                bring,
                tag,
            } = await postSchema.validateAsync(req.body);

            if (lat && lng)
                location = {type: 'Point', coordinates: [lat, lng]}
            else
                location = null

            const postId = await Posts.create({
                userId,
                title,
                postImg,
                content,
                maxMember,
                startDate,
                endDate,
                place,
                location,
                bring,
            }).then((post) => {
                return post.null;
            });

            if (startDate > endDate
                || startDate < now.getTime()
                || startDate >= now.getTime() + startDateLimit
                || endDate >= now.getTime() + endDateLimit) {
                res.status(412).send({
                    errorMessage: "모임 시간이 잘못 설정되었습니다."
                })
                return;
            }

            if (Object.keys(tag).length) {
                for (const t of tag) {
                    tagArray.push({postId, tag: t});
                }
                await Tags.bulkCreate(tagArray);
            }

            // req.app.get("io") : Socket.IO에서 전달한 IO객체를 불러온다
            // .of("/room") : "/room" 네임스페이스에 접속한다.
            // // .to(req.params.id) : req.params.id에 해당하는 방에 접속한다.
            //.emit("newRoom", {}) : newRoom이라는 이벤트명으로 {} 객체를 전달한다.
            req.app.get("io").of("/room").emit("newRoom", {
                postId, title, postImg, currentMember: 1, maxMember, startDate, endDate, place
            });

            res.status(201).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "게시글 작성에 실패했습니다."});
        }
    })

    // TODO 모임이 가득찼을 때 최대인원을 늘리면 Socket에 모임을 뿌려줘야한다.
    // 반대로 최대인원을 현재 인원으로 변경할 경우 Socket에 모임을 제거해야한다.
    .put(authmiddleware, async (req, res) => {
        try {
            let location;
            const now = new Date();
            const {userId} = res.locals.user;
            let {
                postId,
                title,
                postImg,
                content,
                maxMember,
                startDate,
                endDate,
                place,
                lat,
                lng,
                bring,
                tag,
            } = await postPutSchema.validateAsync(req.body);

            if (startDate > endDate
                || startDate < now.getTime()
                || startDate >= now.getTime() + startDateLimit
                || endDate >= now.getTime() + endDateLimit) {
                res.status(412).send({
                    errorMessage: "모임 시간이 잘못 설정되었습니다."
                })
                return;
            }

            const countQuery = `
                SELECT
                    (SELECT COUNT(confirm) FROM Channels WHERE postId = ${postId} AND confirm = 1) AS confirmCount,
                    COUNT(userId) AS currentMember
                FROM Channels AS c
                WHERE c.postId = ${postId}`

            const {confirmCount, currentMember} = await sequelize.query(countQuery, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    return result[0]
                })

            if (confirmCount >= currentMember) {
                res.status(406).send({
                    errorMessage: "확정된 모임은 수정할 수 없습니다."
                })
                return;
            }
            if (currentMember > maxMember) {
                res.status(412).send({
                    errorMessage: "현재 참여중인 인원 수보다 적은 인원 수로 변경 할 수 없습니다."
                })
                return;
            }

            if (lat && lng)
                location = {type: 'Point', coordinates: [lat, lng]}
            else
                location = null

            const updateCount = await Posts.update(
                {
                    title,
                    postImg,
                    content,
                    maxMember,
                    startDate,
                    endDate,
                    place,
                    location,
                    bring,
                },
                {
                    where: {userId, postId},
                }
            )

            if (updateCount < 1) {
                res.status(412).send({
                    errorMessage: "모임 정보가 변경되지 않았습니다.",
                })
                return;
            }

            let tagArray = [];
            for (const t of tag) {
                tagArray.push({postId, tag: t});
            }
            await Tags.bulkCreate(tagArray);

            res.status(201).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "모임 정보를 수정하는데 실패했습니다."});
        }
    })

    .delete(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user;
            const {postId} = await postIdSchema.validateAsync(req.body);

            // 만약 postId랑 userId가 다를 경우는 어떻게 처리하지?
            const findData = await Channels.findOne({
                attributes: ['userId'],
                where: {
                    postId,
                    userId: {[Sequelize.Op.ne]: userId,}
                }
            })

            if (findData) {
                res.status(406).send({
                    errorMessage: "다른 사용자가 참여중인 모임은 삭제할 수 없습니다."
                })
                return;
            }

            const deleteCount = await Posts.destroy({
                where: {
                    postId,
                    userId,
                },
            })
            if (deleteCount < 1) {
                res.status(412).send({errorMessage: "모임이 삭제되지 않았습니다."})
                return;
            }

            req.app.get("io").of("/room").emit("removeRoom", {postId})

            res.status(201).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "모임 삭제가 실패하였습니다."}
            );
        }
    });

router.route('/posts')
    .get(authmiddlewareAll, async (req, res) => {
        try {
            let result = []
            const {start, limit} = await startLimitSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

            const query = `
                SELECT postId, title, postImg, currentMember, maxMember, startDate, endDate, place, tagItem
                FROM POSTS_VW
                WHERE confirmCount < currentMember
                    AND currentMember < maxMember
                    AND startDate >= NOW()
                ORDER BY startDate
                LIMIT ${start}, ${limit}`

            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((searchList) => {
                    for (const search of searchList) {
                        let tagItem = []
                        if (search.tagItem)
                            for (const Item of search.tagItem.split(', '))
                                tagItem.push(Item)
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
                errorMessage: "게시글 리스트를 정상적으로 가져올 수 없습니다.",
            });
        }
    })

router.route('/posts/my')
    .get(authmiddleware, async (req, res) => {
        try {
            let result = []
            const {userId} = res.locals.user
            const {start, limit} = await startLimitSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

            const query = `
                SELECT p.postId, p.title, p.postImg, COUNT(*) AS currentMember, p.maxMember, p.startDate, p.endDate, p.place,
                    (SELECT GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ', ') FROM Tags WHERE postId = p.postId GROUP BY postId) AS tagItem
                FROM Posts AS p
                JOIN Channels AS c
                ON c.postId = p.postId
                WHERE c.userId = ${userId}
                GROUP BY c.postId
                LIMIT ${start}, ${limit}`
            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((searchList) => {
                    for (const search of searchList) {
                        let tagItem = []
                        if (search.tagItem)
                            for (const Item of search.tagItem.split(', '))
                                tagItem.push(Item)
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
                errorMessage: "내 모임 리스트를 정상적으로 가져올 수 없습니다.",
            });
        }
    })

// TODO 위치 반경 이내에 있는 모임만 보이게 설정하자 (MySQL Geometry 함수)
router.route('/posts/location')
    .get(authmiddlewareAll, async (req, res) => {
        try {
            const postList = [];

            //Limit 을 사용하지 않음 / 이후 Geometry가 추가되기 때문
            const query = `
                SELECT p.postId, 
                    COUNT(c.userId) AS currentMember,
                    p.maxMember, ST_Y(p.location) AS lat, ST_X(p.location) AS lng  
                FROM Posts AS p
                JOIN Channels AS c
                ON p.postId = c.postId
                WHERE p.location IS NOT NULL 
                GROUP BY c.postId
                HAVING currentMember < maxMember`
            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    for (const x of result) {
                        postList.push({
                            postId: x.postId,
                            lat: x.lat,
                            lng: x.lng,
                        })
                    }
                    res.status(200).send(postList)
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "내 모임 리스트를 정상적으로 가져올 수 없습니다.",
            });
        }
    })

router.route('/posts/master')
    .get(authmiddleware, async (req, res) => {
        try {
            const result = [];
            const userId = res.locals.user.userId;
            const {start, limit} = await startLimitSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

            const query = `
                SELECT p.postId, p.title, p.postImg, COUNT(c.userId) AS currentMember, p.maxMember, p.startDate, p.endDate, p.place
                FROM Posts AS p
                JOIN Channels AS c
                ON p.postId = c.postId
                WHERE p.userId = ${userId}
                GROUP BY c.postId
                HAVING currentMember < maxMember
                LIMIT ${start}, ${limit}`
            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((masterList) => {
                    for (const x of masterList) {
                        result.push({
                            postId: x.postId,
                            title: x.title,
                            postImg: x.postImg,
                            currentMember: x.currentMember,
                            maxMember: x.maxMember,
                            startDate: x.startDate,
                            endDate: x.endDate,
                            place: x.place,
                        })
                    }
                    res.status(200).send(result)
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl}
        : ${error.message}
            `);
            res.status(400).send({
                errorMessage: "내 모임 리스트를 정상적으로 가져올 수 없습니다.",
            });
        }
    })

router.route('/posts/invite')
    .get(authmiddleware, async (req, res) => {
        try {
            const result = [];
            const userId = res.locals.user.userId;
            const {start, limit} = await startLimitSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            )

            const query = `
                SELECT i.InviteId, i.giveUserId AS userId, u.nickname, u.profileImg, i.postId, p.title, p.postImg, 
                    (SELECT COUNT(userId) FROM Channels WHERE postId = p.postId) AS currentMember,
                    p.maxMember, p.startDate, p.endDate, p.place
                FROM Invites AS i
                JOIN Posts AS p
                ON i.postId = p.postId
                JOIN Users AS u
                ON i.giveUserId = u.userId
                WHERE i.receiveUserId = ${userId}
                ORDER BY i.postId
                LIMIT ${start}, ${limit}`
            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})
                .then((inviteList) => {
                    for (const x of inviteList) {
                        result.push({
                            InviteId: x.InviteId,
                            userId: x.userId,
                            nickname: x.nickname,
                            profileImg: x.profileImg,
                            postId: x.postId,
                            title: x.title,
                            postImg: x.postImg,
                            currentMember: x.currentMember,
                            maxMember: x.maxMember,
                            startDate: x.startDate,
                            endDate: x.endDate,
                            place: x.place,
                        })
                    }
                    res.status(200).send(result)
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "초대된 모임 리스트를 정상적으로 가져올 수 없습니다.",
            });
        }
    })


module.exports = router;
