import { Alert, Button, OutlinedInput, Typography } from "@mui/material";

export default function Register() {
	return (
		<div>
			<Typography
				variant="h4"
				sx={{ mb: 3 }}>
				Register
			</Typography>

			<Alert severity="warning">Something went wrong</Alert>

			<form>
				<OutlinedInput
					sx={{ mt: 2 }}
					placeholder="name"
					fullWidth
				/>
				<OutlinedInput
					sx={{ mt: 2 }}
					placeholder="username"
					fullWidth
				/>
				<OutlinedInput
					sx={{ mt: 2 }}
					placeholder="bio"
					fullWidth
				/>
				<OutlinedInput
					type="password"
					sx={{ mt: 2 }}
					placeholder="password"
					fullWidth
				/>
				<Button
					variant="contained"
					fullWidth
					sx={{ mt: 2 }}>
					Register
				</Button>
			</form>
		</div>
	);
}
