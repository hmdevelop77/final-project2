const { Schema, model } = require("mongoose");

const fileSchema = new Schema({
  title: { type: String, required: true },
  file: {
    type: String,
    required: true,
  },
  comments:[{ type: Schema.Types.ObjectId, ref:"Comment"}]
});


const File = model("File", fileSchema);
module.exports = File;

