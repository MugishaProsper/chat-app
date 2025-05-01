import { useEffect, useState } from "react";
import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversations";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	const { onlineUsers } = useSocketContext();
	const { authUser } = useAuthContext();
	const [searchTerm, setSearchTerm] = useState("");

	// Filter conversations based on search term (only among followed users)
	const filteredConversations = conversations?.filter((conversation) => {
		const fullNameMatch = conversation.fullName.toLowerCase().includes(searchTerm.toLowerCase());
		const usernameMatch = conversation.username.toLowerCase().includes(searchTerm.toLowerCase());
		return fullNameMatch || usernameMatch;
	});

	return (
		<div className="py-2 flex flex-col overflow-auto">
			<div className="px-4 mb-2">
				<input
					type="text"
					placeholder="Search your conversations..."
					className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-32">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
				</div>
			) : filteredConversations?.length === 0 ? (
				<div className="text-center text-gray-400 py-4">
					{searchTerm ? (
						<div className="space-y-2">
							<p>No conversations found matching "{searchTerm}"</p>
							<p className="text-sm">Try searching for a different name or username</p>
						</div>
					) : (
						<div className="space-y-2">
							<p>No conversations yet</p>
							<p className="text-sm">Follow users to start chatting!</p>
						</div>
					)}
				</div>
			) : (
				<div className="flex flex-col">
					{filteredConversations?.map((conversation) => (
						<Conversation
							key={conversation._id}
							conversation={conversation}
						/>
					))}
				</div>
			)}
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
