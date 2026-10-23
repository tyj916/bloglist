import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLoginActions } from "../stores/useLoginStore";
import { useNotificationActions } from "../stores/useNotificationStore";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLoginActions()
  const { setNotification } = useNotificationActions()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login({ username, password });
      setUsername("");
      setPassword("");
      navigate("/");
    } catch {
      setNotification("Wrong credentials", "error");
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="standard"
            margin="dense"
          />
        </div>
        <div>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            margin="dense"
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          Log in
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
