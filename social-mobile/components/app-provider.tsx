import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserType } from "@/types/global";
import { apiURL } from "@/configs/api";

const AppContext = createContext<{
	user: UserType | null;
	setUser: (user: UserType | null) => void;
	isLoading: boolean;
}>({
	user: null,
	setUser: () => {},
	isLoading: true,
});

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<UserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Verify token and auto-login on app startup
	const verifyToken = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			
			if (!token) {
				setIsLoading(false);
				return;
			}

			const response = await fetch(`${apiURL}/users/verify`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			
			if (response.ok) {
				const userData = await response.json();
				setUser(userData);
			} else {
				// Token is invalid, remove it
				await AsyncStorage.removeItem("token");
			}
		} catch (error) {
			console.error("Token verification failed:", error);
			await AsyncStorage.removeItem("token");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		verifyToken();
	}, []);

	return (
		<AppContext.Provider value={{ user, setUser, isLoading }}>
			{children}
		</AppContext.Provider>
	);
}

export function useApp() {
	const context = useContext(AppContext);

	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}

	return context;
}
