var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var Profile = require("./Profile");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: { type: String, unique: true },
  token: String,
  username: { type: String, unique: true },
  password: { type: String },
  bio: String,
  image: { type: String, default: null },
  profile: { type: mongoose.Types.ObjectId, ref: "Profile" },
  articles: [{ type: mongoose.Types.ObjectId, ref: "Article" }],
  comments: [{ type: mongoose.Types.ObjectId, red: "Comment" }],
});

userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    var profileData = {
      username: this.username,
      bio: this.bio,
      image: this.image,
    };

    var profile = await Profile.create(profileData);
    this.profile = profile.id;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.createToken = async function (password) {
  try {
    var profileData = await Profile.findById(this.profile);
    var payload = {
      username: profileData.username,
      bio: profileData.bio,
      image: profileData.image,
    };

    var token = await jwt.sign(payload, process.env.SECRET);

    return token;
  } catch (error) {
    return error;
  }
};

module.exports = mongoose.model("User", userSchema);