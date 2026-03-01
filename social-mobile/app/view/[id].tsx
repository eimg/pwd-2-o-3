import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ViewPost() {
	const { id } = useLocalSearchParams();

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontWeight: "bold", fontSize: 18 }}>View {id}</Text>
		</View>
	);
}
