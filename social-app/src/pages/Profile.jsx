import { 
	Typography, 
	Box, 
	Avatar, 
	Card, 
	CardContent,
	Divider,
	Chip
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../AppProvider";
import Post from "../components/Post";

const api = "http://localhost:8800/users";

export default function Profile() {
	const { username } = useParams();
	const { auth } = useApp();
	
	// If no username in params, show current user's profile
	const profileUsername = username || auth?.username;

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user", profileUsername],
		queryFn: async () => {
			if (!profileUsername) return null;
			const res = await fetch(`${api}/${profileUsername}`);
			if (!res.ok) {
				throw new Error("User not found");
			}
			return res.json();
		},
		enabled: !!profileUsername
	});

	if (!profileUsername && !auth) {
		return (
			<Box sx={{ textAlign: "center", mt: 4 }}>
				<Typography variant="h6">Please log in to view your profile</Typography>
			</Box>
		);
	}

	if (isLoading) {
		return <Box>Loading...</Box>;
	}

	if (error) {
		return (
			<Box sx={{ textAlign: "center", mt: 4 }}>
				<Typography variant="h6" color="error">
					{error.message}
				</Typography>
			</Box>
		);
	}

	if (!user) {
		return (
			<Box sx={{ textAlign: "center", mt: 4 }}>
				<Typography variant="h6">User not found</Typography>
			</Box>
		);
	}

	return (
		<div>
			{/* Profile Header */}
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
						<Avatar
							sx={{ 
								width: 100, 
								height: 100, 
								background: green[500],
								fontSize: "2rem"
							}}
						>
							{user.name.charAt(0).toUpperCase()}
						</Avatar>
						<Box sx={{ flex: 1 }}>
							<Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
								{user.name}
							</Typography>
							<Typography variant="h6" sx={{ color: green[500], mb: 2 }}>
								@{user.username}
							</Typography>
							<Typography variant="body1" sx={{ mb: 2 }}>
								{user.bio}
							</Typography>
							<Box sx={{ display: "flex", gap: 2 }}>
								<Chip 
									label={`${user._count.posts} Posts`} 
									variant="outlined" 
									color="primary"
								/>
								<Chip 
									label={`${user._count.comments} Comments`} 
									variant="outlined" 
									color="secondary"
								/>
								<Chip 
									label={`${user._count.likes} Likes Given`} 
									variant="outlined" 
									color="success"
								/>
							</Box>
						</Box>
					</Box>
				</CardContent>
			</Card>

			<Divider sx={{ mb: 3 }} />

			{/* User's Posts */}
			<Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
				Posts by {user.name}
			</Typography>

			{user.posts.length === 0 ? (
				<Box sx={{ textAlign: "center", mt: 4 }}>
					<Typography variant="body1" color="text.secondary">
						No posts yet
					</Typography>
				</Box>
			) : (
				user.posts.map(post => (
					<Post key={post.id} post={post} />
				))
			)}
		</div>
	);
}
