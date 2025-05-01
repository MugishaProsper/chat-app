import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	console.log("[Backend] sendMessage controller started");
	console.log("[Backend] Request body:", req.body);
	console.log("[Backend] Request params:", req.params);
	console.log("[Backend] Authenticated user:", req.user);

	try {
		const { message, senderId, receiverId } = req.body;
		const userId = req.user._id;

		console.log("[Backend] Extracted data:", {
			message,
			senderId,
			receiverId,
			userId
		});

		// Validate request data
		if (!message || !senderId || !receiverId) {
			console.error("[Backend] Missing required fields");
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Verify sender is the authenticated user
		if (senderId !== userId.toString()) {
			console.error("[Backend] Unauthorized sender:", {
				senderId,
				userId: userId.toString()
			});
			return res.status(403).json({ error: "Unauthorized sender" });
		}

		// Find or create conversation
		console.log("[Backend] Looking for conversation between:", senderId, "and", receiverId);
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] }
		});

		console.log("[Backend] Found conversation:", conversation);

		if (!conversation) {
			console.log("[Backend] Creating new conversation");
			conversation = await Conversation.create({
				participants: [senderId, receiverId]
			});
			console.log("[Backend] New conversation created:", conversation);
		}

		// Create new message
		console.log("[Backend] Creating new message");
		const newMessage = new Message({
			senderId,
			receiverId,
			message
		});

		console.log("[Backend] New message created:", newMessage);

		// Add message to conversation
		conversation.messages.push(newMessage._id);
		conversation.updatedAt = new Date();

		// Update unread count for receiver
		const currentUnread = conversation.unreadCount.get(receiverId) || 0;
		conversation.unreadCount.set(receiverId, currentUnread + 1);

		// Save both conversation and message
		console.log("[Backend] Saving conversation and message");
		await Promise.all([
			conversation.save(),
			newMessage.save()
		]);
		console.log("[Backend] Conversation and message saved");

		// Emit socket event to receiver
		const receiverSocketId = getReceiverSocketId(receiverId);
		console.log("[Backend] Receiver socket ID:", receiverSocketId);

		if (receiverSocketId) {
			const socketMessage = {
				...newMessage.toObject(),
				senderId: newMessage.senderId.toString(),
				receiverId: newMessage.receiverId.toString(),
				unreadCount: conversation.unreadCount.get(receiverId)
			};
			console.log("[Backend] Emitting socket message:", socketMessage);
			io.to(receiverSocketId).emit("newMessage", socketMessage);
		}

		// Send response with processed message
		const responseMessage = {
			...newMessage.toObject(),
			senderId: newMessage.senderId.toString(),
			receiverId: newMessage.receiverId.toString(),
			unreadCount: conversation.unreadCount.get(receiverId)
		};
		console.log("[Backend] Sending response:", responseMessage);
		res.status(201).json(responseMessage);

	} catch (error) {
		console.error("[Backend] Error in sendMessage controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	console.log("[Backend] getMessages controller started");
	console.log("[Backend] Request params:", req.params);
	console.log("[Backend] Authenticated user:", req.user);

	try {
		const { id: otherUserId } = req.params;
		const userId = req.user._id;

		console.log("[Backend] Looking for conversation between:", userId, "and", otherUserId);

		// Find conversation and ensure user is a participant
		const conversation = await Conversation.findOne({
			participants: { $all: [userId, otherUserId] }
		}).populate({
			path: 'messages',
			options: { sort: { createdAt: 1 } }
		});

		console.log("[Backend] Found conversation:", conversation);

		if (!conversation) {
			console.log("[Backend] No conversation found");
			return res.status(200).json([]);
		}

		// Mark messages as read
		conversation.unreadCount.set(userId, 0);
		conversation.lastRead.set(userId, new Date());
		await conversation.save();

		// Process messages to include sender and receiver information
		const messages = conversation.messages.map(message => ({
			...message.toObject(),
			senderId: message.senderId.toString(),
			receiverId: message.receiverId.toString()
		}));

		// Convert unreadCount Map to plain object
		const unreadCount = {};
		conversation.unreadCount.forEach((value, key) => {
			unreadCount[key.toString()] = value;
		});

		// Add unreadCount to the response
		const response = {
			messages,
			unreadCount,
			conversationId: conversation._id
		};

		console.log("[Backend] Processed messages:", response);
		res.status(200).json(response);

	} catch (error) {
		console.error("[Backend] Error in getMessages controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const { conversationId } = req.params;
		const userId = req.user._id;

		const conversation = await Conversation.findById(conversationId);
		if (!conversation) {
			return res.status(404).json({ error: "Conversation not found" });
		}

		conversation.unreadCount.set(userId, 0);
		conversation.lastRead.set(userId, new Date());
		await conversation.save();

		res.status(200).json({ message: "Messages marked as read" });
	} catch (error) {
		console.error("[Backend] Error in markAsRead controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
