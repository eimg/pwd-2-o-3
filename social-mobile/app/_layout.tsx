import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider  } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
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
					}}
				/>
			</Stack>
		</QueryClientProvider>
	);
}
