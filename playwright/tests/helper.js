const initialBlogs = [
  {
    title: 'First blog',
    author: 'Playwright',
    url: 'http://localhost:5173',
  },
  {
    title: 'Blog with most likes',
    author: 'Playwrong',
    url: 'http://localhost:5173',
  },
  {
    title: 'Blog without likes',
    author: 'Playwright',
    url: 'http://localhost:5173',
  },
]

const loginWith = async (page, username, password) => {
  await page.getByText('Login').click()
  await page.getByRole('textbox', { name: 'username' }).fill(username)
  await page.getByRole('textbox', { name: 'password' }).fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'New blog' }).click()
  await page.getByRole('textbox', { name: 'title' }).fill(title)
  await page.getByRole('textbox', { name: 'author' }).fill(author)
  await page.getByRole('textbox', { name: 'url' }).fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByText(`A new blog ${title} by ${author}`).waitFor()
}

const likeBlog = async (page, blog) => {
  await page.getByRole('link', { name: `${blog.title} by ${blog.author}` }).click()
  await page.getByRole('button', { name: 'Like' }).click()
  await page.getByRole('link', { name: 'Blogs' }).click()
}

export { initialBlogs, loginWith, createBlog, likeBlog }
