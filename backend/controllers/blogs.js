const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { passwordHash: 0, blogs: 0 });

  res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog
    .findById(req.params.id)
    .populate('user', { passwordHash: 0, blogs: 0 });

  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user;

  const blog = new Blog({
    ...req.body,
    likes: req.body.likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  await savedBlog.populate('user', { passwordHash: 0, blogs: 0 });
  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user;

  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() === user._id.toString()) {
    await blog.deleteOne();
  } else {
    return res.status(401).json({ error: 'unauthorized delete' });
  }

  res.status(204).end();
});

blogsRouter.put('/:id', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body;
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return res.status(404).end();
  }

  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;

  const updatedBlog = await blog.save();
  await updatedBlog.populate('user', { passwordHash: 0, blogs: 0 });
  res.json(updatedBlog);
});

module.exports = blogsRouter;
