// Supabase Edge Function: invoke-llm
// Calls the Anthropic Claude API for LLM completions
// Set ANTHROPIC_API_KEY in Supabase Dashboard → Edge Functions → Secrets

Deno.serve(async (req) => {
  try {
    const { prompt, response_json_schema } = await req.json();

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const systemPrompt = response_json_schema
      ? `Respond ONLY with valid JSON matching this schema: ${JSON.stringify(response_json_schema)}`
      : 'You are a helpful assistant.';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: err }, { status: response.status });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // If a JSON schema was requested, parse the response
    let result: any = text;
    if (response_json_schema) {
      try {
        result = JSON.parse(text);
      } catch {
        result = text;
      }
    }

    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
