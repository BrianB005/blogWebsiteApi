const router = require("express").Router();
const { createComment } = require("../controllers/commentController");
router.route("/").post(createComment);
module.exports = router;
