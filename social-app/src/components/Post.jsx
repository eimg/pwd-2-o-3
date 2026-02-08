import { Avatar, Box, Button, ButtonGroup, Card, IconButton, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

import {
    FavoriteBorderOutlined as LikeIcon,
    ChatBubbleOutline as CommentIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";

export default function Post() {
    const navigate = useNavigate();

    return (
		<Card sx={{ mb: 2, p: 3 }}>
			<Box sx={{ display: "flex", gap: 2 }}>
				<Box>
					<Avatar
						sx={{ width: 52, height: 52, background: green[500] }}
					/>
				</Box>
				<Box>
					<Typography sx={{ fontWeight: "bold" }}>Alice</Typography>
					<Typography sx={{ color: green[500] }}>
						A few second ago
					</Typography>
					<Typography onClick={() => navigate("/view")}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Reprehenderit deleniti ratione eum, corrupti eos
						reiciendis aliquid dolorem inventore, non consequuntur
						molestiae expedita sed. Hic distinctio quidem veniam
						dolorum, nostrum atque.
					</Typography>
				</Box>
			</Box>
			<Box sx={{ display: "flex", mt: 2, justifyContent: "space-around" }}>
				<ButtonGroup>
					<IconButton size="sm">
						<LikeIcon color="error" />
					</IconButton>
					<Button
						size="sm"
						variant="text">
						10
					</Button>
				</ButtonGroup>
				<ButtonGroup>
					<IconButton size="sm">
						<CommentIcon sx={{ color: "gray" }} />
					</IconButton>
					<Button
						size="sm"
						variant="text">
						5
					</Button>
				</ButtonGroup>
			</Box>
		</Card>
	);
}