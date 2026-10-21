import { useState, useEffect } from "react";
import { Link, Routes, Route, useMatch, useNavigate } from "react-router-dom";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      navigate("/");
    } catch {
      setNotification({ text: "Wrong credentials", type: "error" });
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setNotification({ text: "Successfully logged out", type: "success" });
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(returnedBlog));
    setNotification({
      text: `A new blog ${returnedBlog.title} by ${returnedBlog.author} is added`,
      type: "success",
    });
  };

  const updateBlog = async (blogObject) => {
    const updatedBlog = await blogService.update(blogObject);
    const newBlogs = blogs.map((blog) =>
      blog.id === updatedBlog.id ? updatedBlog : blog,
    );
    setBlogs(newBlogs);
  };

  const removeBlog = async (blogObject) => {
    await blogService.remove(blogObject);
    const newBlogs = blogs.filter((blog) => blog.id !== blogObject.id);
    setBlogs(newBlogs);
    setNotification({
      text: `${blogObject.title} by ${blogObject.author} has been deleted`,
      type: "success",
    });
  };

  return (
    <Container>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h1" sx={{ fontSize: "2em", flexGrow: 1 }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{ fontSize: "inherit", textTransform: "none" }}
            >
              Blog App
            </Button>
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Blogs
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/create">
              New Blog
            </Button>
          )}
          {user ? (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification
        notification={notification}
        setNotification={setNotification}
      />

      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <BlogList blogs={blogs} setBlogs={setBlogs} user={user} />
            </ErrorBoundary>
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <ErrorBoundary>
              <Blog
                blog={blog}
                user={user}
                updateBlog={updateBlog}
                removeBlog={removeBlog}
              />
            </ErrorBoundary>
          }
        />

        <Route
          path="/create"
          element={
            <ErrorBoundary>
              <BlogForm addBlog={addBlog} />
            </ErrorBoundary>
          }
        />

        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <LoginForm login={login} />
            </ErrorBoundary>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  );
};

export default App;
