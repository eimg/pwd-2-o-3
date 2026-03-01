import { Platform } from "react-native";

export const apiURL =
	Platform.OS == "ios" ? "http://localhost:8800" : "http://10.0.2.2:8800";
