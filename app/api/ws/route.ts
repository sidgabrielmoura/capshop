import { NextApiRequest, NextApiResponse } from "next";
import { initWebSocketServer } from "@/lib/wsServer";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) return res.end();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const server: any = (res.socket as any).server;

  if (!server.wss) {
    server.wss = initWebSocketServer(server);
  }

  res.end();
}