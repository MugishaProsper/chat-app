import { useParams, useNavigate } from "react-router-dom";
import useGetUserById from "../hooks/useGetUserById";
import { IoClose, IoPerson, IoMail, IoCalendar } from "react-icons/io5";
import { motion } from "framer-motion";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { loading, user } = useGetUserById(userId);

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClose}>
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClose}>
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <IoPerson className="w-8 h-8 text-red-500" />
            </motion.div>
            <motion.h3
              className="text-xl font-semibold text-gray-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              User Not Found
            </motion.h3>
            <motion.p
              className="text-gray-600 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The user you're looking for doesn't exist or has been removed.
            </motion.p>
            <motion.button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClose}>
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
            <p className="text-sm text-gray-500 mt-1">View user information</p>
          </motion.div>
          <motion.button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Close"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoClose className="w-5 h-5 text-gray-500" />
          </motion.button>
        </div>

        {/* Profile Picture */}
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
              {user.profilePic ? (
                <motion.img
                  src={user.profilePic}
                  alt={user.fullName}
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

        {/* User Info */}
        <div className="space-y-4">
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
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-800">{user.fullName}</p>
            </div>
          </motion.div>

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
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ x: 5 }}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <IoCalendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-800">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-6 pt-4 border-t border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserProfile; 