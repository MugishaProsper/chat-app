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
		}).populate({
			path: 'participants',
			match: { _id: { $ne: loggedInUserId } },
			select: '-password -followers -following -suggestions'
		});

		// Get unique conversation participants
		const conversationUserIds = new Set(
			conversations.map(conv => conv.participants[0]?._id?.toString()).filter(Boolean)
		);

		// Get followed users who are not in conversations
		const followedUsers = await User.find({
			_id: { $in: currentUser.following || [] },
			_id: { $nin: Array.from(conversationUserIds) }
		}).select("-password -followers -following -suggestions");

		// Get suggestions (users not followed and not in conversations)
		const suggestions = await User.aggregate([
			{
				$match: {
					$and: [
						{ _id: { $ne: loggedInUserId } },
						{ _id: { $nin: currentUser.following || [] } },
						{ _id: { $nin: Array.from(conversationUserIds) } }
					]
				}
			},
			{
				$sample: { size: 5 }
			},
			{
				$project: {
					password: 0,
					followers: 0,
					following: 0,
					suggestions: 0
				}
			}
		]);

		// Combine conversations and followed users, ensuring no duplicates
		const sidebarUsers = [
			...conversations.map(conv => ({
				...conv.participants[0]?.toObject(),
				conversationId: conv._id,
				unreadCount: conv.unreadCount?.get(loggedInUserId.toString()) || 0
			})).filter(Boolean),
			...followedUsers.map(user => ({
				...user.toObject(),
				conversationId: null,
				unreadCount: 0
			}))
		];

		// Remove duplicates based on _id
		const uniqueSidebarUsers = sidebarUsers.filter(
			(user, index, self) =>
				index === self.findIndex(u => u._id?.toString() === user._id?.toString())
		);

		res.status(200).json({
			sidebarUsers: uniqueSidebarUsers,
			suggestions
		});
	} catch (error) {
		console.log("Error in getUsersForSidebar controller: ", error.message);
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

export const getSuggestions = async (req, res) => {
	try {
		const currentUserId = req.user._id;
		const currentUser = await User.findById(currentUserId);

		// Get all conversations where the current user is a participant
		const conversations = await Conversation.find({
			participants: currentUserId
		});

		// Get unique conversation participants
		const conversationUserIds = new Set(
			conversations.map(conv => conv.participants[0]._id.toString())
		);

		// Get users that the current user is not following and not in conversation with
		const suggestions = await User.aggregate([
			{
				$match: {
					$and: [
						{ _id: { $ne: currentUserId } },
						{ _id: { $nin: currentUser.following || [] } },
						{ _id: { $nin: Array.from(conversationUserIds) } }
					]
				}
			},
			{
				$sample: { size: 5 } // Get 5 random suggestions
			},
			{
				$project: {
					password: 0,
					followers: 0,
					following: 0,
					suggestions: 0
				}
			}
		]);

		res.status(200).json(suggestions);
	} catch (error) {
		console.log("Error in getSuggestions controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

