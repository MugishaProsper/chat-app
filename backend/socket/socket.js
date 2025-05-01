import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initializeSocket = (server) => {
	console.log("[Socket] Initializing Socket.IO server");

	io = new Server(server, {
		cors: {
			origin: [
				"http://localhost:5173",
				"http://localhost:3000",
			],
			methods: ["GET", "POST"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"]
		},
		transports: ["websocket", "polling"],
		path: "/socket.io/",
		pingTimeout: 60000,
		pingInterval: 25000
	});

	// Middleware for authentication
	io.use(async (socket, next) => {
		try {
			const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split("jwt=")[1];

			if (!token) {
				console.error("[Socket] No token provided");
				return next(new Error("Authentication error"));
			}

			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			socket.userId = decoded.userId;
			console.log("[Socket] User authenticated:", socket.userId);
			next();
		} catch (error) {
			console.error("[Socket] Authentication error:", error);
			next(new Error("Authentication error"));
		}
	});

	io.on("connection", (socket) => {
		console.log("[Socket] User connected:", socket.userId);

		// Store user's socket ID
		userSocketMap.set(socket.userId, socket.id);
		console.log("[Socket] User socket ID stored:", socket.id);

		// Handle disconnection
		socket.on("disconnect", () => {
			console.log("[Socket] User disconnected:", socket.userId);
			userSocketMap.delete(socket.userId);
		});
	});

	return io;
};

// Map to store user IDs and their socket IDs
const userSocketMap = new Map();

export const getReceiverSocketId = (receiverId) => {
	console.log("[Socket] Getting socket ID for receiver:", receiverId);
	const socketId = userSocketMap.get(receiverId);
	console.log("[Socket] Found socket ID:", socketId);
	return socketId;
};

export { io };
