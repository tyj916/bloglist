const dummy = () => {
  return 1;
}

const totalLikes = (blogs) => {
  const sum = blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);

  return sum;
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) return null;

  const mostLikedBlog = blogs.reduce((max, current) => {
    return current.likes > max.likes ? current : max;
  }, blogs[0]);

  return mostLikedBlog;
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null;

  const authorCounts = new Map();

  let mostBlogsAuthor = null;
  let maxCount = 0;

  for (const blog of blogs) {
    const count = (authorCounts.get(blog.author) || 0) + 1;

    authorCounts.set(blog.author, count);

    if (count > maxCount) {
      maxCount = count;
      mostBlogsAuthor = blog.author;
    }
  }

  return mostBlogsAuthor;
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null;

  const likesCounts = new Map();

  let mostLikesAuthor = null;
  let maxCount = 0;

  for (const blog of blogs) {
    const count = (likesCounts.get(blog.author) || 0) + blog.likes;

    likesCounts.set(blog.author, count);

    if (count > maxCount) {
      maxCount = count;
      mostLikesAuthor = {
        author: blog.author,
        likes: count,
      }
    }
  }

  return mostLikesAuthor;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}