const express = require("express");
const http = require("http");
const SocketIO = require("socket.io");

const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*", // 클라이언트의 출처를 명시적으로 허용
  methods: ["GET", "POST"],
  credentials: true, // 인증된 요청을 허용합니다.
};

app.use(cors(corsOptions));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer, {
  path: "/socket.io/",
  cors: {
    origin: "*", // 클라이언트의 출처를 명시적으로 허용
    methods: ["GET", "POST"],
    credentials: true,
  },
});

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });

  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });

  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });

  socket.on("disconnect", () => {});
});

const handleListen = () => {};
httpServer.listen(4000, handleListen);
