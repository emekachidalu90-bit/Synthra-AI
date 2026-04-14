import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SYNTHRA_SYSTEM_PROMPT } from "./synthraPrompt.js";
import { selectGroqModel, listAvailableModels } from "./modelRouter.js";
import { chatWithGroq } from "./groqClient.js";

const app = express();
const port = Number(process.env.PORT) || 8080;
const isProduction = process.env.NODE_ENV === "production";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, "../../client/dist");

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "synthra-server", env: process.env.NODE_ENV || "development" });
});

app.get("/api/models", (_req, res) => {
  res.json({
    selectedBy: "mode + task + prompt-intent",
    models: listAvailableModels()
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], mode = "quick", task = "conversation" } = req.body ?? {};
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GROQ_API_KEY in server environment." });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] is required." });
    }

    const normalizedHistory = messages
      .filter((m) => ["user", "assistant"].includes(m?.role) && typeof m?.content === "string")
      .slice(-20);

    const userMessage = [...normalizedHistory].reverse().find((m) => m.role === "user")?.content ?? "";
    const model = selectGroqModel({ mode, task, userMessage });

    const fullMessages = [{ role: "system", content: SYNTHRA_SYSTEM_PROMPT }, ...normalizedHistory];

    const output = await chatWithGroq({
      apiKey,
      model,
      messages: fullMessages,
      temperature: mode === "deep" ? 0.45 : 0.65
    });

    return res.json({ model, mode, task, reply: output });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
});

if (isProduction) {
  app.use(express.static(clientDist));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Synthra server running on http://localhost:${port}`);
});
