import { useState } from "react";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { authUser } = useAuthContext();

	const sendMessage = async (message) => {
		console.log("[useSendMessage] Starting message send process");
		console.log("[useSendMessage] Current state:", {
			selectedConversation,
			authUser,
			currentMessagesCount: messages.length
		});

		setLoading(true);
		try {
			if (!selectedConversation?._id) {
				console.error("[useSendMessage] No conversation selected");
				throw new Error("No conversation selected");
			}

			// Create message payload
			const messagePayload = {
				message,
				senderId: authUser._id,
				receiverId: selectedConversation._id
			};

			console.log("[useSendMessage] Sending message payload:", messagePayload);

			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(messagePayload),
				credentials: "include"
			});

			console.log("[useSendMessage] Response status:", res.status);
			const data = await res.json();
			console.log("[useSendMessage] Response data:", data);

			if (data.error) {
				console.error("[useSendMessage] Server error:", data.error);
				throw new Error(data.error);
			}

			// Create message object with proper context
			const newMessage = {
				...data,
				senderId: authUser._id,
				receiverId: selectedConversation._id,
				createdAt: new Date().toISOString()
			};

			console.log("[useSendMessage] Created new message object:", newMessage);

			// Update messages state
			setMessages([...messages, newMessage]);
			console.log("[useSendMessage] Messages state updated");

		} catch (error) {
			console.error("[useSendMessage] Error in sendMessage:", error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
