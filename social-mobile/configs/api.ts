import { Platform } from "react-native";

export const apiURL =
	Platform.OS == "android" ? "http://10.0.2.2:8800" : "http://localhost:8800";
