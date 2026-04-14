import { useMemo, useState } from "react";

const starter = [
  {
    role: "assistant",
    content: "Hey, I’m Synthra 🤝 — your fast + deep AI partner. Pick a mode and ask me anything."
  }
];

const PROMPT_STARTERS = {
  conversation: "Help me plan my week with priorities and realistic time blocks.",
  coding: "Build a production-ready auth flow with React + Node and explain security tradeoffs.",
  analysis: "Analyze this product idea and give risks, opportunities, and a 30-day execution plan."
};

export default function App() {
  const [mode, setMode] = useState("quick");
  const [task, setTask] = useState("conversation");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(starter);
  const [loading, setLoading] = useState(false);

  const charCount = useMemo(() => input.length, [input]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, mode, task })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat request failed");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, meta: `mode: ${data.mode} • model: ${data.model}` }
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: `I hit an error ⚠️ ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages(starter);
  }

  function applyStarter() {
    setInput(PROMPT_STARTERS[task]);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-2xl border border-cyan-900/40 bg-slate-900/70 p-5 shadow-2xl shadow-cyan-950/40">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-wide text-cyan-300">Synthra</h1>
            <p className="text-sm text-slate-300">Human-like AI with fast answers ⚡ + deep reasoning 🧠 via Groq.</p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <select className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="quick">Quick Mode</option>
              <option value="deep">Deep Mode</option>
            </select>

            <select className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1" value={task} onChange={(e) => setTask(e.target.value)}>
              <option value="conversation">Conversation</option>
              <option value="coding">Coding</option>
              <option value="analysis">Analysis</option>
            </select>

            <button type="button" onClick={applyStarter} className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1 hover:bg-slate-700">
              Use Starter
            </button>
            <button type="button" onClick={clearChat} className="rounded-md border border-rose-700/70 bg-rose-950/40 px-3 py-1 text-rose-200 hover:bg-rose-900/60">
              Clear Chat
            </button>
          </div>
        </header>

        <div className="flex h-[58vh] flex-col gap-3 overflow-y-auto rounded-xl bg-slate-950/60 p-3">
          {messages.map((msg, idx) => (
            <article key={`${msg.role}-${idx}`} className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed ${msg.role === "user" ? "ml-auto bg-cyan-800/70" : "bg-slate-800"}`}>
              <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">{msg.role}</p>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.meta && <p className="mt-2 text-xs text-cyan-300">{msg.meta}</p>}
            </article>
          ))}
          {loading && <p className="text-sm text-cyan-200">Synthra is thinking…</p>}
        </div>

        <form onSubmit={sendMessage} className="flex flex-col gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Synthra anything..."
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400/40 focus:ring"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">{charCount}/4000 characters</p>
            <button className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-60" type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
