const express = require("express");
const { User } = require("../models");
const router = express.Router();
const jwt = require('jsonwebtoken');




router.post('/', async (req, res) => {
    const { nickname, password } = req.body;

    const user = await User.findOne({where:{nickname, password}});
    
    if(!user) {
        res.status(401).send({
            errorMessage: '닉네임 또는 패스워드를 확인해주세요',
        });
        return;    
    }

    const token = jwt.sign({ userId: user.userId }, "secret-key-jwjwt");
    res.send({
        token,
    });
});



module.exports = router;