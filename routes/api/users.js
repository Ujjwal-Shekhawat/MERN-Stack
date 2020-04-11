const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator'); // express-validator second argument in route.post request in
const bcrypt = require('bcryptjs');

const User = require('../../models/Users'); // Get the Users models form models folder path

//@Router POST api
route.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password (min. 6 characters)').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Handling auth
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ errors: [{ msg: 'User already exsists' }] });
        }

        user = new User({
            name,
            email,
            password
        });

        const encrypt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, encrypt);

        await user.save(); // Saves the user porfile

        res.send('User regestered');
    } catch(err) {
        res.status(500).send('Server error');
        console.error(err.messgae);
    }

  }
);
module.exports = route;
