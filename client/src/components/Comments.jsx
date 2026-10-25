import { useState } from "react"
import { Typography, TextField, Button, Box } from "@mui/material"
import blogService from '../services/blogs'

const Comments = ({ blogId, comments }) => {
  const [comment, setComment] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const returnedComment = await blogService.createComment({
      id: blogId, 
      content: comment,
    });

    console.log(returnedComment)
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
