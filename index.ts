import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { module, prompt, locale = "zh-TW" } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "缺少 prompt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OPENAI_API_KEY 尚未設定");

    const system = `你是投資研究輔助工具。以 ${locale} 回答。\n` +
      `請清楚區分：已知資料、推論、假設與不確定性。不要捏造即時價格、新聞、財報或回測數字。\n` +
      `若使用者要求今天/最新資料，但目前沒有可靠資料來源，必須明確說明無法驗證，並要求接入行情/新聞資料源後再判斷。\n` +
      `避免以保證獲利、高勝率或確定買賣訊號呈現；提供研究框架、風險、情境與可驗證條件。\n` +
      `目前模組編號：${module ?? "unknown"}。`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        input: [
          { role: "system", content: [{ type: "input_text", text: system }] },
          { role: "user", content: [{ type: "input_text", text: prompt }] },
        ],
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return new Response(JSON.stringify({ error: data?.error?.message ?? "OpenAI request failed" }), {
        status: r.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const answer = data.output_text ??
      data.output?.flatMap((item: any) => item.content ?? [])
        ?.filter((c: any) => c.type === "output_text")
        ?.map((c: any) => c.text)
        ?.join("\n") ?? "";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
