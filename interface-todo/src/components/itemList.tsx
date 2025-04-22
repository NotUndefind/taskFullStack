import { For, Stack, Text, Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Task = {
	id: number;
	title: string;
	description: string;
	status: boolean;
};

const itemList = () => {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		fetch("http://localhost:8000/task", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error("Erreur de chargement");
				}
				return res.json();
			})
			.then((data) => {
				setTasks(data);
			})
			.catch((err) => {
				console.error("Erreur API :", err);
			});
	}, []);

	return (
		<Stack>
			{tasks.map((task) => (
				<Box borderWidth="1px" key={task.id} p="4" rounded="xl">
					<Text fontWeight="bold">{task.title}</Text>
					<Box display="flex" justifyContent="space-between">
						<Box>
							<Text>Description: {task.description}</Text>
							<Text>
								Status: {task.status ? "Validée" : "En attente"}
							</Text>
						</Box>
						<Box className="flex gap-2">
							<Button
								onClick={() => checkedTask(task.id)}
								colorScheme="green"
							>
								Valider
							</Button>
							<Button
								onClick={() => modifyTask(task.id)}
								colorScheme="blue"
							>
								Modifier
							</Button>
							<Button
								onClick={() => deleteTask(task.id)}
								colorScheme="red"
							>
								Supprimer
							</Button>
						</Box>
					</Box>
				</Box>
			))}
		</Stack>
	);
};
export default itemList;

function checkedTask(id: number) {
	fetch(`http://localhost:8000/task/${id}/validate`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error("Erreur de chargement");
			}
			return res.json();
		})
		.then(() => {
			window.location.reload();
		})
		.catch((err) => {
			console.error("Erreur API :", err);
		});
}

function deleteTask(id: number) {
	fetch(`http://localhost:8000/task/${id}/delete`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error("Erreur de suppression");
			}
			return res.json();
		})
		.then(() => {
			window.location.reload(); // ou idéalement : re-fetch les tâches
		})
		.catch((err) => {
			console.error("Erreur API :", err);
		});
}

function modifyTask(id: number) {
	fetch(`http://localhost:8000/task/${id}/modify`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			title: "Titre modifié",
			description: "Description modifiée",
			status: false, // ou true selon le besoin
		}),
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error("Erreur de modification");
			}
			return res.json();
		})
		.then(() => {
			window.location.reload();
		})
		.catch((err) => {
			console.error("Erreur API :", err);
		});
}
