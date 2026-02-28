import { Box, OutlinedInput, Button } from "@mui/material";

import Post from "../components/Post";
import { useRef } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";

const api = "http://localhost:8800/posts";

export default function Home() {
	const contentRef = useRef(null);
	const queryClient = useQueryClient();
	const { auth } = useApp();

	const {
		data: posts,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const res = await fetch(api);
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
			{auth && (
				<Box sx={{ mb: 2 }}>
					<form
						onSubmit={async e => {
							e.preventDefault();
							const content = contentRef.current.value;
							if(!content) return false;

							const token = localStorage.getItem('token');

							const res = await fetch(api, {
								method: 'POST',
								body: JSON.stringify({ content }),
								headers: {
									'Content-Type': 'application/json',
									'Authorization': `Bearer ${token}`,
								},
							});

							if(res.ok) {
								queryClient.invalidateQueries({ queryKey: ['posts'] });
							}

							e.currentTarget.reset();
						}}>
						<OutlinedInput
							placeholder="your post..."
							fullWidth
							sx={{ mb: 1 }}
							inputRef={contentRef}
						/>
						<Button
							type="submit"
							variant="contained"
							fullWidth>
							Add Post
						</Button>
					</form>
				</Box>
			)}

			{posts.map(post => {
				return (
					<Post
						key={post.id}
						post={post}
					/>
				);
			})}
		</div>
	);
}
