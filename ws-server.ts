// ws-server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: ["http://localhost:3000", "https://capshop-six.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// quando o cliente conectar
io.on("connection", (socket) => {
  console.log("WS conectado:", socket.id);

  // cliente envia userId na auth do handshake
  const userId = socket.handshake.auth?.userId as string | undefined;
  if (userId) {
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} entrou na sala user:${userId}`);
  }

  socket.on("disconnect", () => {
    console.log("WS saiu:", socket.id);
  });
});

// endpoint para o Next disparar broadcast
app.post("/broadcast", (req, res) => {
  // simples proteção com segredo
  const secret = req.headers["x-ws-secret"];
  if (secret !== process.env.WS_SECRET) return res.status(401).end();

  const { userId, notification } = req.body || {};
  if (!userId || !notification) return res.status(400).json({ error: "Dados inválidos" });

  io.to(`user:${userId}`).emit("notification:new", notification);
  return res.sendStatus(204);
});

const PORT = Number(process.env.WS_PORT || 4000);
server.listen(PORT, () => {
  console.log(`WS rodando em ws://localhost:${PORT} (HTTP para /broadcast)`);
});
