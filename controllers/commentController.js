const Comment = require("../models/Comment");
const CustomError = require("../errors");

const createComment = async (req, res) => {
  req.body.user = req.user.userId;
  const postId = req.body.post;
  req.body.post = postId;
  const { title, rating } = req.body;
  if (!title) {
    throw new CustomError.BadRequestError("Kindly provide a title and a body");
  }
  const post = await Comment.create({ title, rating });
  res.status(200).json(post);
};

const getCommentsForAPost = async (req, res) => {
  const posts = await Comment.find({});
  res.status(200).json(posts);
};

module.exports = {
  createComment,
  getCommentsForAPost,
};
