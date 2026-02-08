import App from "./App.jsx";

import { CssBaseline } from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useState, createContext, useContext } from "react";

const AppContext = createContext();

export default function AppProvider() {
    const [mode, setMode] = useState("dark");
    const [showDrawer, setShowDrawer] = useState(false);

    const theme = createTheme({
        palette: { mode }
    });

    return (
        <AppContext.Provider value={{ mode, setMode, showDrawer, setShowDrawer }}>
            <ThemeProvider theme={theme}>
                <App />
                <CssBaseline />
            </ThemeProvider>
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
