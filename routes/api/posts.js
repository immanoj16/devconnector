const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

const Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post');

/**
 * @route   GET /api/posts
 * @desc    Get posts
 * @acess   Public
 */
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 }) // sort by date
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

/**
 * @route   GET /api/posts/:id
 * @desc    Get posts by id
 * @acess   Public
 */
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: 'No post found for this ID' }));
});


/**
 * @route   POST /api/posts
 * @desc    Create a post
 * @acess   Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validatePostInput(req.body);

  // Check valid or not
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save()
    .then(post => res.json(post));
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    delete a post
 * @acess   Private
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Delete
          Post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnofound: 'No post found' }));
    })
    .catch(err => res.status(404).json({ profilenofound: 'No profile found' }));
});

/**
 * @route   POST /api/posts/like/:id
 * @desc    like a post
 * @acess   Private
 */
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            res.status(400).json({ alreadyliked: 'User already liked this post' });
          }

          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnofound: 'No post found' }));
    })
    .catch(err => res.status(404).json({ profilenofound: 'No profile found' }));
});

/**
 * @route   POST /api/posts/unlike/:id
 * @desc    unlike a post
 * @acess   Private
 */
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            res.status(400).json({ notliked: 'User have not liked yet this post' });
          }

          const removeIndex = post.likes
            .map(item => item.user.toString)
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);
          post.save()
            .then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnofound: 'No post found' }));
    })
    .catch(err => res.status(404).json({ profilenofound: 'No profile found' }));
});

/**
 * @route   POST /api/posts/comment/:id
 * @desc    unlike a post
 * @acess   Private
 */
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validatePostInput(req.body);

  // Check valid or not
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {

      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      post.save()
        .then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnofound: 'No post found' }));
});

/**
 * @route   DELETE /api/posts/comment/:id/:comment_id
 * @desc    delete a comment of a post
 * @acess   Private
 */
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Post.findById(req.params.id)
    .then(post => {

      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        req.status(404).json({ commentnotexist: 'Comment does not exist' })
      }

      const removeIndex = post.comments.map(comment => comment._id.toString())
        .indexOf(req.params.comment_id);

      post.comments.splice(removeIndex, 1);

      post.save()
        .then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnofound: 'No post found' }));
});

module.exports = router;