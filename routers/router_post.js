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
                SELECT p.title, p.postImg, p.content, u.userId, u.nickname, u.profileImg, u.rating, u.statusMessage,
                    (SELECT COUNT(confirm) FROM Channels WHERE postId = p.postId AND confirm = 1) AS confirmCount, 
                    COUNT(*) AS currentMember,
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
                            tag.push(String(Item).trim())

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
                        tag,
                        isConfirm: result[0].confirmCount >= result[0].currentMember ? true : false,
                    })
                })

        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "postId??? ????????? ??????????????????.",
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
                location = {type: 'Point', coordinates: [lng, lat]}
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
                    errorMessage: "?????? ????????? ?????? ?????????????????????."
                })
                return;
            }

            if (Object.keys(tag).length) {
                for (const t of tag) {
                    tagArray.push({postId, tag: String(t).trim()});
                }
                await Tags.bulkCreate(tagArray);
            }

            // req.app.get("io") : Socket.IO?????? ????????? IO????????? ????????????
            // .of("/room") : "/room" ????????????????????? ????????????.
            // // .to(req.params.id) : req.params.id??? ???????????? ?????? ????????????.
            //.emit("newRoom", {}) : newRoom????????? ?????????????????? {} ????????? ????????????.
            req.app.get("io").of("/room").emit("newRoom", {
                postId, title, postImg, currentMember: 1, maxMember, startDate, endDate, place
            });
            req.app.get('io').of('/location').emit('newPost', {postId, lat, lng})


            res.status(201).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "????????? ????????? ??????????????????."});
        }
    })

    // TODO ????????? ???????????? ??? ??????????????? ????????? Socket??? ????????? ??????????????????.
    // ????????? ??????????????? ?????? ???????????? ????????? ?????? Socket??? ????????? ??????????????????.
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
                    errorMessage: "?????? ????????? ?????? ?????????????????????."
                })
                return;
            }

            const countQuery = `
                SELECT
                    (SELECT COUNT(confirm) FROM Channels WHERE postId = ${postId} AND confirm = 1) AS confirmCount,
                    COUNT(userId) AS currentMember,
                    (SELECT maxMember FROM Posts WHERE postId = ${postId}) AS currentMaxMember 
                FROM Channels AS c
                WHERE c.postId = ${postId}`

            const {
                confirmCount,
                currentMember,
                currentMaxMember
            } = await sequelize.query(countQuery, {type: Sequelize.QueryTypes.SELECT})
                .then((result) => {
                    return result[0]
                })

            if (confirmCount >= currentMember) {
                res.status(406).send({
                    errorMessage: "????????? ????????? ????????? ??? ????????????."
                })
                return;
            }
            if (currentMember > maxMember) {
                res.status(412).send({
                    errorMessage: "?????? ???????????? ?????? ????????? ?????? ?????? ?????? ?????? ??? ??? ????????????."
                })
                return;
            }

            if (lat && lng)
                location = {type: 'Point', coordinates: [lng, lat]}
            else
                location = null

            const updateCount = await Posts.update(
                {title, postImg, content, maxMember, startDate, endDate, place, location, bring,},
                {
                    where: {userId, postId},
                }
            )

            if (updateCount < 1) {
                res.status(412).send({
                    errorMessage: "?????? ????????? ???????????? ???????????????.",
                })
                return;
            }

            let tagArray = [];
            for (const t of tag) {
                tagArray.push({postId, tag: String(t).trim()});
            }
            await Tags.bulkCreate(tagArray);

            if (currentMaxMember > maxMember
                && currentMember == maxMember) {
                if (lat && lng)
                    req.app.get('io').of('/location').emit('removePost', {postId})
                req.app.get('io').of('/room').emit('removeRoom', {postId})
            } else if (currentMaxMember < maxMember
                && currentMember == currentMaxMember) {
                if (lat && lng)
                    req.app.get('io').of('/location').emit('newPost', {postId, lat, lng})
                req.app.get("io").of("/room").emit("newRoom", {
                    postId, title, postImg, currentMember, maxMember, startDate, endDate, place,
                });
            }

            res.status(201).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "?????? ????????? ??????????????? ??????????????????."});
        }
    })

    .delete(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user;
            const {postId} = await postIdSchema.validateAsync(req.body);

            // ?????? postId??? userId??? ?????? ????????? ????????? ?????????????
            const findData = await Channels.findOne({
                attributes: ['userId'],
                where: {
                    postId,
                    userId: {[Sequelize.Op.ne]: userId,}
                }
            })

            if (findData) {
                res.status(406).send({
                    errorMessage: "?????? ???????????? ???????????? ????????? ????????? ??? ????????????."
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
                res.status(412).send({errorMessage: "????????? ???????????? ???????????????."})
                return;
            }

            req.app.get("io").of("/room").emit("removeRoom", {postId})

            res.status(201).send();
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "?????? ????????? ?????????????????????."}
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
                ORDER BY startDate ASC, postId DESC
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
                errorMessage: "????????? ???????????? ??????????????? ????????? ??? ????????????.",
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
                SELECT postId, title, postImg, confirmCount, currentMember, maxMember, startDate, endDate, place, tagItem, 
                    CASE WHEN currentMember <=confirmCount THEN 'Y' ELSE 'N' END AS isConfirm
                FROM POSTS_VW
                WHERE postId IN (SELECT postId FROM Channels WHERE userId = ${userId})
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
                            isConfirm: search.isConfirm == 'Y' ? true : false,
                        })
                    }
                    res.status(200).send(result)
                })
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: "??? ?????? ???????????? ??????????????? ????????? ??? ????????????.",
            });
        }
    })

// TODO ?????? ?????? ????????? ?????? ????????? ????????? ???????????? (MySQL Geometry ??????)
router.route('/posts/location')
    .get(authmiddlewareAll, async (req, res) => {
        try {
            const postList = [];

            //Limit ??? ???????????? ?????? / ?????? Geometry??? ???????????? ??????
            const query = `
                SELECT postId, confirmCount, currentMember, maxMember, lat, lng
                FROM POSTS_VW
                WHERE lat IS NOT NULL
                    AND currentMember < maxMember
                    AND confirmCount < currentMember
                    AND startDate >= NOW()`
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
                errorMessage: "??? ?????? ???????????? ??????????????? ????????? ??? ????????????.",
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
                SELECT postId, title, postImg, confirmCount, currentMember, maxMember, startDate, endDate, place
                FROM POSTS_VW
                WHERE currentMember < maxMember
                    AND confirmCount < currentMember
                    AND userId = ${userId}
                ORDER BY startDate ASC, postId DESC
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
                errorMessage: "??? ?????? ???????????? ??????????????? ????????? ??? ????????????.",
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
                errorMessage: "????????? ?????? ???????????? ??????????????? ????????? ??? ????????????.",
            });
        }
    })


module.exports = router;
