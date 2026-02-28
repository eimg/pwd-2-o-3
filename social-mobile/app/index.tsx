import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Home() {
	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text
				style={{ fontWeight: "bold", fontSize: 18, marginBottom: 20 }}>
				Hello ReactNative
			</Text>
			<Link href={"/profile"}>Profile</Link>
		</View>
	);
}
