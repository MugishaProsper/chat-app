import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";
import useGetConversations from "./useGetConversations";

const useFollowUser = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();
  const { setSelectedConversation } = useConversation();
  const { getConversations } = useGetConversations();

  const followUser = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/follow/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // If a conversation was created, update the selected conversation
      if (data.conversationId) {
        // Refresh conversations list
        await getConversations();
      }
    } catch (error) {
      console.log("Error in useFollowUser: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/unfollow/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Refresh conversations list
      await getConversations();
    } catch (error) {
      console.log("Error in useUnfollowUser: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, followUser, unfollowUser };
};

export default useFollowUser; 