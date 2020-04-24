const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middelware/auth');
const Post = require('../../models/User');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.post(
  '/',
  [[auth], [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }

    const user = await User.findById(req.user.id).select('-password');

    try {
      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: 'user.name',
      });

      await newPost.save();
      res.json(newPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
