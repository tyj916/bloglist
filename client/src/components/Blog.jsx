import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import NotFound from "./NotFound";
import { useBlogActions, useBlogs } from "../stores/useBlogStore";
import { useNotificationActions } from "../stores/useNotificationStore";
import { useLogin } from "../stores/useLoginStore";

const Blog = () => {
  const id = useParams().id;
  const blogs = useBlogs()
  const blog = blogs.find(blog => blog.id === id);
  const currentUser = useLogin()
  const navigate = useNavigate();
  const { like, remove } = useBlogActions()
  const { setNotification } = useNotificationActions()

  if (!blog) return <NotFound />;

  const handleLike = async () => {
    await like(blog.id);
    setNotification(
      `Liked ${blog.title} by ${blog.author}`,
      "success",
    );
  };

  const handleRemove = async () => {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    );

    if (confirm) {
      await remove(blog.id);
      setNotification(
        `${blog.title} by ${blog.author} has been deleted`,
        "success",
      );
      navigate("/");
    }
  };

  return (
    <Box
      component={Paper}
      sx={{ padding: 2, display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <Typography variant="h2" sx={{ fontSize: "2em", fontWeight: "bold" }}>
        {blog.title}
      </Typography>
      <Typography sx={{ color: "text.secondary" }}>by {blog.author}</Typography>
      <Typography
        component={Link}
        to={blog.url}
        target="_blank"
        sx={{
          "&:visited": { color: "primary.main" },
        }}
      >
        {blog.url}
      </Typography>
      <Typography sx={{ color: "text.secondary" }}>
        Added by {blog.user.name}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Typography>Likes: {blog.likes}</Typography>
        {currentUser && (
          <Button variant="outlined" onClick={handleLike} size="small">
            Like
          </Button>
        )}
        {currentUser && blog.user.id === currentUser.id && (
          <Button
            variant="outlined"
            onClick={handleRemove}
            size="small"
            color="error"
          >
            Remove
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Blog;
