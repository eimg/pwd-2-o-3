import {
    Avatar,
    Box, Typography
} from "@mui/material";

import { green } from "@mui/material/colors";

export default function Comment({ comment }) {
	return (
		<Box sx={{ mb: 2, p: 3, border: "1px solid #99999930" }}>
			<Box sx={{ display: "flex", gap: 2 }}>
				<Box>
					<Avatar
						sx={{ width: 48, height: 48, background: "gray" }}
					/>
				</Box>
				<Box>
					<Typography sx={{ fontWeight: "bold" }}>
                        {comment.user.name}
                    </Typography>
					<Typography sx={{ color: green[500] }}>
						{comment.createdAt}
					</Typography>
					<Typography>
						{comment.content}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
