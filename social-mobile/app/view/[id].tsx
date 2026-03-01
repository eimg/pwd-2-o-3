import Post from "@/components/post";
import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";

import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/types/global";
import { useLocalSearchParams } from "expo-router";
import CommentCard from "@/components/comment";

const api = "http://localhost:8800/posts";

async function fetchPost(id: string): Promise<PostType> {
	const res = await fetch(`${api}/${id}`);
	return res.json();
}

export default function ViewPost() {
	const { id } = useLocalSearchParams();

	const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["post", id],
		queryFn: () => fetchPost(id as string),
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
			{post && <Post post={post} />}

			<View style={{ padding: 16, gap: 10 }}>
				<TextInput
					placeholder="Your reply..."
					style={{
						fontSize: 16,
						padding: 15,
						borderWidth: 1,
						borderColor: "#99999960",
						borderRadius: 20,
						backgroundColor: "white",
					}}
				/>
				<TouchableOpacity
					style={{
						backgroundColor: "green",
						alignItems: "center",
						justifyContent: "center",
						padding: 15,
						borderRadius: 20,
					}}>
					<Text style={{ color: "white", fontWeight: "bold" }}>
						Add Comment
					</Text>
				</TouchableOpacity>
			</View>

			{post?.comments.map(comment => {
				return (
					<CommentCard
						key={comment.id}
						comment={comment}
					/>
				);
			})}
		</ScrollView>
	);
}
