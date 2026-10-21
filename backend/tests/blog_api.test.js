const { test, after, beforeEach, before, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

describe('when there is initially some blogs saved', () => {
  let authToken = null;
  let userId = null;

  before(async () => {
    await User.deleteMany({});

    const newUser = {
      username: 'root',
      password: 'Sekret'
    };

    const userResponse = await api
      .post('/api/users')
      .send(newUser)
      .expect(201);

    userId = userResponse.body.id;

    const loginResponse = await api
      .post('/api/login')
      .send({
        username: newUser.username,
        password: newUser.password,
      })
      .expect(200);

    authToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    
    const blogObjects = helper.initialBlogs.map(blog => new Blog({
      ...blog,
      user: userId
    }));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('blog posts unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs');

    assert(response.body[0].id);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map(e => e.title);
    assert(titles.includes('React patterns'));
  });

  describe('viewing a specific blog', () => {
    test('succeeds with a vlid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = await Blog
          .findById(blogsAtStart[0].id)
          .populate('user', { passwordHash: 0, blogs: 0 });

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(resultBlog.body.id, blogToView.id);
    });

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonExistingId = await helper.nonExistingId();
      await api.get(`/api/blogs/${validNonExistingId}`).expect(404);
    });

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445';
      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
      };

      const result = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const titles = blogsAtEnd.map(blog => blog.title);
      assert(titles.includes(newBlog.title));

      assert.strictEqual(result.body.user.id, userId);
    });

    test('fails with the statuscode 400 if no title', async () => {
      const newBlog = {
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('fails with the statuscode 400 if no url', async () => {
      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('without likes property succeeds with the value default to 0', async () => {
      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      };

      const result = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const noLikesBlog = blogsAtEnd.find(blog => blog.id === result.body.id);

      assert.strictEqual(noLikesBlog.likes, 0);
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
    });

    test('fails with statuscode 400 if not logged in', async () => {
      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
      };

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(result.body.error, 'token invalid');
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const ids = blogsAtEnd.map(blog => blog.id);
      assert(!ids.includes(blogToDelete.id));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });

    test('fails with statuscode 401 if invalid token', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);
    });
  });

  describe('update to a blog', () => {
    test('succeeds with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({
          ...blogToUpdate,
          title: 'Updated Title',
          likes: blogToUpdate.likes + 1,
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
      
      assert.strictEqual(updatedBlog.title, 'Updated Title');
      assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('fails with statuscode 400 if empty title and empty url are given', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({
          ...blogToUpdate,
          title: '',
          url: '',
        })
        .expect(400);
      
      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);

      assert.deepStrictEqual(updatedBlog, blogToUpdate);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
