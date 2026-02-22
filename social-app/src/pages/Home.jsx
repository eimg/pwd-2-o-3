import { Box } from "@mui/material";
import Post from "../components/Post";

import { useQuery } from "@tanstack/react-query";

const api = "http://localhost:8800/posts";

export default function Home() {
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

    if(isLoading) {
        return <Box>Loading...</Box>;
    }

    if (error) {
		return <Box>{error.message}</Box>;
	}

	return (
		<div>
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
