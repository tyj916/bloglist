import { Alert } from "@mui/material";
import { useNotification } from "../stores/useNotificationStore";

const Notification = () => {
  const { message, type } = useNotification()

  if (!message) return null;

  return (
    <Alert severity={type} sx={{ my: 2 }}>
      <p>{message}</p>
    </Alert>
  );
};

export default Notification;
