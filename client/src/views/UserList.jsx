import { useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
} from "@mui/material"
import { useUserActions, useUsers } from "../stores/useUserStore"

const UserList = () => {
  const { initialize } = useUserActions() 

  useEffect(() => {
    initialize()
  }, [])

  const users = useUsers()

  return (
    <div>
      <h2>Users</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Blogs Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.username}>
                <TableCell>
                  <Link to={`/users/${user.username}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UserList
