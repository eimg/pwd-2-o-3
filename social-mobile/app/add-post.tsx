import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { apiURL } from "@/configs/api";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/components/app-provider";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddPost() {
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();
	const { user } = useApp();

	useEffect(() => {
		if (!user) {
			Alert.alert("Error", "You must be logged in to create posts", [
				{ text: "OK", onPress: () => router.replace("/") }
			]);
		}
	}, [user]);

	const addPost = async () => {
		if (!content.trim()) {
			Alert.alert("Error", "Please enter some content for your post");
			return;
		}

		if (!user) {
			Alert.alert("Error", "You must be logged in to create posts");
			return;
		}

		setIsSubmitting(true);
		try {
			const api = `${apiURL}/posts`;
			const token = await AsyncStorage.getItem("token");

			if (!token) {
				Alert.alert("Error", "You must be logged in to create posts");
				return;
			}

			const res = await fetch(api, {
				method: "POST",
				body: JSON.stringify({ content: content.trim() }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.ok) {
				router.replace("/");
				queryClient.invalidateQueries({ queryKey: ["posts"] });
				Alert.alert("Success", "Post created successfully");
			} else {
				const errorData = await res.json().catch(() => ({}));
				Alert.alert("Error", errorData.message || "Failed to add post");
			}
		} catch (error) {
			console.error("Add post error:", error);
			Alert.alert("Error", "Failed to add post");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "flex-start",
				alignItems: "center",
				gap: 10,
				paddingTop: 30,
			}}>
			<TextInput
				placeholder="What's on your mind?"
				value={content}
				onChangeText={setContent}
				multiline
				numberOfLines={4}
				style={{
					borderWidth: 1,
					borderColor: "#66666650",
					padding: 15,
					borderRadius: 20,
					width: "80%",
					minHeight: 100,
					textAlignVertical: "top",
				}}
			/>
			<TouchableOpacity
				onPress={addPost}
				disabled={isSubmitting || !content.trim()}
				style={{
					backgroundColor: isSubmitting || !content.trim() ? "#cccccc" : "green",
					padding: 15,
					borderRadius: 20,
					alignItems: "center",
					justifyContent: "center",
					width: "80%",
				}}>
				<Text
					style={{
						color: "white",
						fontWeight: "bold",
						fontSize: 16,
					}}>
					{isSubmitting ? "Creating..." : "Create Post"}
				</Text>
			</TouchableOpacity>
		</View>
	);
}
