import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./socket/socket.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Middleware
const corsOptions = {
	origin: process.env.CORS_ORIGIN || "http://localhost:5173",
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error("Error:", err);
	res.status(500).json({ error: err.message || "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectToMongoDB();
});
