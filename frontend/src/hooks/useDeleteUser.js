import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const deleteUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Clear local storage and context
      localStorage.removeItem("chat-user");
      setAuthUser(null);
      toast.success("Account deleted successfully");
      navigate("/login");
      return true;
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(error.message || "Failed to delete account");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteUser };
};

export default useDeleteUser; 