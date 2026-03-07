import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useApp } from "@/components/app-provider";
import { router } from "expo-router";
import { useState } from "react";
import { apiURL } from "@/configs/api";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
	const { user, setUser } = useApp();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [error, setError] = useState("");
	const [isRegisterMode, setIsRegisterMode] = useState(false);

	const login = async () => {
		setError("");
		const api = `${apiURL}/users/login`;
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
			await AsyncStorage.setItem("token", token);
			router.push("/");
		} else {
			setError("Unable to login");
		}
	};

	const register = async () => {
		setError("");
		
		if (!name.trim() || !username.trim() || !bio.trim() || !password.trim()) {
			setError("All fields are required");
			return;
		}

		const api = `${apiURL}/users`;
		const res = await fetch(api, {
			method: "POST",
			body: JSON.stringify({ name, username, bio, password }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			// After successful registration, automatically login
			await login();
		} else {
			const errorData = await res.json().catch(() => ({}));
			setError(errorData.message || "Unable to register");
		}
	};

	const clearForm = () => {
		setUsername("");
		setPassword("");
		setName("");
		setBio("");
		setError("");
	};

	const toggleMode = () => {
		setIsRegisterMode(!isRegisterMode);
		clearForm();
	};

	if (!user) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					gap: 10,
					paddingHorizontal: 20,
				}}>
				<Text style={{ fontWeight: "bold", fontSize: 18 }}>
					{isRegisterMode ? "Register" : "Login"}
				</Text>

				{isRegisterMode && (
					<>
						<TextInput
							placeholder="Full Name"
							value={name}
							onChangeText={setName}
							style={{
								borderWidth: 1,
								borderColor: "#66666650",
								padding: 15,
								borderRadius: 20,
								width: "80%",
							}}
						/>
						<TextInput
							placeholder="Bio"
							value={bio}
							onChangeText={setBio}
							multiline
							numberOfLines={3}
							style={{
								borderWidth: 1,
								borderColor: "#66666650",
								padding: 15,
								borderRadius: 20,
								width: "80%",
								textAlignVertical: "top",
							}}
						/>
					</>
				)}

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
					<Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>
						{error}
					</Text>
				)}

				<TouchableOpacity
					onPress={isRegisterMode ? register : login}
					style={{
						backgroundColor: isRegisterMode ? "blue" : "green",
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
						{isRegisterMode ? "Register" : "Login"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={toggleMode}
					style={{
						padding: 10,
					}}>
					<Text style={{ color: "#007AFF", fontSize: 16 }}>
						{isRegisterMode 
							? "Already have an account? Login" 
							: "Don't have an account? Register"}
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
				onPress={async () => {
					await AsyncStorage.removeItem("token");
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
