import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation.profilePic;
	const profileLetters = fromMe ? authUser.fullName[0] : selectedConversation.fullName[0];
	const bubbleColor = fromMe
		? "bg-[var(--primary)]"
		: "bg-[var(--surface)] border border-[var(--border)]";
	const textColor = fromMe ? "text-white" : "text-[var(--text)]";

	return (
		<div className={`chat ${chatClassName} message-item`}>
			<div className="chat-image avatar">
				<div className="w-10 h-10 rounded-full overflow-hidden">
					{profilePic ? (
						<img
							src={profilePic}
							alt={`${fromMe ? authUser.fullName : selectedConversation.fullName}'s avatar`}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full bg-[var(--primary)] bg-opacity-5 ring-1 ring-[var(--primary)] ring-opacity-10 flex items-center justify-center">
							<span className="text-[var(--primary)] font-semibold text-xs">
								{profileLetters.toUpperCase()}
							</span>
						</div>
					)}
				</div>
			</div>
			<div className={`chat-bubble ${bubbleColor} ${textColor} transition-all duration-300 hover:shadow-md shadow-sm`}>
				{message.message}
			</div>
			<div className="chat-footer opacity-70 text-xs flex gap-1 items-center text-[var(--text-secondary)]">
				{formattedTime}
			</div>
		</div>
	);
};

export default Message;

