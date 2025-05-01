import { useState } from "react"
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useAuthContext();

  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Update local storage and context
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateProfile };
};

export default useUpdateProfile;