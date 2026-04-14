const MODEL_CAPABILITIES = {
  "llama-3.3-70b-versatile": {
    strength: "general",
    latency: "medium",
    bestFor: ["balanced", "reasoning", "conversation", "analysis"]
  },
  "llama-3.1-8b-instant": {
    strength: "speed",
    latency: "low",
    bestFor: ["quick", "chat", "simple-qa"]
  },
  "mixtral-8x7b-32768": {
    strength: "long-context",
    latency: "medium",
    bestFor: ["coding", "long-context", "planning"]
  }
};

const TASK_HINTS = {
  code: ["code", "debug", "fix", "function", "api", "react", "node", "python"],
  deep: ["analyze", "explain deeply", "strategy", "architecture", "tradeoff", "reason"]
};

function includesAny(text, words) {
  const value = text.toLowerCase();
  return words.some((w) => value.includes(w));
}

export function selectGroqModel({ mode = "quick", task = "conversation", userMessage = "" }) {
  if (mode === "deep") {
    return "llama-3.3-70b-versatile";
  }

  if (task === "coding" || includesAny(userMessage, TASK_HINTS.code)) {
    return "mixtral-8x7b-32768";
  }

  if (task === "analysis" || includesAny(userMessage, TASK_HINTS.deep)) {
    return "llama-3.3-70b-versatile";
  }

  return "llama-3.1-8b-instant";
}

export function listAvailableModels() {
  return MODEL_CAPABILITIES;
}
