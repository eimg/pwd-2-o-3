import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider  } from "@tanstack/react-query";
import { View, Text, ActivityIndicator } from "react-native";
import AppProvider, { useApp } from "@/components/app-provider";

const queryClient = new QueryClient();

function LoadingScreen() {
	return (
		<View style={{
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "white"
		}}>
			<ActivityIndicator size="large" color="#007AFF" />
			<Text style={{ marginTop: 10, fontSize: 16, color: "#666" }}>
				Loading...
			</Text>
		</View>
	);
}

function AppNavigator() {
	const { isLoading } = useApp();

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<Stack>
			<Stack.Screen
				name="(home)"
				options={{
					title: "Home",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="view/[id]"
				options={{
					title: "View Post",
				}}
			/>
			<Stack.Screen
				name="add-post"
				options={{
					title: "Add Post",
					presentation: "modal",
				}}
			/>
		</Stack>
	);
}

export default function RootLayout() {
	return (
		<AppProvider>
			<QueryClientProvider client={queryClient}>
				<AppNavigator />
			</QueryClientProvider>
		</AppProvider>
	);
}
