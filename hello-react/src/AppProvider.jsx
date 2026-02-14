import App from "./App.jsx";

import { CssBaseline } from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useState, createContext, useMemo } from "react";

export const AppContext = createContext();

export default function AppProvider() {
    const [mode, setMode] = useState("dark");

    const theme = useMemo(() => {
        return createTheme({
			palette: { mode },
		});
    }, [mode]);

	return (
		<AppContext.Provider value={{ mode, setMode }}>
			<ThemeProvider theme={theme}>
				<App />
				<CssBaseline />
			</ThemeProvider>
		</AppContext.Provider>
	);
}
