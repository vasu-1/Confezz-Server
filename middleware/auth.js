const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/Users');
const secret_key = process.env['JWT_SECRET'];

const auth = async (req, res, next) => {
  try {
    const { jwttokenloginuser } = req.body;
    console.log("Auth Attempt!");
    const token = jwttokenloginuser;
    const verifytoken = jwt.verify(token, secret_key);

    var rootUser = await User.findOne({ _id: verifytoken._id, "tokens.token": token });

    if (!rootUser) {
      throw new Error("User not found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    req.author = rootUser.nickname;
    next();
  } catch (err) {
    // res.status(401).send('Unauthorized User!!')
    console.log(err);
    return res.status(401).json({ error: "Unauthorized User!!" });
  }
}

module.exports = auth