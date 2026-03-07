import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "@/components/app-provider";

export default function HomeLayout() {
	const { user } = useApp();

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarShowLabel: false,
					tabBarIcon: ({ color }) => {
						return (
							<Ionicons
								color={color}
								size={24}
								name="home"
							/>
						);
					},
					headerRight: () => {
						return user ? (
							<TouchableOpacity
								style={{ marginRight: 10 }}
								onPress={() => router.push("/add-post")}>
								<Ionicons
									name="add"
									size={24}
									color="black"
								/>
							</TouchableOpacity>
						) : null;
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarShowLabel: false,
					tabBarIcon: ({ color }) => {
						return (
							<Ionicons
								color={color}
								size={24}
								name="person"
							/>
						);
					},
				}}
			/>
		</Tabs>
	);
}
