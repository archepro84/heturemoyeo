const express = require("express");
const router = express.Router();

router.route('/')
    .post((req, res) => {

    })
    .get((req, res) => {
        res.send({result: "안녕하세요"})
    })

module.exports = router