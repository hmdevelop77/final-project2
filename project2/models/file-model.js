const { Schema, model } = require("mongoose");
const fileSchema = new Schema({
  title: { type: String, required: true },
  file: {
    type: String,
    require: true,
  },
  comments: [{ clientId:Schema.Types.ObjectId,ref:"Client", comment: String }]
});

const File = model("File", fileSchema);

module.exports = File;
