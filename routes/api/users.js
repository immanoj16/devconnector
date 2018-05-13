const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

/**
 * @route   GET /api/users/test
 * @desc    Test the Users
 * @acess   Public
 */
router.get('/test', (req, res) => res.json({
  msg: 'users work'
}));

/**
 * @route   GET /api/users/register
 * @desc    Registration of User
 * @acess   Public
 */
router.post('/register', (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: 'Email already exists'
        });
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
 * @route   GET /api/users/login
 * @desc    login user / Returning JWT token
 * @acess   Public
 */
router.post('/login', (req, res) => {
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
        return res.status(400).json({
          email: 'User not found'
        });
      }

      // Password check
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            res.json({
              msg: 'Success'
            });
          } else {
            return res.status(400).json({
              password: 'Incorrect Password'
            });
          }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

module.exports = router;