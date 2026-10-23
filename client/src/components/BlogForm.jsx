import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useBlogActions } from "../stores/useBlogStore";
import { useNotificationActions } from "../stores/useNotificationStore";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const { add } = useBlogActions();
  const { setNotification } = useNotificationActions()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const returnedBlog = await add({ title, author, url });
    setNotification(
      `A new blog ${returnedBlog.title} by ${returnedBlog.author} is added`,
      "success",
    );
    setTitle("");
    setAuthor("");
    setUrl("");
    navigate("/");
  };

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
            margin="dense"
            sx={{ width: "min(100%, 400px)" }}
          />
        </div>
        <div>
          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            variant="outlined"
            size="small"
            margin="dense"
            sx={{ width: "min(100%, 400px)" }}
          />
        </div>
        <div>
          <TextField
            label="Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            variant="outlined"
            size="small"
            margin="dense"
            sx={{ width: "min(100%, 400px)" }}
          />
        </div>

        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          Create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
