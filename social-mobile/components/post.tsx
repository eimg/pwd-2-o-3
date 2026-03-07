import { PostType } from "@/types/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useApp } from "./app-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiURL } from "@/configs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function Post({ post }: { post: PostType }) {
	const { user } = useApp();
	const queryClient = useQueryClient();
	
	// Local state for optimistic updates
	const [isLiking, setIsLiking] = useState(false);
	const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);

	const deletePost = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (!token) {
				Alert.alert("Error", "You must be logged in to delete posts");
				return;
			}

			const response = await fetch(`${apiURL}/posts/${post.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				// Refresh the posts list
				queryClient.invalidateQueries({ queryKey: ["posts"] });
				Alert.alert("Success", "Post deleted successfully");
			} else {
				const errorData = await response.json().catch(() => ({}));
				Alert.alert("Error", errorData.message || "Failed to delete post");
			}
		} catch (error) {
			console.error("Delete post error:", error);
			Alert.alert("Error", "Failed to delete post");
		}
	};

	const confirmDelete = () => {
		Alert.alert(
			"Delete Post",
			"Are you sure you want to delete this post?",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Delete", style: "destructive", onPress: deletePost },
			]
		);
	};

	const isOwner = user && user.id === post.user.id;
	
	// Check if current user has liked this post
	const actualIsLiked = user && post.likes.some(like => like.userId === user.id);
	const isLiked = optimisticLiked !== null ? optimisticLiked : actualIsLiked;
	
	// Calculate optimistic like count
	const getOptimisticLikeCount = () => {
		if (optimisticLiked === null) return post.likes.length;
		
		if (optimisticLiked && !actualIsLiked) {
			return post.likes.length + 1; // Added a like
		} else if (!optimisticLiked && actualIsLiked) {
			return post.likes.length - 1; // Removed a like
		}
		return post.likes.length;
	};

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			
			// Check if date is valid
			if (isNaN(date.getTime())) {
				return dateString; // Return original string if can't parse
			}
			
			// Use date-fns to format relative time
			return formatDistanceToNow(date, { addSuffix: true });
		} catch (error) {
			console.error("Date formatting error:", error);
			return dateString; // Fallback to original string
		}
	};


	const toggleLike = async () => {
		if (!user) {
			Alert.alert("Error", "You must be logged in to like posts");
			return;
		}

		if (isLiking) return; // Prevent multiple clicks

		setIsLiking(true);
		
		// Optimistic update
		setOptimisticLiked(!actualIsLiked);

		try {
			const token = await AsyncStorage.getItem("token");
			if (!token) {
				Alert.alert("Error", "You must be logged in to like posts");
				setOptimisticLiked(null); // Revert optimistic update
				return;
			}

			const response = await fetch(`${apiURL}/likes`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postId: post.id,
				}),
			});

			if (response.ok) {
				// Refresh the posts list to update like count
				queryClient.invalidateQueries({ queryKey: ["posts"] });
				queryClient.invalidateQueries({ queryKey: ["post", post.id.toString()] });
				
				// Reset optimistic state after successful update
				setTimeout(() => setOptimisticLiked(null), 500);
			} else {
				const errorData = await response.json().catch(() => ({}));
				Alert.alert("Error", errorData.message || "Failed to toggle like");
				// Revert optimistic update on error
				setOptimisticLiked(null);
			}
		} catch (error) {
			console.error("Toggle like error:", error);
			Alert.alert("Error", "Failed to toggle like");
			// Revert optimistic update on error
			setOptimisticLiked(null);
		} finally {
			setIsLiking(false);
		}
	};
	return (
		<View
			style={{
				backgroundColor: "white",
				paddingHorizontal: 16,
				paddingVertical: 24,
				borderBottomWidth: 1,
				borderBottomColor: "#99999950",
			}}>
			<View style={{ flexDirection: "row", gap: 14 }}>
				<View
					style={{
						width: 48,
						height: 48,
						borderRadius: 48,
						backgroundColor: "green",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Text style={{ color: "white" }}>{post.user.name[0]}</Text>
				</View>
				<View style={{ flexShrink: 1, flex: 1 }}>
					<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
						<View>
							<Text style={{ fontWeight: "bold", fontSize: 18 }}>
								{post.user.name}
							</Text>
							<Text style={{ color: "green", fontSize: 14 }}>{formatDate(post.createAt)}</Text>
						</View>
						{isOwner && (
							<TouchableOpacity
								onPress={confirmDelete}
								style={{ padding: 8 }}>
								<Ionicons
									name="trash-outline"
									size={20}
									color="red"
								/>
							</TouchableOpacity>
						)}
					</View>
					<TouchableOpacity
						onPress={() => router.push(`/view/${post.id}`)}>
						<Text style={{ marginTop: 5, fontSize: 16 }}>
							{post.content}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View
				style={{
					flexDirection: "row",
					marginTop: 20,
					alignItems: "center",
					justifyContent: "space-around",
				}}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 8,
					}}>
					<TouchableOpacity 
						onPress={toggleLike}
						disabled={isLiking}
						style={{ opacity: isLiking ? 0.6 : 1 }}>
						<Ionicons
							name={isLiked ? "heart" : "heart-outline"}
							color="red"
							size={24}
						/>
					</TouchableOpacity>
					<Text>{getOptimisticLikeCount()}</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 8,
					}}>
					<TouchableOpacity>
						<Ionicons
							name="chatbubble-outline"
							color="#999999"
							size={24}
						/>
					</TouchableOpacity>
					<Text>{post.comments.length}</Text>
				</View>
			</View>
		</View>
	);
}
