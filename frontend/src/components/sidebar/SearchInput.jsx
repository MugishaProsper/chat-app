import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search) return;
		if (search.length < 3) {
			return toast.error("Search term must be at least 3 characters long");
		}

		const conversation = conversations.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

		if (conversation) {
			setSelectedConversation(conversation);
			setSearch("");
		} else toast.error("No such user found!");
	};

	return (
		<form onSubmit={handleSubmit} className="relative group">
			<input
				type="text"
				placeholder="Search users..."
				className="w-full bg-[var(--surface)]/50 backdrop-blur-sm border border-[var(--border)] rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 ring-[var(--primary)]/20 text-[var(--text)] placeholder-[var(--text-secondary)] transition-all duration-300"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<IoSearchSharp className="w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--primary)] transition-colors duration-300" />
			</div>
			{search && (
				<button
					type="button"
					onClick={() => setSearch("")}
					className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			)}
		</form>
	);
};

export default SearchInput;

// STARTER CODE SNIPPET
// import { IoSearchSharp } from "react-icons/io5";

// const SearchInput = () => {
// 	return (
// 		<form className='flex items-center gap-2'>
// 			<input type='text' placeholder='Search…' className='input input-bordered rounded-full' />
// 			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
// 				<IoSearchSharp className='w-6 h-6 outline-none' />
// 			</button>
// 		</form>
// 	);
// };
// export default SearchInput;
