const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/profile/test
 * @desc    Test the Profile
 * @acess   Public
 */
router.get('/test', (req, res) => res.json({
  msg: 'profile work'
}));

module.exports = router;