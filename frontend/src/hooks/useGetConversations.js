import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const { conversations, setConversations } = useConversation();
	const { authUser } = useAuthContext();

	const getConversations = async () => {
		if (!authUser) {
			console.log("No authenticated user");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/users", {
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // Important for cookies
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const data = await res.json();
			console.log("API Response:", data);

			if (data.error) throw new Error(data.error);

			// Remove duplicates by user ID
			const uniqueConversations = data.reduce((acc, current) => {
				const x = acc.find(item => item._id === current._id);
				if (!x) {
					return acc.concat([current]);
				} else {
					// If duplicate found, keep the one with the conversation
					if (current.conversationId && !x.conversationId) {
						const index = acc.indexOf(x);
						acc[index] = current;
					}
					return acc;
				}
			}, []);

			// Sort conversations
			const sortedConversations = uniqueConversations.sort((a, b) => {
				// First sort by unread count
				if (b.unreadCount !== a.unreadCount) {
					return b.unreadCount - a.unreadCount;
				}
				// Then sort by last message time
				if (!a.lastMessageTime && !b.lastMessageTime) return 0;
				if (!a.lastMessageTime) return 1;
				if (!b.lastMessageTime) return -1;
				return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
			});

			console.log("Sorted unique conversations:", sortedConversations);
			setConversations(sortedConversations);
		} catch (error) {
			console.error("Error in useGetConversations: ", error.message);
			toast.error("Failed to load conversations");
			setConversations([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (authUser) {
			getConversations();
		}
	}, [authUser]);

	return { loading, conversations, getConversations };
};

export default useGetConversations;
