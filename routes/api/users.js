const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');
const User = require('../../models/User');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

/**
 * @route   GET /api/users/register
 * @desc    Registration of User
 * @acess   Public
 */
router.post('/register', (req, res) => {

  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  // Check valid or not
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          });
        })
      }
    })
    .catch(err => console.log(err))
});

/**
 * @route   POST /api/users/login
 * @desc    login user / Returning JWT token
 * @acess   Public
 */
router.post('/login', (req, res) => {
  const {
    errors,
    isValid
  } = validateLoginInput(req.body);

  // Check valid or not
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const {
    email,
    password
  } = req.body;

  // Find user by email
  User.findOne({
    email
  })
    .then(user => {
      // User check
      if (!user) {
        errors.email = 'User not found';
        return res.status(400).json(errors);
      }

      // Password check
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };

            jwt.sign(payload, keys.secretOrKey, {
              expiresIn: 3600
            }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            });
          } else {
            errors.password = 'Incorrect Password';
            return res.status(400).json(errors);
          }
        })
        .catch(err => console.log(err.response.data))
    })
    .catch(err => console.log(err))
});

/**
 * @route   GET /api/users/current
 * @desc    Return current user
 * @acess   Private
 */
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  const {
    id,
    name,
    email
  } = req.user;
  res.json({
    id,
    name,
    email
  });
});

module.exports = router;