import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { authUser } = useAuthContext();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				if (!selectedConversation?._id) return;

				// Get messages
				const res = await fetch(`/api/messages/${selectedConversation._id}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);

				// Ensure messages is an array
				const messagesArray = Array.isArray(data.messages) ? data.messages : [];

				// Process messages with correct context
				const processedMessages = messagesArray.map(msg => ({
					...msg,
					// Determine if message is from current user
					isSelf: msg.senderId === authUser._id
				}));

				// Sort messages by timestamp
				const sortedMessages = processedMessages.sort(
					(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
				);

				setMessages(sortedMessages);

				// Mark messages as read
				try {
					// Find the conversation between the current user and selected user
					const conversationRes = await fetch(`/api/messages/${selectedConversation._id}`);
					const conversationData = await conversationRes.json();
					
					if (conversationData.conversationId) {
						await fetch(`/api/messages/read/${conversationData.conversationId}`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
						});
					}
				} catch (error) {
					console.error("Error marking messages as read:", error);
				}
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getMessages();
	}, [selectedConversation?._id, setMessages, authUser._id]);

	return { messages, loading };
};
export default useGetMessages;
