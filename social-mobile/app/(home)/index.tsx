import Post from "@/components/post";
import { ScrollView, View, Text, Platform } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/types/global";

import { apiURL } from "@/configs/api";

async function fetchPosts(): Promise<PostType[]> {
	const res = await fetch(`${apiURL}/posts`);
	return res.json();
}

export default function Home() {
	const {
		data: posts,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
	});

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Text>{error.message}</Text>
			</View>
		);
	}

	return (
		<ScrollView>
			{posts?.map(post => {
				return (
					<Post
						key={post.id}
						post={post}
					/>
				);
			})}
		</ScrollView>
	);
}
