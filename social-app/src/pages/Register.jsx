import { Alert, Button, OutlinedInput, Typography } from "@mui/material";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const api = "http://localhost:8800/users";

export default function Register() {
	const [error, setError] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const create = async data => {
		const res = await fetch(api, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			navigate("/login");
		} else {
			setError(true);
		}
	};

	return (
		<div>
			<Typography
				variant="h4"
				sx={{ mb: 3 }}>
				Register
			</Typography>

			{error && <Alert severity="warning">Unable to create user</Alert>}

			<form onSubmit={handleSubmit(create)}>
				<OutlinedInput
					{...register("name", { required: true })}
					sx={{ mt: 2 }}
					placeholder="name"
					fullWidth
				/>
				{errors.name && (
					<Typography color="error">name is required</Typography>
				)}

				<OutlinedInput
					{...register("username", { required: true })}
					sx={{ mt: 2 }}
					placeholder="username"
					fullWidth
				/>
				{errors.username && (
					<Typography color="error">username is required</Typography>
				)}

				<OutlinedInput
					{...register("bio", { required: true })}
					sx={{ mt: 2 }}
					placeholder="bio"
					fullWidth
				/>
				{errors.bio && (
					<Typography color="error">bio is required</Typography>
				)}

				<OutlinedInput
					{...register("password", { required: true })}
					type="password"
					sx={{ mt: 2 }}
					placeholder="password"
					fullWidth
				/>
				{errors.password && (
					<Typography color="error">password is required</Typography>
				)}

				<Button
					type="submit"
					variant="contained"
					fullWidth
					sx={{ mt: 2 }}>
					Register
				</Button>
			</form>
		</div>
	);
}
