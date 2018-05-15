const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User model
const User = require('../../models/User');

/**
 * @route   GET /api/profile/test
 * @desc    Test the Profile
 * @acess   Public
 */
router.get('/test', (req, res) => res.json({
  msg: 'profile work'
}));

/**
 * @route   GET /api/profile
 * @desc    Get user profile
 * @acess   Private
 */
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

/**
 * @route   POST /api/profile
 * @desc    Create user profile
 * @acess   Private
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

});

module.exports = router;