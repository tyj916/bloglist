import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'
import { useLogin, useLoginActions } from '../stores/useLoginStore';
import { useNotificationActions } from "../stores/useNotificationStore";

const NavBar = () => {
  const currentUser = useLogin()
  const userActions = useLoginActions()
  const { setNotification } = useNotificationActions()

  const logout = () => {
    userActions.logout()
    setNotification("Successfully logged out", "success");
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h1" sx={{ fontSize: "2em", flexGrow: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ fontSize: "inherit", textTransform: "none" }}
          >
            Blog App
          </Button>
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Blogs
        </Button>
        {currentUser && (
          <Button color="inherit" component={Link} to="/create">
            New Blog
          </Button>
        )}
        {currentUser ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
