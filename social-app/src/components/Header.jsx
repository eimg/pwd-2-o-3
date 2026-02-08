import {
	AppBar,
	Toolbar,
	Typography,
	Badge,
	IconButton,
	Box,
} from "@mui/material";

import {
	Menu as MenuIcon,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";

export default function Header() {
	const { mode, setMode, setShowDrawer } = useApp();

	return (
		<AppBar position="static">
			<Toolbar>
				<IconButton
					color="inherit"
					sx={{ mr: 2 }}
					onClick={() => setShowDrawer(true)}>
					<MenuIcon />
				</IconButton>

				<Typography sx={{ flexGrow: 1 }}>Social App</Typography>

				{mode == "dark" ? (
					<IconButton
						color="inherit"
						onClick={() => setMode("light")}>
						<LightModeIcon />
					</IconButton>
				) : (
					<IconButton
						color="inherit"
						onClick={() => setMode("dark")}>
						<DarkModeIcon />
					</IconButton>
				)}
			</Toolbar>
		</AppBar>
	);
}
