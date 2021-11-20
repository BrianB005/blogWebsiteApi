const express = require("express");
const router = express.Router();
const {
  authorizePermissions,
  authenticateUser,
} = require("../middlewares/authentication");
const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getSinglePost,
} = require("../controllers/postsController");
router
  .route("/")
  .post(authenticateUser, authorizePermissions("admin"), createPost)
  .get(getAllPosts);

router.route("/:id").get(getSinglePost).put(updatePost).delete(deletePost);

module.exports = router;
