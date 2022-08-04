const express = require("express");
const { Comment } = require("../models");
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { User } = require("../models");

//댓글 조회
router.get("/:postId", async (req, res) => {
    try {
      const id = req.params.postId;
  
      if (!id) { 
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        return;
      }
  
      const comments = await Comment.findOne({where:{postId: id}})
  
      let resultList = [];
  
      for (const comment of comments) {
        resultList.push({
          commentId: comment.id,
          nickname: comment.nickname,
          content: comment.content,
          createdAt: comment.createdAt,
        });
      }
  
      res.status(200).json({ data: resultList });
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      console.log(message);
      res.status(400).json({ message });
    }
  });
//댓글 생성
router.post("/:postId", authMiddleware, async (req, res) => {
    try {
      const id = req.params.postId;
  
      const { userId } = res.locals.user;
      const user = await User.findAll({where: {id:userId}});
      const nickname = user.nickname
      const password = req.body["password"];
      const content = req.body["content"];
  
      if (!content) { //content = false? 내용이 없으면?
        res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
        return;
      }
  
      if (!_id || !nickname || !password) { 
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        return;
      }
  
  
      await Comment.create({ postId, userId, nickname, password, content });
  
      res.status(201).json({ message: "댓글을 생성하였습니다." });
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      console.log(message);
      res.status(400).json({ message });
    }
  });


//댓글 수정
router.put("/:commentId", authMiddleware, async (req, res) => {
    try {
      const id = req.params.commentId;
  
      const password = req.body["password"];
      const content = req.body["content"];
  
      if (!content) {
        res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
        return;
      }
  
      if (!id || !password) { 
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        return;
      }
  
      const isExist = await Comment.findOne({where:{commentId:id}});
      if (!isExist) {
        res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
        return;
      }
  
      await Comment.update({ content }, {where : id });
  
      res.status(201).json({ message: "댓글을 수정하였습니다." });
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      console.log(message);
      res.status(400).json({ message });
    }
  });
//댓글 삭제
router.delete("/:commentId", authMiddleware, async (req, res) => {
    try {
      const id = req.params.commentId;
      const password = req.body["password"];
  
      if (!_id || !password) { // TODO: Joi를 사용하지 않음
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        return;
      }
  
      const isExist = await Comment.findOne({where:{commentId:id}});;
  
      if (!isExist || !ids) {
        res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
        return;
      }
  
      await Comment.destroy({where:{id}});
      res.status(201).json({ message: "댓글을 삭제하였습니다." });
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      console.log(message);
      res.status(400).json({ message });
    }
  });

module.exports = router;