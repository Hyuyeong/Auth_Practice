const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const usertestSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Username cannot be blank"] },
  password: { type: String, required: [true, "Password cannot be blank"] },
});

usertestSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });
  const isVaild = await bcrypt.compare(password, foundUser.password);
  return isVaild ? foundUser : false;
};

usertestSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Usertest = mongoose.model("Usertest", usertestSchema);
module.exports = Usertest;
