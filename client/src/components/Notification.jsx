import { useEffect } from "react";
import { Alert } from "@mui/material";

const Notification = ({ notification, setNotification }) => {
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  if (!notification) return null;

  return (
    <Alert severity={notification.type} sx={{ my: 2 }}>
      <p>{notification.text}</p>
    </Alert>
  );
};

export default Notification;
