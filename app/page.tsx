"use client";

import { useState } from "react";
import { ApiKeyBar, authHeaders, useOpenAISettings } from "@/components/ApiKeyBar";

export default function Home() {
  const settings = useOpenAISettings();
  const { apiKey, model } = settings;
  const [mission, setMission] = useState(
    "Build a classifier that triages customer support tickets into refund / bug / how-to with calibrated confidence and escalation rules.",
  );
  const [stack, setStack] = useState("Next.js route handlers, OpenAI JSON mode, Postgres audit log");
  const [safety, setSafety] = useState(
    "Never promise refunds; never leak PII across tickets; if confidence < 0.7 route to human.",
  );
  const [examples, setExamples] = useState(
    "Optional: paste 2 messy tickets + desired labels if you want the atelier to anchor few-shots.",
  );
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setOutput("");
    if (!apiKey.trim()) {
      setError("Add your OpenAI API key above.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/atelier", {
        method: "POST",
        headers: authHeaders(apiKey),
        body: JSON.stringify({ mission, stack, safety, examples, model }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setOutput(JSON.stringify(data.result ?? data, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200/90">
          Neuron suite · 12
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Forge Prompt Atelier
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Design a full prompt system: system + developer templates, few-shots, eval rubric, negative
          examples, and ops notes — not just a single clever string.
        </p>
      </header>

      <ApiKeyBar settings={settings} accent="from-teal-400 to-cyan-500" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Mission / task</span>
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-teal-400/60"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Stack / runtime</span>
            <textarea
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-teal-400/60"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Safety / policy</span>
            <textarea
              value={safety}
              onChange={(e) => setSafety(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-teal-400/60"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Optional examples</span>
            <textarea
              value={examples}
              onChange={(e) => setExamples(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-teal-400/60"
            />
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={run}
            className="w-full rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 px-4 py-3 text-sm font-semibold text-teal-950 shadow-lg shadow-teal-500/30 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Weaving…" : "Run atelier"}
          </button>
        </div>
        <div className="flex min-h-[520px] flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-xs md:text-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Prompt kit JSON</span>
            {error ? <span className="text-rose-400">Error</span> : null}
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <pre className="flex-1 overflow-auto whitespace-pre-wrap text-zinc-100">{output}</pre>
        </div>
      </div>
    </div>
  );
}
