import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useApp } from "@/components/app-provider";
import { router } from "expo-router";
import { useState } from "react";

export default function Profile() {
	const { user, setUser } = useApp();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const login = async () => {
		const api = "http://localhost:8800/users/login";
		const res = await fetch(api, {
			method: "POST",
			body: JSON.stringify({ username, password }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const { user, token } = await res.json();
			setUser(user);
			router.push("/");
		} else {
			setError("Unable to login");
		}
	};

	if (!user) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					gap: 10,
				}}>
				<Text style={{ fontWeight: "bold", fontSize: 18 }}>Login</Text>

				<TextInput
					placeholder="Username"
					autoCapitalize="none"
					value={username}
					onChangeText={setUsername}
					style={{
						borderWidth: 1,
						borderColor: "#66666650",
						padding: 15,
						borderRadius: 20,
						width: "80%",
					}}
				/>
				<TextInput
					placeholder="Password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					style={{
						borderWidth: 1,
						borderColor: "#66666650",
						padding: 15,
						borderRadius: 20,
						width: "80%",
					}}
				/>

				{error && (
					<Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
				)}

				<TouchableOpacity
					onPress={login}
					style={{
						backgroundColor: "green",
						padding: 15,
						borderRadius: 20,
						alignItems: "center",
						justifyContent: "center",
						width: "80%",
					}}>
					<Text
						style={{
							color: "white",
							fontWeight: "bold",
							fontSize: 16,
						}}>
						Login
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				gap: 10,
			}}>
			<Text style={{ fontWeight: "bold", fontSize: 21 }}>Profile</Text>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>
				{user.name}
			</Text>
			<Text style={{ fontSize: 16, color: "#666666" }}>
				{user.username}
			</Text>
			<Text style={{ fontSize: 16, color: "#666666" }}>{user.bio}</Text>
			<TouchableOpacity
				onPress={() => {
					setUser(null);
					router.push("/");
				}}
				style={{
					backgroundColor: "red",
					borderRadius: 20,
					alignItems: "center",
					justifyContent: "center",
					paddingVertical: 10,
					paddingHorizontal: 30,
				}}>
				<Text style={{ color: "white", fontSize: 16 }}>Logout</Text>
			</TouchableOpacity>
		</View>
	);
}
