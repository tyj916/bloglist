import { Typography } from "@mui/material"

const Comments = ({ comments }) => {
  return (
    <div>
      <Typography variant="h2" sx={{ fontSize: "2em", fontWeight: "bold", mt: 3, mb: 2 }}>comments</Typography>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default Comments
