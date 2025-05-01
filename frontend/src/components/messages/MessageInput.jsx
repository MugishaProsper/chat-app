import { useState } from "react";
import useSendMessage from "../../hooks/useSendMessage";
import { FiSend } from "react-icons/fi";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { sendMessage, loading } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="flex items-center gap-2">
				<input
					type="text"
					className="input-field flex-1 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-[var(--primary)]/20"
					placeholder="Type a message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button
					type="submit"
					disabled={loading || !message.trim()}
					className={`btn-primary flex items-center justify-center w-10 h-10 p-0 transition-all duration-300
						${!message.trim() ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
				>
					{loading ? (
						<span className="loading loading-spinner loading-sm"></span>
					) : (
						<FiSend className="w-5 h-5" />
					)}
				</button>
			</div>
		</form>
	);
};

export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;
