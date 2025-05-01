import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const checkUser = async () => {
			try {
				const res = await fetch("/api/auth/me", {
					credentials: "include", // Important for cookies
				});

				if (res.ok) {
					const data = await res.json();
					setAuthUser(data);
					console.log("Auth user loaded:", data);
				} else {
					console.log("No authenticated user found");
					setAuthUser(null);
				}
			} catch (error) {
				console.error("Error loading auth user:", error);
				setAuthUser(null);
			} finally {
				setLoading(false);
			}
		};

		checkUser();
	}, []);

	const login = async (userData) => {
		try {
			setAuthUser(userData);
			console.log("User logged in:", userData);
			toast.success("Logged in successfully");
		} catch (error) {
			console.error("Error during login:", error);
			toast.error("Failed to login");
		}
	};

	const logout = async () => {
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include", // Important for cookies
			});

			if (res.ok) {
				setAuthUser(null);
				console.log("User logged out");
				toast.success("Logged out successfully");
			} else {
				throw new Error("Failed to logout");
			}
		} catch (error) {
			console.error("Error during logout:", error);
			toast.error("Failed to logout");
		}
	};

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser, login, logout, loading }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};
