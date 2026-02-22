import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState, createContext, useContext, useMemo } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Router from "./Router";

const AppContext = createContext();
const queryClient = new QueryClient();

export default function AppProvider() {
	const [mode, setMode] = useState("dark");
	const [showDrawer, setShowDrawer] = useState(false);

	const theme = useMemo(() => {
		return createTheme({
			palette: { mode },
		});
	}, [mode]);

	return (
		<AppContext.Provider
			value={{ mode, setMode, showDrawer, setShowDrawer }}>
			<ThemeProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<Router />
					<CssBaseline />
				</QueryClientProvider>
			</ThemeProvider>
		</AppContext.Provider>
	);
}

export function useApp() {
	return useContext(AppContext);
}
