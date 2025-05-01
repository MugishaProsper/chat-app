import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversations";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";

const Conversations = () => {
	const { loading, conversations = [] } = useGetConversations();
	const { onlineUsers } = useSocketContext();
	const { authUser } = useAuthContext();

	if (loading) {
		return (
			<div className="flex flex-col gap-2">
				{[...Array(3)].map((_, idx) => (
					<div key={idx} className="flex items-center gap-2 p-2 rounded-lg animate-pulse">
						<div className="w-10 h-10 rounded-full bg-[var(--primary)]/10"></div>
						<div className="flex-1 space-y-2">
							<div className="h-4 bg-[var(--primary)]/10 rounded w-3/4"></div>
							<div className="h-3 bg-[var(--primary)]/10 rounded w-1/2"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!conversations.length) {
		return (
			<div className="flex items-center justify-center py-4">
				<p className="text-[var(--text-secondary)]">No conversations yet</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{conversations.map((conversation) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					isSelected={conversation._id === authUser?._id}
					onSelect={() => { }}
				/>
			))}
		</div>
	);
};

export default Conversations;

// STARTER CODE SNIPPET
// import Conversation from "./Conversation";

// const Conversations = () => {
// 	return (
// 		<div className='py-2 flex flex-col overflow-auto'>
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 		</div>
// 	);
// };
// export default Conversations;
