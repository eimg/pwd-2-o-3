import { CommentType } from "@/types/global";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useApp } from "./app-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiURL } from "@/configs/api";
import { useQueryClient } from "@tanstack/react-query";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CommentCard({ 
	comment, 
	postId 
}: { 
	comment: CommentType;
	postId?: string;
}) {
	const { user } = useApp();
	const queryClient = useQueryClient();

	const deleteComment = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (!token) {
				Alert.alert("Error", "You must be logged in to delete comments");
				return;
			}

			const response = await fetch(`${apiURL}/comments/${comment.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				// Refresh the post to update comments
				if (postId) {
					queryClient.invalidateQueries({ queryKey: ["post", postId] });
				}
				queryClient.invalidateQueries({ queryKey: ["posts"] });
				Alert.alert("Success", "Comment deleted successfully");
			} else {
				const errorData = await response.json().catch(() => ({}));
				Alert.alert("Error", errorData.message || "Failed to delete comment");
			}
		} catch (error) {
			console.error("Delete comment error:", error);
			Alert.alert("Error", "Failed to delete comment");
		}
	};

	const confirmDelete = () => {
		Alert.alert(
			"Delete Comment",
			"Are you sure you want to delete this comment?",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Delete", style: "destructive", onPress: deleteComment },
			]
		);
	};

	const isOwner = user && user.id === comment.user.id;
	return (
		<View
			style={{
				paddingHorizontal: 16,
				paddingVertical: 24,
				borderBottomWidth: 1,
				borderBottomColor: "#99999950",
			}}>
			<View style={{ flexDirection: "row", gap: 14 }}>
				<View
					style={{
						width: 42,
						height: 42,
						borderRadius: 48,
						backgroundColor: "#999999",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Text style={{ color: "white" }}>{comment.user.name[0]}</Text>
				</View>
				<View style={{ flexShrink: 1, flex: 1 }}>
					<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
						<Text style={{ fontWeight: "bold", fontSize: 18 }}>
							{comment.user.name}
						</Text>
						{isOwner && (
							<TouchableOpacity
								onPress={confirmDelete}
								style={{ padding: 8 }}>
								<Ionicons
									name="trash-outline"
									size={18}
									color="red"
								/>
							</TouchableOpacity>
						)}
					</View>
					<Text style={{ marginTop: 5, fontSize: 16 }}>
						{comment.content}
					</Text>
				</View>
			</View>
		</View>
	);
}
