import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import NavBar from "./components/NavBar";
import { useBlogActions } from "./stores/useBlogStore"
import { useUserActions } from "./stores/useUserStore";

const App = () => {
  const blogActions = useBlogActions()
  const userActions = useUserActions()

  useEffect(() => {
    blogActions.initialize();
  }, []);

  useEffect(() => {
    userActions.initialize();
  }, []);

  return (
    <Container>
      <NavBar />

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
