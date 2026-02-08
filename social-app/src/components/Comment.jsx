import {
    Avatar,
    Box, Typography
} from "@mui/material";

import { green } from "@mui/material/colors";

export default function Comment() {
	return (
		<Box sx={{ mb: 2, p: 3, border: "1px solid #99999930" }}>
			<Box sx={{ display: "flex", gap: 2 }}>
				<Box>
					<Avatar
						sx={{ width: 48, height: 48, background: "gray" }}
					/>
				</Box>
				<Box>
					<Typography sx={{ fontWeight: "bold" }}>Bob</Typography>
					<Typography sx={{ color: green[500] }}>
						A few second ago
					</Typography>
					<Typography>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Reprehenderit deleniti ratione eum.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
