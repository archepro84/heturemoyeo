const jwt = require("jsonwebtoken")
const Joi = require("joi")
const {Users} = require("../models")

require('dotenv').config();

const authorizationSchema = Joi.string().required()
module.exports = async (req, res, next) => {
    try {
        const Authorization = await authorizationSchema.validateAsync(
            req.headers.authorization ? req.headers.authorization : req.cookies.authorization)
        const {userId} = jwt.verify(Authorization, process.env.SECRET_KEY);
        await Users.findByPk(userId)
            .then((user) => {
                res.locals.user = user['dataValues']
            })
        next()
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(401).send(
            {errorMessage: "사용자 인증에 실패하였습니다."}
        )
    }
}