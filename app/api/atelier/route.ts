import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAIApiKey } from "@/lib/openai-key";

export async function POST(request: NextRequest) {
  const apiKey = getOpenAIApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: "Send Authorization: Bearer <your OpenAI API key> on each request." },
      { status: 401 },
    );
  }

  let body: {
    mission?: string;
    stack?: string;
    safety?: string;
    examples?: string;
    model?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.mission?.trim()) {
    return NextResponse.json({ error: "`mission` is required." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey });
  const model = body.model?.trim() || "gpt-4o-mini";

  const system = `You are Forge Prompt Atelier — design production-grade prompt *systems*, not one-liners.
Return JSON:
- system_prompt: string
- developer_prompt_template: string (with {{variables}})
- few_shot: { user: string; assistant: string }[] // max 3 pairs
- tool_contract_notes: string[] (if function calling / JSON mode matters)
- eval_rubric: { criterion: string; pass_condition: string; weight: number }[]
- negative_examples: { bad_input: string; why_bad: string }[]
- regression_tests: { input: string; expected_shape: string }[]
- ops_notes: { temperature: string; max_tokens_hint: string; fallback_policy: string }`;

  const user = `MISSION:\n${body.mission}\n\nSTACK / RUNTIME:\n${body.stack?.trim() || "unspecified"}\n\nSAFETY / POLICY:\n${body.safety?.trim() || "standard assistant policy"}\n\nOPTIONAL USER EXAMPLES:\n${body.examples?.trim() || "none"}`;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ raw: text }, { status: 200 });
    }
    return NextResponse.json({ result: parsed, model });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "OpenAI request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
