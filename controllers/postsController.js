const Post = require("../models/Post");
const CustomError = require("../errors");

const createPost = async (req, res) => {
  req.body.author = req.user.userId;
  // console.log(req.user.userId);
  req.body.authorName = req.user.name;

  const { title, body } = req.body;
  if (!title || !body) {
    throw new CustomError.BadRequestError("Kindly provide a title and a body");
  }
  const post = await Post.create(req.body);
  res.status(200).json(post);
};

const updatePost = async (req, res) => {
  const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  });
  if (!post) {
    throw new CustomError.NotFoundError(
      `No post with id ${req.params.id} exists.`
    );
  }
};
const deletePost = async (req, res) => {
  const { id: postId } = req.params;

  const post = await Product.findOne({ _id: postId });

  if (!post) {
    throw new CustomError.NotFoundError(`No post with id : ${postId}`);
  }

  await post.remove();
  res
    .status(StatusCodes.OK)
    .json({ msg: `Success! Post with id ${postId}removed.` });
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json(posts);
};
const getSinglePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ _id: postId }).populate("comments");
  if (!post) {
    throw new CustomError.NotFoundError(`No post with id ${postId} exists.`);
  }
  res.status(200).json(post);
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getAllPosts,
};
