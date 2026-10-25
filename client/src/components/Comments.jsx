import { Typography, TextField, Button, Box } from "@mui/material"
import { useState } from "react"

const Comments = ({ comments }) => {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    console.log("Add comment")
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
