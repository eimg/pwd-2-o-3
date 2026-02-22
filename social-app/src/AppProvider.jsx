import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState, createContext, useContext, useMemo, useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Router from "./Router";

const AppContext = createContext();
const queryClient = new QueryClient();

const api = "http://localhost:8800/users/verify";
const token = localStorage.getItem("token");

export default function AppProvider() {
	const [mode, setMode] = useState("dark");
	const [showDrawer, setShowDrawer] = useState(false);
	const [auth, setAuth] = useState();

    useEffect(() => {
        if(token) {
            fetch(api, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then(async res => {
                if(res.ok) {
                    const user = await res.json();
                    setAuth(user);
                } else {
                    localStorage.removeItem("token");
                }
            });
        }
    }, []);

	const theme = useMemo(() => {
		return createTheme({
			palette: { mode },
		});
	}, [mode]);

	return (
		<AppContext.Provider
			value={{ mode, setMode, showDrawer, setShowDrawer, auth, setAuth }}>
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
