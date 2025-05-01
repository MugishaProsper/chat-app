import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useGetSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const { authUser } = useAuthContext();

  const getSuggestions = async () => {
    if (!authUser?.token) return;

    setLoading(true);
    try {
      const res = await fetch("/api/users/suggestions", {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Filter out users that are already being followed
      const filteredSuggestions = data.filter(
        user => !authUser.following?.includes(user._id)
      );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error in useGetSuggestions: ", error.message);
      toast.error("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      getSuggestions();
    }
  }, [authUser]);

  return { loading, suggestions, getSuggestions };
};

export default useGetSuggestions; 