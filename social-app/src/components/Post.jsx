import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Card,
	IconButton,
	Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";

import {
	FavoriteBorderOutlined as LikeIcon,
	Favorite as LikedIcon,
	ChatBubbleOutline as CommentIcon,
	DeleteOutline as DeleteIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const postApi = "http://localhost:8800/posts";
const likesApi = "http://localhost:8800/likes";

export default function Post({ post }) {
	const navigate = useNavigate();
	const { auth } = useApp();
	const queryClient = useQueryClient();
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

	// Check if current user has liked this post
	useEffect(() => {
		if (auth && post.likes) {
			const userLike = post.likes.find(like => like.userId === auth.id);
			setIsLiked(!!userLike);
		}
	}, [auth, post.likes]);

	const handleLike = async () => {
		if (!auth) return;

		const token = localStorage.getItem('token');
		
		const res = await fetch(likesApi, {
			method: 'POST',
			body: JSON.stringify({ postId: post.id }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		});

		if (res.ok) {
			const data = await res.json();
			setIsLiked(data.liked);
			setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
			// Optionally refresh the posts to get updated data
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		}
	};

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this post?')) return;
		
		const token = localStorage.getItem('token');
		
		const res = await fetch(`${postApi}/${post.id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`,
			},
		});

		if (res.ok) {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		}
	};

	return (
		<Card sx={{ mb: 2, p: 3 }}>
			<Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
				<Box sx={{ display: "flex", gap: 2 }}>
					<Box>
						<Avatar
							sx={{ width: 52, height: 52, background: green[500] }}
						/>
					</Box>
					<Box>
						<Typography 
							sx={{ 
								fontWeight: "bold",
								cursor: 'pointer',
								'&:hover': {
									textDecoration: 'underline'
								}
							}}
							onClick={() => navigate(`/profile/${post.user.username}`)}
						>
							{post.user.name}
						</Typography>
						<Typography sx={{ color: green[500] }}>
							{post.createAt}
						</Typography>
						<Typography 
							onClick={() => navigate(`/view/${post.id}`)}
							sx={{ cursor: 'pointer' }}
						>
							{post.content}
						</Typography>
					</Box>
				</Box>
				{auth && auth.id === post.userId && (
					<Box>
						<IconButton 
							onClick={handleDelete}
							color="error"
							size="small"
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				)}
			</Box>
			<Box
				sx={{ display: "flex", mt: 2, justifyContent: "space-around" }}>
				<ButtonGroup>
					<IconButton 
						size="sm"
						onClick={handleLike}
						disabled={!auth}
					>
						{isLiked ? (
							<LikedIcon color="error" />
						) : (
							<LikeIcon color="error" />
						)}
					</IconButton>
					<Button
						size="sm"
						variant="text">
						{likesCount}
					</Button>
				</ButtonGroup>
				<ButtonGroup>
					<IconButton size="sm">
						<CommentIcon sx={{ color: "gray" }} />
					</IconButton>
					<Button
						size="sm"
						variant="text">
						{post.comments?.length || 0}
					</Button>
				</ButtonGroup>
			</Box>
		</Card>
	);
}
