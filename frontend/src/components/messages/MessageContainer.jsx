import { useEffect, useRef } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { authUser } = useAuthContext();
	const messagesContainerRef = useRef(null);

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const scrolled = container.scrollTop;
			const messages = container.querySelectorAll('.message-item');

			messages.forEach((message, index) => {
				const speed = index % 2 === 0 ? 0.02 : 0.01;
				message.style.transform = `translateZ(${scrolled * speed}px)`;
			});
		};

		container.addEventListener('scroll', handleScroll);
		return () => container.removeEventListener('scroll', handleScroll);
	}, [selectedConversation]);

	return (
		<div className="flex flex-col h-full">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					<div className="p-4 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur-sm sticky top-0 z-10 shadow-sm bg-opacity-95">
						<div className="flex items-center gap-2 animate-slideIn">
							<div className="w-10 h-10 rounded-full overflow-hidden">
								{selectedConversation.profilePic ? (
									<img
										src={selectedConversation.profilePic}
										alt={`${selectedConversation.fullName}'s avatar`}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full bg-[var(--primary)] bg-opacity-5 ring-1 ring-[var(--primary)] ring-opacity-10 flex items-center justify-center">
										<span className="text-[var(--primary)] font-semibold text-xs">
											{selectedConversation.fullName[0].toUpperCase()}
										</span>
									</div>
								)}
							</div>
							<div>
								<h2 className="font-semibold text-[var(--text)] text-sm">{selectedConversation.fullName}</h2>
								<p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
									<span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
									Online
								</p>
							</div>
						</div>
					</div>
					<div
						ref={messagesContainerRef}
						className="flex-1 overflow-y-auto"
					>
						<div className="min-h-full p-4 bg-gradient-to-br from-[var(--background)] via-[var(--surface)] to-[var(--background)]">
							<Messages />
						</div>
					</div>
					<div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] backdrop-blur-sm sticky bottom-0 z-10 shadow-sm bg-opacity-95">
						<MessageInput />
					</div>
				</>
			)}
		</div>
	);
};

export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className="flex items-center justify-center h-full bg-gradient-to-br from-[var(--background)] via-[var(--surface)] to-[var(--background)] relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[var(--secondary)]/10 rounded-full blur-3xl animate-pulse delay-300"></div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--primary)]/5 rounded-full blur-3xl animate-pulse delay-700"></div>
			</div>

			{/* Grid pattern overlay */}
			<div className="absolute inset-0" style={{
				backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
				backgroundSize: '40px 40px'
			}}></div>

			{/* Content */}
			<div className="relative max-w-2xl w-full mx-10">
				<div className="p-8 rounded-5xl bg-[var(--surface)]/80 backdrop-blur-xl animate-fadeIn">
					{/* Profile section */}
					<div className="relative">
						<div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-1">
							<div className="w-full h-full rounded-full bg-[var(--surface)] flex items-center justify-center relative overflow-hidden group">
								<div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
								<TiMessages className="text-7xl text-[var(--primary)] transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
							</div>
						</div>
						{/* Decorative rings */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[var(--primary)]/10 rounded-full animate-ping"></div>
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[var(--primary)]/5 rounded-full animate-ping" style={{ animationDelay: '300ms' }}></div>
					</div>

					{/* Welcome text */}
					<div className="mt-12 text-center relative">
						<div className="space-y-4">
							<h2 className="text-2xl font-bold text-[var(--text)] animate-slideIn">
								Welcome {authUser.fullName}! 👋
							</h2>
							<p className="text-xl text-[var(--text-secondary)] animate-slideIn opacity-0" style={{ animationDelay: '200ms' }}>
								Ready to connect? Select a chat to start messaging
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
