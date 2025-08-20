import { WebSocketServer } from "ws"

let wss: WebSocketServer | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initWebSocketServer = (server: any) => {
  if (wss) return wss

  wss = new WebSocketServer({ server })

  wss.on("connection", (ws) => {
    console.log("Novo cliente conectado 🚀")

    ws.on("message", (msg) => {
      console.log("Mensagem recebida:", msg.toString())

      wss?.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(`Broadcast: ${msg}`)
        }
      })
    })

    ws.on("close", () => {
      console.log("Cliente desconectado ❌")
    })
  })

  console.log("Servidor WebSocket iniciado ✅")
  return wss
}