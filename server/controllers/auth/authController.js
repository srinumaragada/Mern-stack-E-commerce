const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(404).json({
        success:false,
        message: "User already exists !! Please try with another email",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({
      success:true,
      data: {
        newUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({
        success:false,
        message: "LoggedIn fail, There is no login with this email",
      });
    }
    // Await the comparison to get the correct result
    const comparePassword = await bcrypt.compare(password, checkUser.password);
    if (!comparePassword) {
      return res.status(404).json({
        success:false,
        message: "Password doesn't match. Please try with another password",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
        userName: checkUser.userName,
      },
      "CLIENT_SECRETKEY",
      {
        expiresIn: "60m",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
      })
      .json({
        success: true,
        message: "Logged In Successfully",
        user: {
          id: checkUser._id,
          email: checkUser.email,
          role: checkUser.role,
          userName:checkUser.userName
        },
      });
  } catch (error) {
    res.status(404).json({
      success:false,
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged Out Successfully",
  });
};
const AuthMiddleWare = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      messahe: "UnAuthorized user!",
    });
  try {
    const decoded = jwt.verify(token, "CLIENT_SECRETKEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(404).json({
      success:false,
      message: error.message,
    });
  }
};
module.exports = { registerUser, loginUser, logoutUser, AuthMiddleWare };
