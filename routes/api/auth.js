const express = require('express');
const Router = express.Router();
const auth = require('../../middelware/auth');

const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

const User = require('../../models/User');

//Getting the user
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

// User login authentacation
Router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password (min. 6 characters)').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Handling auth
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isUser = await bcrypt.compare(password, user.password);
      if (!isUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        id: user.id,
      };

      jwt.sign(
        payload,
        config.get('jwtSeceret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send('Server error');
      console.error(err.messgae);
    }
  }
);

module.exports = Router;
