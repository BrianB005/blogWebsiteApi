const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  authorizeUser,
  UserTokenPayload,
} = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  authorizeUser(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const deleteUser = async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.user.userId}`);
  }
  authorizeUser(req.user, user._id);
  res
    .status(StatusCodes.OK)
    .json({ msg: `Your Account has been deleted successfully` });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// update user with user.save()
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please fill all the fields");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = UserTokenPayload(user);
  // attachCookiesToResponse({ res, user: tokenUser });
  // res.status(StatusCodes.OK).json({ user: tokenUser });
  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token: token });
  JWT_;
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide the required values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isOldPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isOldPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(
      "Wrong password!!Kindly recheck your old password"
    );
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};


module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  
};
