import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";

import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";

import { createContext } from "./context";

const wss = new ws.Server({
  port: Number(env.WS_PORT),
});
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log(
  `✅ WebSocket Server listening on ws://localhost:${String(env.WS_PORT)}`
);

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
