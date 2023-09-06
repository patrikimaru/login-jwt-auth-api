const UserModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.homeAuth = async ( req, res) => {
  res.send("You have logged in")
};

exports.loginAuth = async (req, res) => {
  const user = await UserModel.findOne({email: req.body.email})

  const userAllowed = await bcrypt.compare(req.body.password, user.password);

  if (userAllowed) {
    const accessToken =  jwt.sign({ userId: user._id }, 'secret-key-shhhh', {expiresIn: 604800})
    res.status(200).send({ accessToken: accessToken})
  } else {
    res.send("No user found or invalid password")
  }
};

exports.signupAuth = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new UserModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword, 
  });
  
  await newUser.save()
    .then((data) => {
      console.log("Saved Successfully...");
      res.status(201).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err, msg: "Something went wrong!" });
    });
};

exports.forgotPasswordAuth = async (req, res) => {
  const { id } = req.params;
  await UserModel.findById(id).then((data) => {
    res.send(data);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send({ error: err, msg: "Something went wrong!" });
  });;  
};

exports.resetPasswordAuth = async (req, res) => {
  const { id } = req.params;
  await UserModel.findByIdAndUpdate(id, req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err, msg: "Something went wrong!" });
    });
};
