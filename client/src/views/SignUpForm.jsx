import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import signUpService from "../services/signUp";
import { useNotificationActions } from "../stores/useNotificationStore";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { setNotification } = useNotificationActions()
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signUpService.signUp({ username, name, password });
      setUsername("");
      setName("");
      setPassword("");
      navigate("/");
    } catch (error) {
      setNotification(`Failed to create user: ${error}`, "error");
    }
  };

  return (
    <div>
      <h2>Sign up</h2>
      <form onSubmit={handleSignUp}>
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
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          Sign up
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
