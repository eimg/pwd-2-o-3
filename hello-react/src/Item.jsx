import { IconButton, ListItem, ListItemText } from "@mui/material";

import { 
    Delete as DeleteIcon,
    SquareOutlined as CheckIcon,
    Check as DoneIcon,
} from "@mui/icons-material";

export default function Item({ item, del, toggle }) {
	return (
		<ListItem>
			<IconButton onClick={() => toggle(item.id)} sx={{ mr: 2 }}>
				{item.done ? (
					<DoneIcon color="success" />
				) : (
					<CheckIcon />
				)}
			</IconButton>

			<ListItemText primary={item.name} />
			<IconButton onClick={() => del(item.id)}>
				<DeleteIcon color="error" />
			</IconButton>
		</ListItem>
	);
}
