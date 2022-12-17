const { Schema, model } = require("mongoose");

const commentsSchema = new Schema({
    username: { type: String, required: true },
    text: {type: String,required: true},
    post: {type: Schema.Types.ObjectId,ref:"File" },

  });
  const Comment = model("Comment", commentsSchema);
  
  module.exports = Comment;