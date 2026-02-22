import { Box, Button, OutlinedInput } from "@mui/material";

import Post from "../components/Post";
import Comment from "../components/Comment";

import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

const api = "http://localhost:8800/posts";

export default function View() {
	const { id } = useParams();

	const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["post", id],
		queryFn: async () => {
			const res = await fetch(`${api}/${id}`);
			return res.json();
		},
	});

	if (isLoading) {
		return <Box>Loading...</Box>;
	}

	if (error) {
		return <Box>{error.message}</Box>;
	}

	return (
		<div>
			<Post post={post} />

			<Box sx={{ my: 2 }}>
				<form>
					<OutlinedInput
						placeholder="your reply..."
						fullWidth
						sx={{ mb: 1 }}
					/>
					<Button
						variant="contained"
						fullWidth>
						Add Comment
					</Button>
				</form>
			</Box>

			{post.comments.map(comment => {
				return (
					<Comment
						key={comment.id}
						comment={comment}
					/>
				);
			})}
		</div>
	);
}
