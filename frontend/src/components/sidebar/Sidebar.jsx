import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
import ProfilePopout from "./ProfilePopout";
import Suggestions from "./Suggestions";

const Sidebar = () => {
	const { authUser } = useAuthContext();
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const handleProfileClick = (e) => {
		e.preventDefault();
		setIsProfileOpen(true);
	};

	return (
		<div className="h-full flex flex-col border-r border-[var(--border)] bg-gradient-to-b from-[var(--surface)] via-[var(--background)] to-[var(--surface)]">
			<div className="p-4 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl sticky top-0 z-10">
				<button
					className="w-full flex items-center gap-3 mb-4 p-2 rounded-xl bg-[var(--primary)]/5 backdrop-blur-sm border border-[var(--primary)]/10 transition-all duration-300 hover:bg-[var(--primary)]/10 cursor-pointer"
					onClick={handleProfileClick}
					type="button"
				>
					<div className="relative">
						<div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[var(--primary)]/20 transition-all duration-300 group-hover:ring-[var(--primary)]/40">
							{authUser?.profilePic ? (
								<img
									src={authUser.profilePic}
									alt={`${authUser.fullName}'s avatar`}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full bg-[var(--primary)]/10 flex items-center justify-center">
									<span className="text-[var(--primary)] font-semibold text-lg">
										{authUser?.fullName[0].toUpperCase()}
									</span>
								</div>
							)}
						</div>
						<div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--surface)] animate-pulse"></div>
					</div>
					<div className="flex-1 min-w-0 text-left">
						<h2 className="font-semibold text-[var(--text)] truncate">{authUser?.fullName}</h2>
						<p className="text-xs text-[var(--primary)] font-medium">Online</p>
					</div>
				</button>
				<div className="relative">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)]/5 to-transparent animate-shine"></div>
					<SearchInput />
				</div>
			</div>

			<div className="flex-1 overflow-y-auto custom-scrollbar">
				<div className="p-2">
					<h3 className="text-sm font-semibold text-[var(--text-secondary)] px-2 py-1">Recent Conversations</h3>
					<Conversations />
				</div>
				<Suggestions />
			</div>

			<div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl sticky bottom-0 z-10">
				<LogoutButton />
			</div>
			<ProfilePopout isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
		</div>
	);
};

export default Sidebar;

// Add this to your global CSS (index.css)
/*
.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: var(--primary) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
	width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background-color: var(--primary);
	border-radius: 20px;
	border: 2px solid transparent;
}

@keyframes shine {
	from {
		transform: translateX(-100%);
	}
	to {
		transform: translateX(100%);
	}
}

.animate-shine {
	animation: shine 3s infinite;
	opacity: 0.5;
}
*/
