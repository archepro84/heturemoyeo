const express = require("express");
const router_user = require("./router_user")
const router_post = require("./router_post")
const router_sign = require("./router_sign")
const router_search = require("./router_search")
const router_login = require("./router_login")
const router_find = require("./router_find")
const router_friend = require("./router_friend")

const router = express.Router();

router.use("/user", router_user)
router.use("/post", router_post)
router.use("/sign", router_sign)
router.use("/search", router_search)
router.use("/login", router_login)
router.use("/find", router_find)
router.use("/friend", router_friend)

module.exports = router