import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../utils/formatTime";
import { IoChatbubbleEllipses } from "react-icons/io5";

const Conversation = ({ conversation }) => {
	const { authUser } = useAuthContext();
	const { onlineUsers } = useSocketContext();
	const { setSelectedConversation, selectedConversation } = useConversation();
	const isOnline = onlineUsers.includes(conversation._id);
	const isActive = selectedConversation?._id === conversation._id;
	const navigate = useNavigate();

	const handleConversationClick = () => {
		if (conversation.conversationId) {
			setSelectedConversation(conversation);
		} else {
			// If no conversation exists yet, navigate to profile
			navigate(`/users/${conversation._id}`);
		}
	};

	const handleProfileClick = (e) => {
		e.stopPropagation();
		navigate(`/users/${conversation._id}`);
	};

	return (
		<div
			className={`group flex gap-3 items-start p-3 py-2 cursor-pointer transition-all duration-200 ${isActive
				? "bg-[var(--primary)]/10"
				: "hover:bg-[var(--primary)]/5"
				}`}
			onClick={handleConversationClick}
		>
			<div
				className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
				onClick={handleProfileClick}
			>
				<div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[var(--primary)]/20 group-hover:ring-[var(--primary)]/40 transition-all duration-200">
					{conversation.profilePic ? (
						<img
							src={conversation.profilePic}
							alt={`${conversation.fullName}'s avatar`}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full bg-[var(--primary)]/10 flex items-center justify-center">
							<span className="text-[var(--primary)] font-semibold text-lg">
								{conversation.fullName[0].toUpperCase()}
							</span>
						</div>
					)}
				</div>
				{isOnline && (
					<div className="absolute bottom-0 right-0 w-3.5 h-3.5">
						<span className="absolute w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
						<span className="absolute w-3.5 h-3.5 bg-emerald-500 rounded-full animate-ping opacity-75"></span>
					</div>
				)}
			</div>

			<div className="flex flex-col flex-1 min-w-0">
				<div className="flex justify-between items-center mb-1">
					<h3 className={`font-semibold truncate ${isActive ? "text-[var(--primary)]" : "text-[var(--text)]"
						}`}>
						{conversation.fullName}
					</h3>
					<span className={`text-xs ${isActive ? "text-[var(--primary)]/80" : "text-[var(--text-secondary)]"
						}`}>
						{conversation.lastMessageTime ? formatTime(conversation.lastMessageTime) : ''}
					</span>
				</div>

				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						{!conversation.conversationId && (
							<IoChatbubbleEllipses className="w-4 h-4 text-[var(--primary)]/60" />
						)}
						<p className={`text-sm truncate max-w-[200px] ${isActive ? "text-[var(--primary)]/80" : "text-[var(--text-secondary)]"
							}`}>
							{conversation.lastMessage || "No messages yet"}
						</p>
					</div>
					{conversation.unreadCount > 0 && (
						<span className={`ml-2 text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center ${isActive
							? "bg-[var(--primary)] text-white"
							: "bg-[var(--primary)]/10 text-[var(--primary)]"
							}`}>
							{conversation.unreadCount}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default Conversation;