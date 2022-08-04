const express = require("express");
const { User } = require("../models");
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

router.post("/", async (req, res) => {
    const { nickname, password, confirm } = req.body;

    if(password !== confirm) {
        res.status(400).send({
            errorMessage: "패스워드가 일치하지 않습니다.",
        });
        return;
    }

    const existUsers = await User.findOne({where: {nickname: nickname}});

    if (existUsers){
        res.status(400).send({
            errorMessage: "중복된 닉네임입니다."
        });
        return;
    }

    const conditionNick = /^[a-zA-z0-9]$/;

    if(conditionNick !== true && nickname.length < 3) {
        res.status(400).send({
            errorMessage:"닉네임은 최소 3자 이상, 알파벳 대소문자, 숫자로 입력해주세요."
        });
        return;
}

    if (password.includes(nickname)){
        res.status(400).send({
            errorMessage:"패스워드는 닉네임을 포함할 수 없습니다."
        })
        return;
    }
    

    await User.create({nickname, password});

    res.status(201).send(
        {  "message": "회원 가입에 성공하였습니다."});
});


router.get('/me', authMiddleware, async (req, res) => {
    res.send({ user: res.locals, "message": "로그인이 되었습니다."});

}) 


module.exports = router;