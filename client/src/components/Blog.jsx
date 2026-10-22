import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import NotFound from "./NotFound";
import { useBlogs } from "../stores/useBlogStore";

const Blog = ({ user, updateBlog, removeBlog }) => {
  const id = useParams().id;
  const blogs = useBlogs()
  const blog = blogs.find(blog => blog.id === id);
  const navigate = useNavigate();

  if (!blog) return <NotFound />;

  const handleLike = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    updateBlog(newBlog);
  };

  const handleRemove = () => {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    );
    if (confirm) {
      removeBlog(blog);
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
        {user && (
          <Button variant="outlined" onClick={handleLike} size="small">
            Like
          </Button>
        )}
        {user && blog.user.id === user.id && (
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
