import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider  } from "@tanstack/react-query";
import AppProvider from "@/components/app-provider";

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<AppProvider>
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
		</AppProvider>
	);
}
