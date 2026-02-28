import { Box, Button, OutlinedInput } from "@mui/material";

import Post from "../components/Post";
import Comment from "../components/Comment";

import { useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useApp } from "../AppProvider";

const api = "http://localhost:8800/posts";
const commentApi = "http://localhost:8800/comments";

export default function View() {
	const { id } = useParams();
	const commentRef = useRef(null);
	const queryClient = useQueryClient();
	const { auth } = useApp();

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

			{auth && (
				<Box sx={{ my: 2 }}>
					<form
						onSubmit={async e => {
							e.preventDefault();
							const content = commentRef.current.value;
							if (!content) return false;

							const token = localStorage.getItem('token');

							const res = await fetch(commentApi, {
								method: 'POST',
								body: JSON.stringify({ content, postId: id }),
								headers: {
									'Content-Type': 'application/json',
									'Authorization': `Bearer ${token}`,
								},
							});

							if (res.ok) {
								queryClient.invalidateQueries({ queryKey: ['post', id] });
								e.currentTarget.reset();
							}
						}}>
						<OutlinedInput
							placeholder="your reply..."
							fullWidth
							sx={{ mb: 1 }}
							inputRef={commentRef}
						/>
						<Button
							type="submit"
							variant="contained"
							fullWidth>
							Add Comment
						</Button>
					</form>
				</Box>
			)}

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
