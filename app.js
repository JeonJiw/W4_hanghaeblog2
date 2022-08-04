const express = require('express');
const routes = require('./routes');


//굳이 PostRouter나 CommentRouter로 하지 않고 그냥 다 route안에 다 때려넣음

const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //게시글 생성 API를 만들 때 


/* const connect = require("./models");
connect(); */

app.use('/', routes); //router 사용하기위해 넣어야 할 코드

app.listen(port, () => {
    console.log(port, '포트가 열렸어요!');
});

