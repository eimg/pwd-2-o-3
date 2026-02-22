import { Alert, Button, OutlinedInput, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";

const api = "http://localhost:8800/users/login";

export default function Login() {
	const [error, setError] = useState(false);
	const navigate = useNavigate();

    const { setAuth } = useApp();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const login = async data => {
		const res = await fetch(api, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(res.ok) {
            const { user, token } = await res.json();
            setAuth(user);
            localStorage.setItem("token", token);
            navigate("/");
        } else {
            setError(true);
        }
	};

	return (
		<div>
			<Typography
				variant="h4"
				sx={{ mb: 3 }}>
				Login
			</Typography>

			{error && <Alert severity="warning">Unable to login</Alert>}

			<form onSubmit={handleSubmit(login)}>
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
					Login
				</Button>
			</form>
		</div>
	);
}
