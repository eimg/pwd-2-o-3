import Post from "@/components/post";
import { ScrollView, View, Text } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/types/global";

const api = "http://localhost:8800/posts";

async function fetchPosts(): Promise<PostType[]> {
    const res = await fetch(api);
    return res.json();
}

export default function Home() {
    const { data: posts, isLoading, error } = useQuery({
        "queryKey": ["posts"],
        "queryFn": fetchPosts,
    });

    if(isLoading) {
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
                return <Post key={post.id} post={post} />
            })}
		</ScrollView>
	);
}
