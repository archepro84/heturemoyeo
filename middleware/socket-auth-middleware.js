const jwt = require("jsonwebtoken")
const Joi = require("joi")
const {Users} = require("../models")

require('dotenv').config();

const authorizationSchema = Joi.string().required()
module.exports = async (socket, next) => {
    try {
        const Authorization = await authorizationSchema.validateAsync(
            socket.handshake.headers.authorization)
        const {userId} = jwt.verify(Authorization, process.env.SECRET_KEY);
        await Users.findByPk(userId)
            .then((user) => {
                socket.user = {
                    userId: user['dataValues'].userId,
                    email: user['dataValues'].email,
                    name: user['dataValues'].name,
                    nickname: user['dataValues'].nickname,
                }
            })
        next()
    } catch (error) {
        console.error(`Socket Error ${socket.handshake.headers.referer} : ${error.message}`);
        next(new Error(error.message))
    }
}