var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    author: { type: Object, require: true },
    body: { type: String, require: true },
    article: { type: mongoose.Types.ObjectId, ref: "Article" },
  },
  { timestamps: true }
);

commentSchema.pre("save", async function (next) {
  next();
});

module.exports = mongoose.model("Comment", commentSchema);