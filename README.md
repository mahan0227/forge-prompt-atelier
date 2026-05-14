# Forge Prompt Atelier

Design a **full prompt system** for production: system prompt, developer template with `{{variables}}`, few-shot pairs, eval rubric, negative examples, regression tests, and ops notes—not just one clever string.

## What it is

A Next.js BYOK app that outputs a **JSON “prompt kit”** suitable for code review, handoff to backend, or dropping into an agent framework. Built for teams that need traceability and evaluation, not vibe-only prompts.

## Why it’s useful

- Separates **system** vs **developer** vs **user** layers clearly.
- Adds **few-shots** and **negative examples** to reduce regression when models update.
- Ships an **eval rubric** so quality can be measured, not debated ad hoc.
- Captures **temperature / token / fallback** guidance in one artifact.

## Where you can use it

- **ML & platform** — onboarding new tasks to a shared inference service.
- **Trust & safety** — documenting policy hooks and refusal patterns next to prompts.
- **Startups** — turning a product spec into a repeatable LLM contract before hiring prompt specialists.
- **Enterprises** — audit trail friendly: one JSON blob per capability version.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions (JSON mode)

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
npm run start
```

## API

`POST /api/atelier` · Header `Authorization: Bearer <key>`

Body: `mission` (required), optional `stack`, `safety`, `examples`, `model`.

## Suite brochure

[`docs/neuron-suite-brochure.html`](docs/neuron-suite-brochure.html) · [`docs/neuron-suite-ig-square.svg`](docs/neuron-suite-ig-square.svg)

## License

MIT
