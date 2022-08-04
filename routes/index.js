const express = require("express");
const Posts = require("./posts");//port/posts/postId
const Comments = require("./comments");//port/comments/postId
const Users = require("./users")
const Login = require("./login")




const router = express.Router();

router.use('/posts/', Posts);
router.use('/comments/', Comments);
router.use('/signup/', Users);
router.use('/login/', Login);
router.use.authMiddleware;

module.exports = router;

//아마도 /routes/index.js는 router들을 모아두는 곳
//app.js에서 모든 js파일들의 router들을 연결하는 코드를 쓰는 것보다
//indes.js에다가 위에 작성한 것처럼 정리해두고 app.js 파일에는 맨 아래 두줄의 코드로 간단하게 작성하는 것이 좋다.

/* 
이전코드
const Posts = require("./posts");
const Comments = require("./comments");

router.use('/posts/', Posts);
router.use('/comments/', Comments); 

변경코드
const routes = require('./routes');
app.use('/', routes);
*/


//https://firework-ham.tistory.com/59
