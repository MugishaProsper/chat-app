import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<button
			onClick={logout}
			disabled={loading}
			className="w-full flex items-center justify-center gap-2 bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 text-[var(--primary)] p-2.5 rounded-xl transition-all duration-300 border border-[var(--primary)]/10 hover:border-[var(--primary)]/20 group relative overflow-hidden"
		>
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 animate-shine transition-opacity duration-300"></div>
			{!loading ? (
				<>
					<BiLogOut className="w-5 h-5 transition-transform duration-1000 group-hover:scale-110" />
					<span className="font-medium">Logout</span>
				</>
			) : (
				<span className="loading loading-spinner loading-sm"></span>
			)}
		</button>
	);
};

export default LogoutButton;
