import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import {
    Home as HomeIcon,
    PersonAdd as RegisterIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    Person as ProfileIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";

import { useNavigate } from "react-router";

export default function AppDrawer() {
    const { showDrawer, setShowDrawer } = useApp();

    const navigate = useNavigate();

    return (
		<Drawer
			open={showDrawer}
			onClose={() => setShowDrawer(false)}
			onClick={() => setShowDrawer(false)}>
			<Box sx={{ width: 250, height: 150, background: "gray" }}></Box>
			<List>
				<ListItem>
					<ListItemButton onClick={() => navigate("/")}>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItemButton>
				</ListItem>
				<Divider />
				<ListItem>
					<ListItemButton onClick={() => navigate("/profile")}>
						<ListItemIcon>
							<ProfileIcon />
						</ListItemIcon>
						<ListItemText primary="Profile" />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton>
						<ListItemIcon>
							<LogoutIcon />
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton onClick={() => navigate("/register")}>
						<ListItemIcon>
							<RegisterIcon />
						</ListItemIcon>
						<ListItemText primary="Register" />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton onClick={() => navigate("/login")}>
						<ListItemIcon>
							<LoginIcon />
						</ListItemIcon>
						<ListItemText primary="Login" />
					</ListItemButton>
				</ListItem>
			</List>
		</Drawer>
	);
}