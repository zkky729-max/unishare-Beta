import express from "express";

import cors from "cors";

import adminRoutes from "./routes/admin.routes";

import messagesRoutes from "./routes/messages.routes";

import friendsRoutes from "./routes/friends.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/messages",
  messagesRoutes
);

app.use(
  "/api/friends",
  friendsRoutes
);

export default app;