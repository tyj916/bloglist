import { useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import { useBlogActions } from "./stores/useBlogStore"
import { useNotificationActions } from "./stores/useNotificationStore";
import { useUser, useUserActions } from "./stores/useUserStore";

const App = () => {
  const blogActions = useBlogActions()
  const userActions = useUserActions()
  const user = useUser()
  const { setNotification } = useNotificationActions()

  useEffect(() => {
    blogActions.initialize();
  }, []);

  useEffect(() => {
    userActions.initialize();
  }, []);

  const logout = () => {
    userActions.logout()
    setNotification("Successfully logged out", "success");
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

      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <BlogList />
            </ErrorBoundary>
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <ErrorBoundary>
              <Blog />
            </ErrorBoundary>
          }
        />

        <Route
          path="/create"
          element={
            <ErrorBoundary>
              <BlogForm />
            </ErrorBoundary>
          }
        />

        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <LoginForm />
            </ErrorBoundary>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  );
};

export default App;
