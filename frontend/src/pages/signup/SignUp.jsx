import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-[400px] h-fit">
				<div className="card">
					<div className="text-center mb-6">
						<h1 className="text-2xl font-bold text-[var(--text)]">Create Account</h1>
						<p className="text-[var(--text-secondary)] mt-1">Sign up to get started</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="fullName" className="block text-sm font-medium text-[var(--text)] mb-1.5">
								Full Name
							</label>
							<input
								id="fullName"
								type="text"
								autoComplete="name"
								required
								placeholder="John Doe"
								className="input-field w-full"
								value={inputs.fullName}
								onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
							/>
						</div>

						<div>
							<label htmlFor="username" className="block text-sm font-medium text-[var(--text)] mb-1.5">
								Username
							</label>
							<input
								id="username"
								type="text"
								autoComplete="username"
								required
								placeholder="johndoe"
								className="input-field w-full"
								value={inputs.username}
								onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-[var(--text)] mb-1.5">
								Password
							</label>
							<input
								id="password"
								type="password"
								autoComplete="new-password"
								required
								placeholder="••••••••"
								className="input-field w-full"
								value={inputs.password}
								onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							/>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text)] mb-1.5">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								placeholder="••••••••"
								className="input-field w-full"
								value={inputs.confirmPassword}
								onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-[var(--text)] mb-1.5">
								Gender
							</label>
							<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
						</div>

						<button type="submit" className="btn-primary w-full" disabled={loading}>
							{loading ? (
								<div className="flex items-center justify-center gap-2">
									<div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
									Creating account...
								</div>
							) : (
								"Sign up"
							)}
						</button>
					</form>

					<div className="mt-6 text-center text-sm">
						<span className="text-[var(--text-secondary)]">Already have an account? </span>
						<Link to="/login" className="text-[var(--primary)] hover:underline font-medium">
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;

// STARTER CODE FOR THE SIGNUP COMPONENT
// import GenderCheckbox from "./GenderCheckbox";

// const SignUp = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Sign Up <span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Full Name</span>
// 						</label>
// 						<input type='text' placeholder='John Doe' className='w-full input input-bordered  h-10' />
// 					</div>

// 					<div>
// 						<label className='label p-2 '>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='johndoe' className='w-full input input-bordered h-10' />
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Enter Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Confirm Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Confirm Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>

// 					<GenderCheckbox />

// 					<a className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block' href='#'>
// 						Already have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2 border border-slate-700'>Sign Up</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default SignUp;
