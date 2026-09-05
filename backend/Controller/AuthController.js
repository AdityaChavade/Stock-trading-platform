const { User } = require("../models");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../Utils/index");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user.id);
    console.log(token);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,      
    });
    return res.status(201).json({
  message: "User signed in successfully",   
  success: true,
  token,
  user
});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }

}
  module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ where: { email } });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
    console.log(req.body);
     const token = createSecretToken(user.id);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: false,
     });
     return res.status(201).json({
  message: "User logged in successfully",
  success: true,
  token
});
  } catch (error) {
    console.error(error);
  }
};

module.exports.Logout = async (req, res, next) => {
  console.log(req.body);
  res.clearCookie("token", {
    withCredentials: true,
    httpOnly: false,
  });
  return res.status(200).json({ message: "Logout successful", success: true });
};