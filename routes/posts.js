const express = require("express");
const { Post }  = require("../models");
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Like }  = require('../models');
const { User } = require("../models");
const { Op } = require("sequelize");

//게시글 조회
router.get('/', async (req, res) => {
    try{
        let posts = await Post.findAll()/* .sort({ createdAt:-1}) */; 
        let resultList = []; 
        for (const post of posts) {
            resultList.push({
                postId: post.id,
                nickname: post.nickname,
                title: post.title,
                createdAt: post.createdAt,   
                
            });
        } 
        res.status(200).json({ data : resultList});//위의 형식으로 받아온 데이터를 응답한다
    } catch (error) { //위처럼 진행하다가 에러가 발생하면 아래로 진핸한다.
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;//여기 뭔지 모르겠음....
      console.log(message);
      res.status(400).json({ message });
    }
});

//게시글 상세조회
router.get("/:postId", async (req, res) => {
  try {
    const id = req.params.postId; 

    if (!id) { //_id가 아니면 아래와 같이 응답
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const post = await Post.findOne({where:{id}});
    const likeusers = await Like.findOne({where:{id}});
    const likecount = likeusers.length || 0;

    const result = {//result는 아래의 형식으로 나오고
      postId: post.id,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };
  
    res.status(200).json({ data: result, likecount }); //받아온 result를 응답한다
  } catch (error) {//만약에 에러가 생길경우 아래와 같이 응답한다.
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      console.log(message);
      res.status(400).json({ message });
  }
});

//게시글 생성
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const user = await User.findOne({where :{userId}});
    const nickname = user.nickname
    const password = req.body["password"];
    const title = req.body["title"];
    const content = req.body["content"];

    if (!title || !content) { // TODO: Joi를 사용하지 않음
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    await Post.create({ userId, nickname, password, title, content });

    res.status(201).json({ message: "게시글을 생성하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//게시글 수정
router.put("/:postId", authMiddleware, async (req, res) => {
  try {
    const id = req.params.postId;

    const { userId } = res.locals.user;
    const user = await User.findOne({where: {userId}});
    const nickname = user.nickname
    const password = req.body["password"];
    const title = req.body["title"];
    const content = req.body["content"];

    if (!title || !content) { 
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }


    const isExist = await Post.findAll({where:{id}});
    if (!isExist) {
      res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
      return;
    }

    await Post.update({ title, content }, { where : {id :userId} });

    res.status(201).json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//게시글 삭제
router.delete("/:_postId", authMiddleware, async (req, res) => {
  try {
    const id = req.params._postId;
    const password = req.body["password"];

    if (!password) { 
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const isExist = await Post.findOne({where:{id}});

    if (!isExist || !id) {
      res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
      return;
    }

    await Post.destroy({where:{id}});
    res.status(201).json({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//좋아요 
router.post('/:postId/like', authMiddleware, async (req, res) => {
  const id = req.params.postId;
  const { userId } = res.locals.user;
  const isExistLike = await Like.findOne({where: {userId}});

  try {
    if (isExistLike !== null) { 
      await Like.destroy({where: {userId}});
      res.status(201).json({ message: '게시글에 좋아요를 취소하였습니다.' });
    } else {
      await Like.create({where : {userId, id}});
      res.status(201).json({ message: "게시글에 좋아요를 등록하였습니다." });
    }

  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    res.status(400).json({ message });
  }
})
module.exports = router;

