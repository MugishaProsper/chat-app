import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();
	const messagesContainerRef = useRef();

	// Scroll to bottom when messages change
	useEffect(() => {
		const scrollToBottom = () => {
			if (lastMessageRef.current) {
				lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
			}
		};

		// Use requestAnimationFrame to ensure the scroll happens after the DOM update
		requestAnimationFrame(() => {
			scrollToBottom();
		});
	}, [messages]);

	// Handle scroll position when new messages are received
	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container) return;

		const isNearBottom = () => {
			const threshold = 100; // pixels from bottom
			return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
		};

		const handleNewMessage = () => {
			if (isNearBottom()) {
				requestAnimationFrame(() => {
					lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
				});
			}
		};

		// Add event listener for new messages
		window.addEventListener("newMessage", handleNewMessage);
		return () => window.removeEventListener("newMessage", handleNewMessage);
	}, []);

	return (
		<div className="flex flex-col gap-4" ref={messagesContainerRef}>
			{!loading && messages.length > 0 && (
				<div className="flex flex-col gap-4">
					{messages.map((message, index) => (
						<div
							key={message._id}
							ref={index === messages.length - 1 ? lastMessageRef : null}
						>
							<Message message={message} />
						</div>
					))}
				</div>
			)}

			{loading && (
				<div className="flex flex-col gap-4">
					{[...Array(3)].map((_, idx) => (
						<MessageSkeleton key={idx} />
					))}
				</div>
			)}

			{!loading && messages.length === 0 && (
				<div className="flex items-center justify-center h-full">
					<div className="text-center space-y-2 animate-fadeIn">
						<p className="text-[var(--text-secondary)]">
							Send a message to start the conversation
						</p>
						<div className="w-8 h-8 mx-auto rounded-full bg-[var(--primary)] bg-opacity-5 flex items-center justify-center">
							<svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Messages;

// STARTER CODE SNIPPET
// import Message from "./Message";

// const Messages = () => {
// 	return (
// 		<div className='px-4 flex-1 overflow-auto'>
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 		</div>
// 	);
// };
// export default Messages;
