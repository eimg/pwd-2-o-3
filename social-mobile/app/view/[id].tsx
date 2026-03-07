import Post from "@/components/post";
import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
    Platform,
	Alert,
} from "react-native";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType } from "@/types/global";
import { useLocalSearchParams } from "expo-router";
import CommentCard from "@/components/comment";
import { useApp } from "@/components/app-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

import { apiURL } from "@/configs/api";

async function fetchPost(id: string): Promise<PostType> {
	const res = await fetch(`${apiURL}/posts/${id}`);
	return res.json();
}

export default function ViewPost() {
	const { id } = useLocalSearchParams();
	const { user } = useApp();
	const queryClient = useQueryClient();
	const [commentText, setCommentText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["post", id],
		queryFn: () => fetchPost(id as string),
	});

	const addComment = async () => {
		if (!commentText.trim()) {
			Alert.alert("Error", "Please enter a comment");
			return;
		}

		if (!user) {
			Alert.alert("Error", "You must be logged in to comment");
			return;
		}

		setIsSubmitting(true);
		try {
			const token = await AsyncStorage.getItem("token");
			if (!token) {
				Alert.alert("Error", "You must be logged in to comment");
				return;
			}

			const response = await fetch(`${apiURL}/comments`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: commentText.trim(),
					postId: parseInt(id as string),
				}),
			});

			if (response.ok) {
				setCommentText("");
				// Refresh the post to show the new comment
				queryClient.invalidateQueries({ queryKey: ["post", id] });
				Alert.alert("Success", "Comment added successfully");
			} else {
				const errorData = await response.json().catch(() => ({}));
				Alert.alert("Error", errorData.message || "Failed to add comment");
			}
		} catch (error) {
			console.error("Add comment error:", error);
			Alert.alert("Error", "Failed to add comment");
		} finally {
			setIsSubmitting(false);
		}
	};

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

			{user && (
				<View style={{ padding: 16, gap: 10 }}>
					<TextInput
						placeholder="Your reply..."
						value={commentText}
						onChangeText={setCommentText}
						multiline
						style={{
							fontSize: 16,
							padding: 15,
							borderWidth: 1,
							borderColor: "#99999960",
							borderRadius: 20,
							backgroundColor: "white",
							minHeight: 50,
							textAlignVertical: "top",
						}}
					/>
					<TouchableOpacity
						onPress={addComment}
						disabled={isSubmitting || !commentText.trim()}
						style={{
							backgroundColor: isSubmitting || !commentText.trim() ? "#cccccc" : "green",
							alignItems: "center",
							justifyContent: "center",
							padding: 15,
							borderRadius: 20,
						}}>
						<Text style={{ color: "white", fontWeight: "bold" }}>
							{isSubmitting ? "Adding..." : "Add Comment"}
						</Text>
					</TouchableOpacity>
				</View>
			)}

			{post?.comments.map(comment => {
				return (
					<CommentCard
						key={comment.id}
						comment={comment}
						postId={id as string}
					/>
				);
			})}
		</ScrollView>
	);
}
