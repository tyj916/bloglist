const express = require('express')
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

const allowAnonymous = async (req, res, next) => {
  if (req.token) {
    return userExtractor(req, res, next);
  }

  next()
}

const commentsRouter = express.Router({
  mergeParams: true
})

commentsRouter.post('/', allowAnonymous, async (req, res) => {
  const user = req.user
  const { blogId } = req.params
  const { content } = req.body;

  console.log(req.params)

  const blog = await Blog.findById(blogId);

  if (!blog) {
    console.log("no blog")
    return res.status(404).end()
  }

  blog.comments.push({ content, user: user ? user.id : null })

  await blog.save()

  const newComment = blog.comments[blog.comments.length - 1]

  return res.status(201).json(newComment)
})

module.exports = commentsRouter;