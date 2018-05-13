const express = require('express');
const router = express.Router();

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
  });
});

module.exports = router;