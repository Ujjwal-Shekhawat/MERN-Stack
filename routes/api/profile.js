const express = require('express');
const Route = express.Router();
const { check, validationResult } = require('express-validator');
const middelware = require('../../middelware/auth');
const Profiles = require('../../models/Profile');
const Users = require('../../models/User');
Route.get('/me', middelware, async (req, res) => {
  try {
    const profile = await Profiles.findOne({
      user: req.user.id,
    }).populate('user', ['name']); // There is a user feild in Profile.js

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

Route.post(
  '/',
  [
    middelware,
    [
      check('status', 'Status is required').not().isEmpty(),

      check('skills', 'Skill is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const {
      status,
      skills,
      website,
      bio,
      githubUserName,
      //currentPosition,
      //pastPosition,
      //lookingForJobs,
      twitter,
      instagram,
      facebook,
    } = req.body;

    const profileFeilds = {};
    profileFeilds.user = req.user.id;
    if (website) profileFeilds.website = website;
    if (bio) profileFeilds.website = bio;
    if (githubUserName) profileFeilds.website = githubUserName;
    if (status) profileFeilds.status = status;
    if (skills) {
      /*profileFeilds.skills = skills;*/ profileFeilds.skills = skills
        .split(',')
        .map((skill) => skill.trim());
    }

    profileFeilds.social = {};
    if (twitter) profileFeilds.twitter = twitter;
    if (instagram) profileFeilds.instagram = instagram;
    if (facebook) profileFeilds.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        );

        return res.json(profile);
      }

      profile = new Profile(profileFeilds);

      await profile.save();
      //res.json({ profile });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: 'Server error' });
    }

    console.log(profileFeilds.skills);
  }
);

Route.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name']);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

Route.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profiles.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'email']);
    if (!profile) {
      return res.status(400).json({ warning: 'There is no user with this id' });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectID') {
      res.status(400), jsin({ warning: 'There is no user with this id' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = Route;
