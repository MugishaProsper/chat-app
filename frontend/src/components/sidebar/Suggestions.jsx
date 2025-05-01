import useGetSuggestions from "../../hooks/useGetSuggestions";
import { IoPersonAddOutline } from "react-icons/io5";
import useFollowUser from "../../hooks/useFollowUser";
import { useAuthContext } from "../../context/AuthContext";

const Suggestions = () => {
  const { loading, suggestions } = useGetSuggestions();
  const { loading: followLoading, followUser } = useFollowUser();
  const { authUser } = useAuthContext();

  const handleFollow = async (userId) => {
    await followUser(userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="loading loading-spinner loading-md text-[var(--primary)]"></span>
      </div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <div className="py-2 px-4">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] px-2 py-1">Suggestions</h3>
      <div className="flex flex-col gap-2">
        {suggestions.map((user) => {
          const isFollowed = authUser.following?.includes(user._id);
          return (
            <div
              key={user._id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--primary)] hover:bg-opacity-5 transition-colors"
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/default-profile.png"}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[var(--text-primary)] truncate">
                    {user.fullName}
                  </h3>
                  {!isFollowed && (
                    <button
                      className="p-1 rounded-full hover:bg-[var(--primary)] hover:bg-opacity-10 transition-colors"
                      onClick={() => handleFollow(user._id)}
                      disabled={followLoading}
                    >
                      <IoPersonAddOutline className="w-5 h-5 text-[var(--primary)]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Suggestions; 