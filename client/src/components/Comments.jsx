import { useState } from "react"
import { Typography, TextField, Button, Box } from "@mui/material"
import { useBlogActions } from "../stores/useBlogStore"
import { useNotificationActions } from '../stores/useNotificationStore'

// Part of Blog
const Comments = ({ blogId, comments }) => {
  const [comment, setComment] = useState('')
  const { addComment } = useBlogActions()
  const { setNotification } = useNotificationActions()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const returnedComment = await addComment({ blogId, comment});
      setNotification(`Comment '${returnedComment.content} added'`, 'success')
      setComment('')
    } catch {
      setNotification(`Failed to create comment`, 'error')
    }
  }

  return (
    <div>
      <Typography variant="h2" sx={{ fontSize: "2em", fontWeight: "bold", mt: 3 }}>comments</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: 2, my: 2 }}>
          <TextField
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button 
            type="submit" 
            variant="contained" 
          >add comment</Button>
        </Box>
      </form>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default Comments
