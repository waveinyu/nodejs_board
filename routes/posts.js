const { application } = require("express");
const express = require("express");
const { rawListeners } = require("../schemas/post");
const Posts = require("../schemas/post"); // schema- post.js 모델 가져오기
const router = express.Router(); // Router 객체 생성

router.get("/", (req, res) => {
  res.send("api 메인 페이지입니다");
});

// 게시글 작성 API (+현지시간 필요)
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  const createAt = new Date().toLocaleString; // 현지 시간으로 바꾸고 싶다
  console.log(createAt);

  await Posts.create({ user, password, title, content });

  res.json({ success: true, message: "게시글을 작성했습니다." });
});

// 게시글 전체 조회 API (+내림차순 정렬 필요)
router.get("/posts", async (req, res) => {
  const data = await Posts.find({});
  console.log(data[0]);
  res.json({ data });
});

// 게시글 상세 조회 API
router.get("/posts/:_id", async (req, res) => {
  const { _id } = req.params;
  const getData = await Posts.find({ _id });

  res.json({ getData });
});

// 게시글 삭제 API
router.delete("/posts/:_id", async (req, res) => {
  const { _id } = req.params;
  const { password } = req.body;
  const originPassword = await Posts.find({ password });
  console.log(password);
  console.log(originPassword[0].password);

  // await Posts.deleteOne({ _id });
  if (password === String(originPassword[0].password)) {
    await Posts.deleteOne({ _id });
    return res.json({ message: "게시글을 삭제하였습니다." });
  }
  return res.json({ message: "비밀번호가 다릅니다." }); //처음엔 됐는데 왜 안 되지..?
});

// 게시글 수정 API
router.put("/posts/:_id", async (req, res) => {
  const { _id } = req.params;
  const { password, title, content } = req.body;
  const originPassword = await Posts.find({ password });

  if (password === String(originPassword[0].password)) {
    await Posts.findOneAndUpdate({ _id }, { title, content });
    // await Posts.updateOne({ title: title }, { content: content });
    return res.json({ message: "게시글을 수정하였습니다." });
  }
  // return res.json({ message: "비밀번호가 일치하지 않습니다" });
});

module.exports = router;
