import express from "express";
import fs from "fs";
import path from "path";
import { createServer } from "http";
import dotenv from "dotenv";
import { WebSocketServer as Server } from "ws";
import { performAction } from "./connectors/databases/mysql/connector.js";

dotenv.config();
const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 3200;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const ws_server = new Server({
  port: process.env.WEBSOCKET_PORT || 3300,
  path: "/ws",
  // host: "localhost",
});
console.log(ws_server);
ws_server.on("connection", (ws) => {
  console.log("New client connected!");
  ws.on("message", (messageAsString) => {
    console.log("message received from client: ", messageAsString.toString());
    ws.send(JSON.stringify({ message: "Yo fucker" }));
  });

  ws.on("close", () => console.log("Client has disconnected!"));
});

app.get("/", (req, res) => {
  const boilerPlateFilePath = path.join(__dirname, "template/boilerplate.html");
  const htmlFile = fs.readFileSync(boilerPlateFilePath, "utf-8");
  res.setHeader("content-type", "text/html");
  res.send(htmlFile);
});

app.get("/test", async (req, res) => {
  res.send(await performAction());
});
