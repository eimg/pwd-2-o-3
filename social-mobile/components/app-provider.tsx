import { createContext, useContext, useState } from "react";

import type { UserType } from "@/types/global";

const AppContext = createContext<{
	user: UserType | null;
	setUser: (user: UserType | null) => void;
}>({
	user: null,
	setUser: () => {},
});

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<UserType | null>(null);

	return (
		<AppContext.Provider value={{ user, setUser }}>
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
