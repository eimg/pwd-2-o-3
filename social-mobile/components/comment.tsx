import { CommentType } from "@/types/global";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function CommentCard({ comment }: { comment: CommentType }) {
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
				<View style={{ flexShrink: 1 }}>
					<Text style={{ fontWeight: "bold", fontSize: 18 }}>
						{comment.user.name}
					</Text>
					<TouchableOpacity
						onPress={() => router.push(`/view/${comment.id}`)}>
						<Text style={{ marginTop: 5, fontSize: 16 }}>
							{comment.content}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
