import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";

import Blog from "./views/Blog";
import BlogForm from "./views/BlogForm";
import BlogList from "./views/BlogList";
import LoginForm from "./views/LoginForm";
import User from "./views/User";
import UserList from "./views/UserList";

import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import NavBar from "./components/NavBar";

import { useBlogActions } from "./stores/useBlogStore"
import { useLoginActions } from "./stores/useLoginStore";

const App = () => {
  const blogActions = useBlogActions()
  const loginActions = useLoginActions()

  useEffect(() => {
    blogActions.initialize();
  }, []);

  useEffect(() => {
    loginActions.initialize();
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

        <Route 
          path="/users"
          element={
            <ErrorBoundary>
              <UserList />
            </ErrorBoundary>
          }
        />

        <Route 
          path="/users/:username"
          element={
            <ErrorBoundary>
              <User />
            </ErrorBoundary>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  );
};

export default App;
