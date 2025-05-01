import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const { conversations, setConversations } = useConversation();
	const { authUser } = useAuthContext();

	const getConversations = async () => {
		if (!authUser?.token) return;

		setLoading(true);
		try {
			const res = await fetch("/api/users", {
				headers: {
					Authorization: `Bearer ${authUser.token}`,
				},
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const data = await res.json();
			if (data.error) throw new Error(data.error);

			// Sort conversations by unread count and then by last message time
			const sortedConversations = data.sidebarUsers.sort((a, b) => {
				// First sort by unread count
				if (b.unreadCount !== a.unreadCount) {
					return b.unreadCount - a.unreadCount;
				}
				// Then sort by conversationId (users with conversations come first)
				if (a.conversationId && !b.conversationId) return -1;
				if (!a.conversationId && b.conversationId) return 1;
				return 0;
			});

			setConversations(sortedConversations);
		} catch (error) {
			console.error("Error in useGetConversations: ", error.message);
			toast.error("Failed to load conversations");
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
