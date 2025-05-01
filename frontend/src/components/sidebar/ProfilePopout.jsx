import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import useDeleteUser from "../../hooks/useDeleteUser";
import toast from "react-hot-toast";
import { IoClose, IoPerson, IoMail, IoCalendar, IoImage } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePopout = ({ isOpen, onClose }) => {
  const { authUser } = useAuthContext();
  const { loading: updateLoading, updateProfile } = useUpdateProfile();
  const { loading: deleteLoading, deleteUser } = useDeleteUser();
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    gender: authUser?.gender || "",
    profilePic: authUser?.profilePic || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      toast.success("Profile updated successfully!");
      onClose();
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const success = await deleteUser();
      if (success) {
        toast.success("Account deleted successfully");
        onClose();
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
              </motion.div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Close"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IoClose className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>

            {/* Profile Picture Preview */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative group">
                <motion.div
                  className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-indigo-100 transition-all duration-300 group-hover:ring-indigo-200"
                  whileHover={{ scale: 1.05 }}
                >
                  {formData.profilePic ? (
                    <motion.img
                      src={formData.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <IoPerson className="w-12 h-12 text-white" />
                    </div>
                  )}
                </motion.div>
                <motion.div
                  className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                />
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <motion.div
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <IoPerson className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-gray-800 font-medium"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <IoMail className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-gray-800 font-medium"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              {/* Gender */}
              <motion.div
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <IoPerson className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Gender</p>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-gray-800 font-medium"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </motion.div>

              {/* Profile Picture URL */}
              <motion.div
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <IoImage className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Profile Picture URL</p>
                  <input
                    type="url"
                    name="profilePic"
                    value={formData.profilePic}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-gray-800 font-medium"
                    placeholder="Enter profile picture URL"
                  />
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex justify-between items-center pt-6 border-t border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiTrash2 className="w-4 h-4" />
                  {deleteLoading ? "Deleting..." : "Delete Account"}
                </motion.button>
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={updateLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </motion.button>
                </div>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePopout;