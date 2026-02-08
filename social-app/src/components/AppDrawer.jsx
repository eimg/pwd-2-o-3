import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import {
    Home as HomeIcon,
    PersonAdd as RegisterIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    Person as ProfileIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";

export default function AppDrawer() {
    const { showDrawer, setShowDrawer } = useApp();

    return (
		<Drawer 
            open={showDrawer}
            onClose={() => setShowDrawer(false)}
            onClick={() => setShowDrawer(false)}>
			<Box sx={{ width: 250, height: 150, background: "gray" }}></Box>
			<List>
				<ListItem>
					<ListItemButton>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItemButton>
				</ListItem>
				<Divider />
				<ListItem>
					<ListItemButton>
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
					<ListItemButton>
						<ListItemIcon>
							<RegisterIcon />
						</ListItemIcon>
						<ListItemText primary="Register" />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton>
						<ListItemIcon>
							<LoginIcon />
						</ListItemIcon>
						<ListItemText primary="Loging" />
					</ListItemButton>
				</ListItem>
			</List>
		</Drawer>
	);
}