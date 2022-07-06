const app = require("express")();
const server = require("http").createServer(app);
const PORT = 3001;
const cors = require("cors");
const io = require("socket.io")(server, { cors: { origin: "http://localhost:3000" } });

app.use(cors());

io.on("connect", (socket) => {
	console.log("New user connected!");
	let nameSocket;

	socket.on("userConnected", (name) => {
		nameSocket = name;
		io.emit("receiveMessage", { bot: true, message: `${name} connected!` });
	});

	socket.on("message", (data) => {
		console.log(data);
		io.emit("receiveMessage", data);
	});

	socket.on("disconnect", () => {
		if (!nameSocket) return;
		io.emit("receiveMessage", { bot: true, message: `${nameSocket} left!` });
	});
});

server.listen(PORT, () => console.log("Server running..."));
