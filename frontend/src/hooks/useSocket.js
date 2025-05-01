import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import io from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) {
      console.log("[useSocket] No authenticated user, skipping socket connection");
      return;
    }

    console.log("[useSocket] Initializing socket connection for user:", authUser._id);

    const socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem("chat-user") ? JSON.parse(localStorage.getItem("chat-user")).token : null
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    socketInstance.on("connect", () => {
      console.log("[useSocket] Connected to socket server");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("[useSocket] Connection error:", error);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("[useSocket] Disconnected from socket server:", reason);
    });

    setSocket(socketInstance);

    return () => {
      console.log("[useSocket] Cleaning up socket connection");
      socketInstance.disconnect();
    };
  }, [authUser]);

  return socket;
};

export default useSocket; 