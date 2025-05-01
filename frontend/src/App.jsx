import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import UserProfile from "./components/UserProfile";

function App() {
	const { authUser } = useAuthContext();
	return (
		<div className='min-h-screen w-full bg-[var(--background)]'>
			<Routes>
				<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
				<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
				<Route path="/users/:userId" element={authUser ? <UserProfile /> : <Navigate to="/login" />} />
			</Routes>
			<Toaster
				position="top-right"
				toastOptions={{
					className: 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]',
					style: {
						background: 'var(--surface)',
						color: 'var(--text)',
						border: '1px solid var(--border)',
					},
				}}
			/>
		</div>
	);
}

export default App;
