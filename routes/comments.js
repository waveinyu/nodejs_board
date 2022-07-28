const { application, json } = require("express");
const express = require("express");
const { rawListeners } = require("../schemas/comment");
const Comments = require("../schemas/comment");
const router = express.Router(); // Router 객체 생성

router.get("/", (req, res) => {
  res.send("api 메인 페이지입니다");
});

// 댓글 생성 API
// 게시글 _id가 일치하고
// 그때 req.body의 비밀번호와 일치하면 작성 가능하게
router.post("/comments/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { user, password, content } = req.body;
  const createAt = new Date().toLocaleString;

  console.log(req.body.content);
  if (!req.body.content.length)
    return res.json({ success: false, message: "댓글 내용을 입력해주세요" });

  await Comments.create({ user, password, content });
  res.json({ success: true, message: "댓글을 생성했습니다." });
  // await Comments.create({ password, title, content });
  // res.json({ success: true, message: "댓글을 생성하였습니다." });
  // await Comments.create({ password, title, content });
  // return res.json({ message: "댓글을 생성하였습니다." });
});

// 댓글 목록 조회 API
router.get("/comments/:_postId", async (req, res) => {
  const data = await Comments.find({});

  res.json({ data });
});
// 댓글 수정 API
router.put("/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params; //코멘트의 아이디
  const { password, content } = req.body;
  const originPassword = await Comments.find({ password });
  console.log(originPassword[0].password);

  if (password === String(originPassword[0].password)) {
    await Comments.findOneAndUpdate({ _commentId }, { password, content });
    return res.json({ message: "댓글을 수정했습니다." });
  }
});
// 댓글 삭제 API
router.delete("/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body;
  const originPassword = await Comments.find({ password });

  if (password === String(originPassword[0].password)) {
    await Comments.deleteOne({ _commentId });
    return res.json({ message: "게시글을 삭제했습니다." });
  }
});

module.exports = router;
