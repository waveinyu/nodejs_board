// 서버 오픈
const express = require("express");
const connect = require("./schemas/index");
const app = express();
const port = 3000;

connect();

const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

const reqMiddleware = (req, res, next) => {
  console.log("[미들웨어]Request URL:", req.originalUrl, "", new Date());
  next();
};

app.use(express.json()); // res.body 내용을 json 형식으로 읽어주는 함수

app.use(reqMiddleware);

app.use("/api", [postsRouter, commentsRouter]);

app.get("/", (req, res) => {
  res.send("어서와~");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌어요@.@");
});
