import { useEffect } from "react"
import { useUserActions, useUsers } from "../stores/useUserStore"

const UserList = () => {
  const { initialize } = useUserActions() 

  useEffect(() => {
    initialize()
  }, [])

  const users = useUsers()

  console.log(users)

  return (
    <div>
      userlist
    </div>
  )
}

export default UserList
