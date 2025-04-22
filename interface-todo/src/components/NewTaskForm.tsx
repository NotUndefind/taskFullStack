import { useState } from "react";
import { Box, Input, Button, Textarea, Stack } from "@chakra-ui/react";

const NewTaskForm = ({ onTaskCreated }: { onTaskCreated: () => void }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		fetch("http://localhost:8000/task/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title,
				description,
				status: false,
			}),
		})
			.then((res) => {
				if (!res.ok) throw new Error("Erreur de création");
				return res.json();
			})
			.then(() => {
				setTitle("");
				setDescription("");
				onTaskCreated(); // re-fetch la liste des tâches
			})
			.catch((err) => console.error("Erreur API :", err));
	};

	return (
		<Box borderWidth="1px" p="4" rounded="xl" mb="6">
			<form onSubmit={handleSubmit}>
				<Stack>
					<Input
						placeholder="Titre de la tâche"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					<Textarea
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<Button colorScheme="teal" type="submit">
						Créer la tâche
					</Button>
				</Stack>
			</form>
		</Box>
	);
};

export default NewTaskForm;
