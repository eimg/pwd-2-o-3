import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeLayout() {
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
