const mongoose = require("mongoose");

const profileModel = mongoose.Schema(
  {
    name: { type: String},
    bio: { type: String},
    hobbies: [{ type: String}],
    majors: [{ type: String}],
    pic: [{ type: String}],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
);

const Profile = mongoose.model("Profile", profileModel);

module.exports = Profile;