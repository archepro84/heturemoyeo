const express = require("express");
const router = express.Router();
const logincheckmiddleware = require("../middleware/login-check-middleware");
const {Users, Auths, Messages, Channels, sequelize, Sequelize} = require("../models");
const {emailSchema, authDataSchema, newPassSchema} = require("./joi_Schema");
const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require('dotenv').config();


function RandomCode(n) {
    let str = '';
    for (let i = 0; i < n; i++)
        str += Math.floor(Math.random() * 10)
    return str
}


router.route('/password/email')
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const {email} = await emailSchema.validateAsync(req.body);
            const user = await Users.findOne({where: {email}})
            if (!user) {
                res.status(412).send({errorMessage: "등록된 이메일이 존재하지 않습니다."})
                return;
            }

            // TODO 인증메일 재 전송 시간을 어떻게 체크하지?
            const authData = RandomCode(6);

            // Nodemailer를 활용해 메일을 보낸다.
            let transporter = nodemailer.createTransport({
                // 사용자 계정을이용해 AWS SES에 접속한다.
                SES: new AWS.SES({
                    apiVersion: '2010-12-01',
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    region: process.env.AWS_REGION,
                })
            })

            transporter.sendMail({
                from: 'astra@astraios.shop',
                to: email,
                subject: '[astraios.shop] 이메일 인증번호 발송메일',
                html: `<div><p>${authData}</p></div>`
            }, (error, info) => {
                if (error) {
                    throw Error(error);
                }
                //From, To의 주체를 출력한다.
                console.log(info.envelope);
            });

            const cryptoAuthData = crypto.createHash('sha512')
                .update(authData)
                .digest('base64')

            // Sequelize에서 PROCEDURE를 사용하는 방법
            await sequelize.query('CALL SP_Auths_INSERT(:email, :authData)',
                {
                    replacements: {email, authData: cryptoAuthData}, // :email, :authData에 데이터를 넣어준다.
                    type: Sequelize.QueryTypes.PROCEDURE //현재 사용하고 있는 Query의 형식을 정의한다.
                })
            res.status(200).send()
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "인증 메일을 보낼 수 없습니다."});
        }
    })


router.route('/password/auth')
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const {email, authData} = await authDataSchema.validateAsync(req.body);
            const nowTime = new Date();
            const authDelay = 5 * 60 * (10 ** 3); // 5분

            const cryptoAuthData = crypto.createHash('sha512')
                .update(authData)
                .digest('base64')

            // 구조분해 할당을 줄이고, 변수를 바로 사용할 수 있도록 하자.
            const authsData = await Auths.findOne({
                where: {email, authData: cryptoAuthData},
            })
            if (!authsData) {
                res.status(412).send({errorMessage: "인증번호 검사에 실패 하였습니다."})
                return;
            }
            const {authId, updatedAt} = authsData['dataValues']


            if (nowTime - updatedAt > authDelay) {
                res.status(408).send({errorMessage: "메일 인증 시간을 초과 하였습니다."})
                return;
            }

            await Auths.update(
                {isAuth: 1},
                {where: {email, authData: cryptoAuthData}}
            )
            res.status(200).send({authId})
        } catch (error) {
            // 상위 컨텍스트로 에러를 전파하는게 아니라 클라이언트로 에러를 응답해야 하는 레이어이다.
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "메일 인증에 실패 하였습니다."});
        }
    })


router.route('/password/newpass')
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const {authId, email, password, confirm} = await newPassSchema.validateAsync(req.body);
            const nowTime = new Date();
            const newPassDelay = 30 * 60 * (10 ** 3); // 30분

            if (password != confirm) {
                res.status(412).send({errorMessage: "패스워드가 동일하지 않습니다."})
                return;
            }

            const query = `
            SELECT u.userId, a.authId, a.email, a.isAuth, a.updatedAt
            FROM Users AS u
            JOIN Auths AS a
            ON u.email = a.email
            WHERE a.authId = ${authId}
                AND a.email = "${email}"
                AND a.isAuth = 1`

            const newpassData = await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT,})
            if (!Object.keys(newpassData).length) {
                res.status(412).send({errorMessage: "인증 번호가 일치하지 않습니다."})
                return;
            }
            const {userId, updatedAt} = newpassData[0]

            if (nowTime - updatedAt > newPassDelay) {
                res.status(408).send({errorMessage: "메일 인증 시간을 초과 하였습니다."})
                return;
            }

            const cryptoPass = crypto.createHash('sha512').update(password).digest('base64')

            //안전하게 변경하기위해 userId를 WHERE절에 추가합니다.
            await Users.update(
                {password: cryptoPass},
                {where: {userId, email}}
            )

            await Auths.destroy({where: {authId, email}})

            res.status(201).send()
        } catch (error) {
            // 상위 컨텍스트로 에러를 전파하는게 아니라 클라이언트로 에러를 응답해야 하는 레이어이다.
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "비밀번호 변경에 실패 하였습니다."});
        }
    })

module.exports = router