import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const currentUser = await User.findById(loggedInUserId);

		if (!currentUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Get all conversations where the current user is a participant
		const conversations = await Conversation.find({
			participants: loggedInUserId
		})
			.populate({
				path: 'participants',
				match: { _id: { $ne: loggedInUserId } },
				select: 'fullName username profilePic lastActive'
			})
			.populate({
				path: 'messages',
				options: {
					sort: { createdAt: -1 },
					limit: 1
				},
				select: 'message senderId createdAt'
			});

		// Get followed users who are not in conversations
		const followedUsers = await User.find({
			_id: {
				$in: currentUser.following,
				$nin: conversations.map(conv => conv.participants[0]?._id)
			}
		}).select("fullName username profilePic lastActive");

		// Process conversations to include last message
		const conversationUsers = conversations.map(conv => {
			const otherUser = conv.participants[0];
			if (!otherUser) return null;

			const lastMessage = conv.messages[0];
			let lastMessageText = "No messages yet";

			if (lastMessage) {
				lastMessageText = lastMessage.senderId.equals(loggedInUserId)
					? `You: ${lastMessage.message}`
					: lastMessage.message;
			}

			return {
				_id: otherUser._id,
				fullName: otherUser.fullName,
				username: otherUser.username,
				profilePic: otherUser.profilePic,
				lastActive: otherUser.lastActive,
				conversationId: conv._id,
				lastMessage: lastMessageText,
				lastMessageTime: lastMessage?.createdAt,
				unreadCount: conv.unreadCount?.get(loggedInUserId.toString()) || 0
			};
		}).filter(Boolean);

		// Format followed users who don't have conversations yet
		const followedUsersFormatted = followedUsers.map(user => ({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
			lastActive: user.lastActive,
			conversationId: null,
			lastMessage: "No messages yet",
			lastMessageTime: null,
			unreadCount: 0
		}));

		// Combine and sort by last message time
		const allUsers = [...conversationUsers, ...followedUsersFormatted]
			.sort((a, b) => {
				if (!a.lastMessageTime && !b.lastMessageTime) return 0;
				if (!a.lastMessageTime) return 1;
				if (!b.lastMessageTime) return -1;
				return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
			});

		res.status(200).json(allUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in getUserById: ", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const updateUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const { fullName, email, gender, profilePic } = req.body;
		const user = await User.findByIdAndUpdate(userId, { fullName, email, gender, profilePic }, { new: true });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		};
		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		return res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.log("Error in deleteUser: ", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const followUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const currentUserId = req.user._id;

		if (userId === currentUserId.toString()) {
			return res.status(400).json({ error: "You cannot follow yourself" });
		}

		const userToFollow = await User.findById(userId);
		const currentUser = await User.findById(currentUserId);

		if (!userToFollow) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if already following
		if (currentUser.following.includes(userId)) {
			return res.status(400).json({ error: "Already following this user" });
		}

		// Add to following and followers
		currentUser.following.push(userId);
		userToFollow.followers.push(currentUserId);

		// Create a conversation between the users
		const conversation = await Conversation.create({
			participants: [currentUserId, userId],
			unreadCount: new Map([
				[currentUserId.toString(), 0],
				[userId.toString(), 0]
			])
		});

		await Promise.all([
			currentUser.save(),
			userToFollow.save()
		]);

		res.status(200).json({
			message: "User followed successfully",
			conversationId: conversation._id
		});
	} catch (error) {
		console.log("Error in followUser controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const unfollowUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const currentUserId = req.user._id;

		if (userId === currentUserId.toString()) {
			return res.status(400).json({ error: "You cannot unfollow yourself" });
		}

		const userToUnfollow = await User.findById(userId);
		const currentUser = await User.findById(currentUserId);

		if (!userToUnfollow) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if not following
		if (!currentUser.following.includes(userId)) {
			return res.status(400).json({ error: "You are not following this user" });
		}

		// Remove from following and followers
		currentUser.following = currentUser.following.filter(
			(id) => id.toString() !== userId
		);
		userToUnfollow.followers = userToUnfollow.followers.filter(
			(id) => id.toString() !== currentUserId.toString()
		);

		await currentUser.save();
		await userToUnfollow.save();

		res.status(200).json({ message: "User unfollowed successfully" });
	} catch (error) {
		console.log("Error in unfollowUser controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const searchUsers = async (req, res) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res.status(400).json({ error: "Search query is required" });
		}

		const users = await User.find({
			$or: [
				{ fullName: { $regex: query, $options: "i" } },
				{ username: { $regex: query, $options: "i" } }
			]
		}).select("-password -followers -following -suggestions");

		res.status(200).json(users);
	} catch (error) {
		console.log("Error in searchUsers controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

