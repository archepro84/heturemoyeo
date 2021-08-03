const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/auth-middleware");
const logincheckmiddleware = require("../middleware/login-check-middleware");
const {Auths, Messages, Channels, sequelize, Sequelize} = require("../models");
const Joi = require("joi");
const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");
require('dotenv').config();


function RandomCode(n) {
    let str = '';
    for (let i = 0; i < n; i++)
        str += Math.floor(Math.random() * 10)
    return str
}

const emailSchema = Joi.object({
    email: Joi.string()
        .pattern(new RegExp(
            "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$"
        ))
        .required(),
})

router.route('/password/email')
    .post(logincheckmiddleware, async (req, res) => {
        try {
            const {email} = await emailSchema.validateAsync(req.body);
            const authData = RandomCode(6);
            let transporter = nodemailer.createTransport({
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
            }, (err, info) => {
                if (err) {
                    throw Error(err);
                }
                console.log(info.envelope);
            });

            const query = `CALL SP_Auths_INSERT("${email}", "${authData}")`

            await sequelize.query(query, {type: Sequelize.QueryTypes.SELECT})

            res.send()
        } catch (error) {
            console.log(`${req.method} ${req.baseUrl} : ${error.message}`);
            res.status(400).send({errorMessage: "인증 메일을 보낼 수 없습니다."});
        }

    })

module.exports = router