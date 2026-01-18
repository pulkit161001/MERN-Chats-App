import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
	import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
	// don't no whether user is authenticated or not
	authUser: null,
	isSingingUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	onlineUsers: [],
	socket: null,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/check");
			set({ authUser: res.data });

			get().connectSocket();
		} catch (error) {
			console.log("Error in checkAuth:", error);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},
	signup: async (data) => {
		set({ isSingingUp: true });
		try {
			const res = await axiosInstance.post("/auth/signup", data);
			set({ authUser: res.data });
			toast.success("Account created successfully");

			get().connectSocket();
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isSingingUp: false });
		}
	},
	login: async (data) => {
		set({ isLoggingIn: true });
		try {
			const res = await axiosInstance.post("/auth/login", data);
			set({ authUser: res.data });
			toast.success("Logged in successfully");

			get().connectSocket();
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isLoggingIn: false });
		}
	},
	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			toast.success("Logged out successfully");
			get().disconnectSocket();
		} catch (error) {
			toast.error(error.message.data.message);
		}
	},
	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });

		try {
			const res = await axiosInstance.post("/auth/update-profile", data);
			set({ authUser: res.data });
			toast.success("Profile updated successfully");
		} catch (error) {
			console.log("error in update profile: ", error);
			toast.error(error.response.data);
		} finally {
			set({ isUpdatingProfile: false });
		}
	},
	guestUser: async () => {
		try {
			const res = await axiosInstance.get("/guest/random");
			const { fullName, email, password } = res.data;
			console.log("Guest", email, password);
			toast.success(`Logged in as ${fullName}`);
			await get().login({ email, password });
		} catch (error) {
			toast.error(error.response?.data?.message || "Guest login failed");
		}
	},
	connectSocket: () => {
		const { authUser } = get();
		if (!authUser || get().socket?.connected) return;
		const socket = io(BASE_URL, {
			query: {
				userId: authUser._id,
			},
		});
		socket.connect();
		set({ socket: socket });

		//listens for online user updates
		socket.on("getOnlineUsers", (usersIds) => {
			//we are getting online users as usersIds data the updating onlineUsers array
			set({ onlineUsers: usersIds });
		});
	},
	disconnectSocket: () => {
		if (get().socket?.connected) get().socket.disconnect();
	},
}));
