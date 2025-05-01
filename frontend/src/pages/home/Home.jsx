import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className="flex h-screen">
			<div className="flex-none w-[350px]">
				<Sidebar />
			</div>
			<div className="flex-1">
				<MessageContainer />
			</div>
		</div>
	);
};

export default Home;
