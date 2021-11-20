const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);
ReviewSchema.index({ post: 1, user: 1 }, { unique: true });

CommentSchema.statics.calculateRating = async function (postId) {
  const result = await this.aggregate([
    {
      $match: { post: postId },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfComments: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Post").findOneAndUpdate(
      { _id: postId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfComments: result[0]?.numOfComments || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

CommentSchema.post("save", async function () {
  await this.constructor.calculateRating(this.post);
});
CommentSchema.post("remove", async function () {
  await this.constructor.calculateRating(this.post);
});

module.exports = mongoose.model("Comment", CommentSchema);
