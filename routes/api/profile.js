const express = require('express');
const Route = express.Router();
const request = require('request');
const config = require('config');
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

// Updating the user profile
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

// Updating the user profles elemnt experiences
Route.put(
  '/experiences',
  [
    middelware,
    [check('currentPosition', 'Current poition is required').not().isEmpty()],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ msg: 'Current position is required' });
    }

    const exp = ({ currentPosition, pastPosition, lookingForJobs } = req.body);

    const newExp = {
      currentPosition,
      pastPosition,
      lookingForJobs,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experiences.unshift(newExp);
      await profile.save();
      res.json({ profile });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

Route.delete('/experiences/:experiences_id', middelware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeindex = profile.experiences
      .map((item) => item.id)
      .indexOf(req.params.experiences_id);
    profile.experiences.splice(removeindex, 1);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Getting all the user profiles (NOTE : No verification needed)
Route.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name']);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Getting the profile of the user by the user id (NOTE : No verification needed)
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

// Deletes the user along with its profile from database
Route.delete('/', middelware, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await Users.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Accessing github profiles here
Route.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri:
        'https://api.github.com/users/${ShreyaDhir}/repos?per_page=5&sort=created:asc&client_id=f629522f026577ab9d09&client_sceret=921635a9c2228359d54133ccc8dff6c1a9e389e0',
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) {
        console.log(error);
      }
      if (response.statusCode !== 200) {
        res.status(404).json({ msg: 'User not found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.messgae);
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = Route;
