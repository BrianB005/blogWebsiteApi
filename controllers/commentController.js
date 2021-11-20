const Post = require("../models/Post");
const CustomError = require("../errors");

const createComment = async (req, res) => {
  req.body.user = req.user.userId;
  const postId = req.body.post;
  req.body.post = postId;
  const { title, rating } = req.body;
  if (!title) {
    throw new CustomError.BadRequestError("Kindly provide a title and a body");
  }
  const post = await Post.create({ title, rating });
  res.status(200).json(post);
};

const getCommentsForAPost = async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json(posts);
};

module.exports = {
  createComment,
  getCommentsForAPost,
};
