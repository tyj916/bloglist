import { useParams } from "react-router-dom"
import { Typography } from "@mui/material"
import { useUsers } from "../stores/useUserStore"

const User = () => {
  const { id } = useParams()
  const user = useUsers().find(user => user.id === id)

  return (
    <div>
      <Typography variant="h2" sx={{ fontSize: "2em", lineHeight: 2 }}>{user.name}</Typography>
      <Typography variant="h3" sx={{ fontSize: "1.5em", lineHeight: 1.5, mb: 3 }}>added blogs</Typography>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
