# Forge Prompt Atelier

Design a **production prompt system**: system + developer templates, few-shot pairs, eval rubric, negative examples, regression tests, and ops notes — beyond a single clever prompt. **BYO OpenAI API key.**

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions (JSON mode)

## Run locally

```bash
npm install
npm run dev
```

## API

`POST /api/atelier` · Header `Authorization: Bearer <key>`

Body: `mission`, optional `stack`, optional `safety`, optional `examples`, optional `model`.

## License

MIT
