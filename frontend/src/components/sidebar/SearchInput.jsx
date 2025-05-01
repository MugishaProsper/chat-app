import { useState, useEffect, useRef, useCallback } from "react";
import { IoSearchSharp, IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import useSearchUsers from "../../hooks/useSearchUsers";
import useFollowUser from "../../hooks/useFollowUser";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const [showResults, setShowResults] = useState(false);
	const { setSelectedConversation } = useConversation();
	const { conversations, getConversations } = useGetConversations();
	const { loading, searchResults, searchUsers } = useSearchUsers();
	const { loading: followLoading, followUser, unfollowUser } = useFollowUser();
	const { authUser } = useAuthContext();
	const navigate = useNavigate();
	const searchRef = useRef(null);
	const debounceTimeout = useRef(null);

	// Handle click outside to close results
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setShowResults(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Debounced search function
	const debouncedSearch = useCallback((searchTerm) => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}

		debounceTimeout.current = setTimeout(() => {
			if (searchTerm.length >= 2) {
				searchUsers(searchTerm);
				setShowResults(true);
			} else {
				setShowResults(false);
			}
		}, 500);
	}, [searchUsers]);

	// Handle input changes
	const handleInputChange = (e) => {
		const newValue = e.target.value;
		setSearch(newValue);
		debouncedSearch(newValue);
	};

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
			setShowResults(false);
		} else {
			toast.error("No such user found!");
		}
	};

	const handleUserClick = async (user) => {
		// Check if there's an existing conversation
		const existingConversation = conversations.find(c => c._id === user._id);

		if (existingConversation) {
			setSelectedConversation(existingConversation);
		} else {
			// If no conversation exists, follow the user to create one
			try {
				await followUser(user._id);
				// Refresh conversations to get the new one
				await getConversations();
				// Find and set the new conversation
				const newConversation = conversations.find(c => c._id === user._id);
				if (newConversation) {
					setSelectedConversation(newConversation);
				}
			} catch (error) {
				toast.error(error.message);
			}
		}

		setSearch("");
		setShowResults(false);
	};

	const handleFollowClick = async (e, user) => {
		e.stopPropagation();
		try {
			if (authUser.following?.includes(user._id)) {
				await unfollowUser(user._id);
				toast.success(`Unfollowed ${user.fullName}`);
			} else {
				await followUser(user._id);
				toast.success(`Followed ${user.fullName}`);
			}
			// Refresh conversations after follow/unfollow
			await getConversations();
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}
		};
	}, []);

	return (
		<div className="relative" ref={searchRef}>
			<form onSubmit={handleSubmit} className="relative group">
				<input
					type="text"
					placeholder="Search users..."
					className="w-full bg-[var(--surface)]/50 backdrop-blur-sm border border-[var(--border)] rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 ring-[var(--primary)]/20 text-[var(--text)] placeholder-[var(--text-secondary)] transition-all duration-300"
					value={search}
					onChange={handleInputChange}
					onFocus={() => search.length >= 2 && setShowResults(true)}
				/>
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<IoSearchSharp className="w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--primary)] transition-colors duration-300" />
				</div>
				{search && (
					<button
						type="button"
						onClick={() => {
							setSearch("");
							setShowResults(false);
						}}
						className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				)}
			</form>

			{/* Search Results Dropdown */}
			{showResults && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
					{loading ? (
						<div className="p-4 text-center">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)] mx-auto"></div>
						</div>
					) : searchResults.length > 0 ? (
						<div className="divide-y divide-[var(--border)]">
							{searchResults.map((user) => {
								const isFollowed = authUser.following?.includes(user._id);
								const hasConversation = conversations.some(c => c._id === user._id);
								return (
									<div
										key={user._id}
										className="flex items-center justify-between p-4 hover:bg-[var(--primary)]/5 transition-colors duration-200"
									>
										<button
											onClick={() => handleUserClick(user)}
											className="flex-1 flex items-center gap-3 text-left"
										>
											<div className="w-10 h-10 rounded-full overflow-hidden">
												{user.profilePic ? (
													<img
														src={user.profilePic}
														alt={user.fullName}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full bg-[var(--primary)]/10 flex items-center justify-center">
														<span className="text-[var(--primary)] font-semibold">
															{user.fullName[0].toUpperCase()}
														</span>
													</div>
												)}
											</div>
											<div>
												<h3 className="font-medium text-[var(--text)]">{user.fullName}</h3>
												<p className="text-sm text-[var(--text-secondary)]">@{user.username}</p>
												{hasConversation && (
													<p className="text-xs text-[var(--primary)]">Existing conversation</p>
												)}
											</div>
										</button>
										{user._id !== authUser._id && (
											<button
												onClick={(e) => handleFollowClick(e, user)}
												disabled={followLoading}
												className={`p-2 rounded-full transition-colors duration-200 ${isFollowed
													? "text-red-500 hover:bg-red-500/10"
													: "text-[var(--primary)] hover:bg-[var(--primary)]/10"
													}`}
											>
												{isFollowed ? (
													<IoPersonRemoveOutline className="w-5 h-5" />
												) : (
													<IoPersonAddOutline className="w-5 h-5" />
												)}
											</button>
										)}
									</div>
								);
							})}
						</div>
					) : search.length >= 2 ? (
						<div className="p-4 text-center text-[var(--text-secondary)]">
							No users found
						</div>
					) : null}
				</div>
			)}
		</div>
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
