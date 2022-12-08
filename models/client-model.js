const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const clientSchema = new Schema(
  {
    admin: false,
    username: {
      type: String,
      trim: true,
      // required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      // required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Please provide a valid email.",
      ],
    },
    //dont forget to put passhash
    passwordHash: {
      type: String,
      //  required: true
    },
    googleId: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Client = model("Client", clientSchema);

module.exports = Client;
