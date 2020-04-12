const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  website: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  githubUserName: {
    type: String,
  },
  experiences: [
    {
      currentPosition: {
        type: String
      },
      pastPosion: {
        type: String,
      },
      lookingForJobs: {
        type: Boolean,
      },
    },
  ],
  social: {
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  Date: {
      type: Date,
      default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
