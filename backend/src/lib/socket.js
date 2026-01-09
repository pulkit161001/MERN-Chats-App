import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

export function getReceiverSocketID(userId) {
	return userSocketMap[userId];
}

// store online users
// {userId: socketId}
const userSocketMap = {};

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	if (userId) userSocketMap[userId] = socket.id;

	// broadcast to every single user that is connected
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});
export { io, app, server };
