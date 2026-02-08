import { Box, Button, OutlinedInput } from "@mui/material";
import Post from "../components/Post";
import Comment from "../components/Comment";

export default function View() {
	return (
		<div>
			<Post />

			<Box sx={{ my: 2 }}>
				<form>
					<OutlinedInput
						placeholder="your reply..."
						fullWidth
						sx={{ mb: 1 }}
					/>
					<Button variant="contained" fullWidth>Add Comment</Button>
				</form>
			</Box>

			<Comment />
			<Comment />
			<Comment />
		</div>
	);
}
