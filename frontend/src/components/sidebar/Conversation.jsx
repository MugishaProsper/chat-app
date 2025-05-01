import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import useFollowUser from "../../hooks/useFollowUser";
import useGetSuggestions from "../../hooks/useGetSuggestions";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";

const Conversation = ({ conversation, isSelected, onSelect }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const isSelectedConversation = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);
	const navigate = useNavigate();
	const { authUser } = useAuthContext();
	const { loading, followUser, unfollowUser } = useFollowUser();
	const { getSuggestions } = useGetSuggestions();
	const isFollowed = authUser.following?.includes(conversation._id);

	const handleConversationClick = () => {
		setSelectedConversation(conversation);
		onSelect(conversation._id);
	};

	const handleProfileClick = (e) => {
		e.stopPropagation();
		navigate(`/users/${conversation._id}`);
	};

	const handleFollowClick = async (e) => {
		e.stopPropagation();
		if (isFollowed) {
			await unfollowUser(conversation._id);
		} else {
			await followUser(conversation._id);
		}
		// Refresh suggestions after following/unfollowing
		getSuggestions();
	};

	const unreadCount = conversation.unreadCount || 0;

	return (
		<div
			className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-[var(--primary)] hover:bg-opacity-5 transition-colors ${isSelectedConversation ? "bg-[var(--primary)] bg-opacity-10" : ""
				}`}
			onClick={handleConversationClick}
		>
			<div className="relative">
				<img
					src={conversation.profilePic || "/default-profile.png"}
					alt={conversation.fullName}
					className="w-10 h-10 rounded-full object-cover"
				/>
				{conversation.isOnline && (
					<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between">
					<h3
						className="font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
						onClick={handleProfileClick}
					>
						{conversation.fullName}
					</h3>
					{!isFollowed && (
						<button
							className="p-1 rounded-full hover:bg-[var(--primary)] hover:bg-opacity-10 transition-colors"
							onClick={handleFollowClick}
							disabled={loading}
						>
							<IoPersonAddOutline className="w-5 h-5 text-[var(--primary)]" />
						</button>
					)}
				</div>
				{conversation.unreadCount > 0 && (
					<div className="flex items-center justify-between">
						<p className="text-sm text-[var(--text-secondary)]">
							{conversation.lastMessage}
						</p>
						<span className="bg-[var(--primary)] text-white text-xs px-2 py-1 rounded-full">
							{conversation.unreadCount}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Conversation;

// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;
