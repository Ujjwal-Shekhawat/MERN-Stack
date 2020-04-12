const express = require('express');
const Router = express.Router();
const auth = require('../../middelware/auth');

const User = require('../../models/User');

Router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // This line is the place where error occurs
    //res.status(200).json({ msg: req.user.id });
    res.status(200).json({ msg: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = Router;
