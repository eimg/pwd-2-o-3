import { PostType } from "@/types/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Post({ post }: { post: PostType }) {
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
				<View style={{ flexShrink: 1 }}>
					<Text style={{ fontWeight: "bold", fontSize: 18 }}>
						{post.user.name}
					</Text>
					<Text style={{ color: "green" }}>{post.createdAt}</Text>
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
					<TouchableOpacity>
						<Ionicons
							name="heart-outline"
							color="red"
							size={24}
						/>
					</TouchableOpacity>
					<Text>{post.likes.length}</Text>
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
