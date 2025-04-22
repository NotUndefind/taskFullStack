import "./App.css";
import NavBar from "./components/navBar";
import { Box, Container } from "@chakra-ui/react";
import ItemList from "./components/itemList";
import NewTaskForm from "./components/NewTaskForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Container
				centerContent={true}
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				height={"100vh"}
			>
				<Box
					width={"700px"}
					padding={"4"}
					display={"flex"}
					flexDirection={"column"}
					gap={"4"}
				>
					<NavBar />
					<Routes>
						<Route path="/" element={<ItemList />} />
						<Route
							path="/new"
							element={
								<NewTaskForm
									onTaskCreated={() =>
										(window.location.href = "/")
									}
								/>
							}
						/>
					</Routes>
				</Box>
			</Container>
		</BrowserRouter>
	);
}

export default App;
