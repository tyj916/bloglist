import { useParams } from "react-router-dom"

const User = () => {
  const { username } = useParams()

  console.log(username)

  return (
    <div>
      User
    </div>
  )
}

export default User
