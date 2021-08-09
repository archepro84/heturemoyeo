const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/auth-middleware");
const {Friends, sequelize, Sequelize} = require("../models");
const {startLimitSchema, userIdSchema} = require("./joi_Schema")

router.route("/")
    .get(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user;
            const {start, limit} = await startLimitSchema.validateAsync(
                Object.keys(req.query).length ? req.query : req.body
            );

            const query = `
            SELECT userId, profileImg, nickname, statusMessage
            FROM Users
	        WHERE userId IN (SELECT giveUserId FROM Friends WHERE receiveUserId= ${userId}) 
                AND userId IN (SELECT receiveUserId FROM Friends WHERE giveUserId = ${userId})
            LIMIT ${start}, ${limit}`;

            await sequelize
                .query(query, {type: Sequelize.QueryTypes.SELECT,})
                .then((result) => {
                    if (!result.length) {
                        res.status(412).send({
                            errorMessage:
                                "친구 목록을 조회하는데 실패했습니다.",
                        });
                    }
                    res.status(200).send({result});
                });
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(412).send({
                errorMessage: "입력 형식이 맞지 않습니다.",
            });
        }
    })

    .post(authmiddleware, async (req, res) => {
        try {
            const myUserId = res.locals.user.userId;
            const {userId} = await userIdSchema.validateAsync(req.body);

            if (myUserId === userId) {
                res.status(412).send({
                    errorMessage:
                        "로그인된 유저와 친구 요청을 하는 userId는 같을 수 없습니다.",
                });
                return;
            }

            // giveUserId와 receiveUserId를 검색해서 해당하는 값이 없으면 인서트문을 실행
            const query = `
                INSERT INTO Friends(giveUserId, receiveUserId) 
                select ${myUserId}, ${userId}
                WHERE NOT EXISTS 
                (SELECT giveUserId
                FROM Friends
                WHERE (giveUserId = ${myUserId} AND receiveUserId = ${userId}))
            `;

            await sequelize
                .query(query, {type: Sequelize.QueryTypes.INSERT,})
                .then((result) => {
                    if (result[0] == 0) {
                        res.status(412).send({
                            errorMessage: "이미 등록된 친구 입니다.",
                        });
                        return;
                    }
                    res.status(200).send();
                });
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(412).send({
                errorMessage: "데이터 생성에 실패했습니다.",
            });
        }
    });

router.route("/request")
    .get(authmiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user;
            const {start, limit} = await startLimitSchema.validateAsync(req.body);

            const query = `
            SELECT userId, profileImg, nickname, statusMessage
            FROM Users
	        WHERE userId IN (SELECT giveUserId FROM Friends WHERE receiveUserId= ${userId})
            LIMIT ${start}, ${limit}`;

            await sequelize
                .query(query, {type: Sequelize.QueryTypes.SELECT,})
                .then((result) => {
                    if (!result.length) {
                        res.status(412).send({
                            errorMessage: "친구 목록을 조회하는데 실패했습니다.",
                        });
                        return;
                    }
                    res.status(200).send({result});
                });
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(412).send({
                errorMessage: "입력 형식이 맞지 않습니다.",
            });
        }
    });

module.exports = router;
