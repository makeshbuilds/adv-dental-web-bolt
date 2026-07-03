import type { IncomingMessage, ServerResponse } from "node:http";
import "dotenv/config";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.all("/api/auth/*", (req, res) => {
  res.status(404).json({ error: "Auth endpoint not found" });
});

app.all("/api/storage/*", (req, res) => {
  res.status(404).json({ error: "Storage endpoint not found" });
});

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return new Promise<void>((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
