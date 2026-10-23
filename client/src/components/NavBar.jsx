import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'
import { useUser, useUserActions } from '../stores/useUserStore';
import { useNotificationActions } from "../stores/useNotificationStore";

const NavBar = () => {
  const user = useUser()
  const userActions = useUserActions()
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
        {user && (
          <Button color="inherit" component={Link} to="/create">
            New Blog
          </Button>
        )}
        {user ? (
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
