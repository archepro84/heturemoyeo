const jwt = require("jsonwebtoken")
const Joi = require("joi")
const {Channels, Users} = require("../models")

require('dotenv').config();

const authorizationSchema = Joi.string().required()
module.exports = async (socket, next) => {
    try {
        const Authorization = await authorizationSchema.validateAsync(
            socket.handshake.headers.authorization)
        const {userId} = jwt.verify(Authorization, process.env.SECRET_KEY);
        const postId = Number(socket.handshake.query.postId);
        await Users.findByPk(userId)
            .then((user) => {
                socket.user = {
                    userId: user['dataValues'].userId,
                    nickname: user['dataValues'].nickname,
                }
            })
        await Channels.findOne({
            where: {userId, postId}
        })
            .then((channel) => {
                if(!channel)
                    throw new Error("모임에 참가 중이지 않습니다.")
            })
        next()
    } catch (error) {
        console.error(`Socket Error ${socket.handshake.headers.referer} : ${error.message}`);
        // TODO 클라이언트에게 연결이 실패했다는 것을 알려주는 기능 구현
        next(new Error(error.message))
    }
}