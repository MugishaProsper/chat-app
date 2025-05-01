import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";

const useGetUserById = (userId) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${authUser.token}`
          }
        });
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getUser();
    }
  }, [userId, authUser.token]);

  return { loading, user };
};

export default useGetUserById; 