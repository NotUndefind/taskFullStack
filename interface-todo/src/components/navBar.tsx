import { Link } from "react-router-dom";

const NavBar = () => {
	return (
		<nav className="flex flex-row justify-evenly m-4">
			<Link to="/" className="text-blue-500 hover:underline">
				All Task
			</Link>
			<Link to="/new" className="text-blue-500 hover:underline">
				New Task
			</Link>
		</nav>
	);
};

export default NavBar;
