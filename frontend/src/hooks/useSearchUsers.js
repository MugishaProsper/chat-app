import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useSearchUsers = () => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { authUser } = useAuthContext();

  const searchUsers = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?query=${encodeURIComponent(searchTerm)}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Filter out the current user from results
      const filteredResults = data.filter(user => user._id !== authUser._id);

      // Sort results to show followed users first
      const sortedResults = filteredResults.sort((a, b) => {
        const aIsFollowed = authUser.following?.includes(a._id);
        const bIsFollowed = authUser.following?.includes(b._id);

        if (aIsFollowed && !bIsFollowed) return -1;
        if (!aIsFollowed && bIsFollowed) return 1;
        return 0;
      });

      setSearchResults(sortedResults);
    } catch (error) {
      toast.error("Error searching users");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { loading, searchResults, searchUsers };
};

export default useSearchUsers; 