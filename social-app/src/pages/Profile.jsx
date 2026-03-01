import { 
	Typography, 
	Box, 
	Avatar, 
	Card, 
	CardContent,
	Divider,
	Chip,
	Button
} from "@mui/material";
import { green, blue } from "@mui/material/colors";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";
import Post from "../components/Post";

const api = "http://localhost:8800/users";
const followApi = "http://localhost:8800/follows";

export default function Profile() {
	const { username } = useParams();
	const { auth } = useApp();
	const queryClient = useQueryClient();
	
	// If no username in params, show current user's profile
	const profileUsername = username || auth?.username;
	const isOwnProfile = !username || username === auth?.username;

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

	// Get follow status for other users' profiles
	const { data: followStatus } = useQuery({
		queryKey: ["followStatus", user?.id],
		queryFn: async () => {
			if (!user?.id || !auth) return null;
			const token = localStorage.getItem("token");
			if (!token) return null;
			const res = await fetch(`${followApi}/${user.id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (!res.ok) return null;
			return res.json();
		},
		enabled: !!user?.id && !!auth && !isOwnProfile
	});

	// Follow/unfollow mutation
	const followMutation = useMutation({
		mutationFn: async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("Not authenticated");
			}
			const res = await fetch(followApi, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ followingId: user.id })
			});
			if (!res.ok) {
				throw new Error("Failed to toggle follow");
			}
			return res.json();
		},
		onSuccess: () => {
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ["followStatus", user?.id] });
			queryClient.invalidateQueries({ queryKey: ["user", profileUsername] });
		}
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
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
								<Chip 
									label={`${user._count.followers} Followers`} 
									variant="outlined" 
									color="info"
								/>
								<Chip 
									label={`${user._count.following} Following`} 
									variant="outlined" 
									color="warning"
								/>
							</Box>
							
							{/* Follow/Unfollow Button */}
							{!isOwnProfile && auth && (
								<Button
									variant={followStatus?.following ? "outlined" : "contained"}
									color="primary"
									onClick={() => followMutation.mutate()}
									disabled={followMutation.isPending}
									sx={{ mt: 1 }}
								>
									{followMutation.isPending 
										? "Loading..." 
										: followStatus?.following 
											? "Unfollow" 
											: "Follow"
									}
								</Button>
							)}
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
