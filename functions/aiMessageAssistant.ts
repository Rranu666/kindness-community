// NOTE: This file has been converted to use Supabase.
// The canonical version is at: supabase/functions/ai-message-assistant/index.ts
// Deploy it with: supabase functions deploy ai-message-assistant

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, messageContent, targetPerson, incomingMessage, teamMembers, userMessage } = body;

    let prompt = '';

    if (action === 'chat' || (!action && userMessage)) {
      const msg = userMessage || messageContent || '';
      prompt = `You are Synergy Hub AI — a helpful, friendly assistant for a nonprofit team workspace called Synergy Hub (part of Kindness Community Foundation).
Current user: ${user.user_metadata?.full_name || user.email} (${user.email})
User's message: "${msg}"
Respond in a helpful, concise, and friendly tone.`;
    } else if (action === 'draft') {
      prompt = `You are a professional message assistant. Draft a message to ${targetPerson || 'the team'} based on this intent: ${messageContent}. Return a single ready-to-send message.`;
    } else if (action === 'suggest_reply') {
      prompt = `Suggest a professional reply to: "${incomingMessage}". Return a single suggested reply.`;
    } else if (action === 'route') {
      const memberNames = (teamMembers || []).map((m: any) => `- ${m.full_name} (${m.department || 'General'})`).join('\n');
      prompt = `Based on this message: "${messageContent}", suggest which team members should receive it from: ${memberNames}`;
    } else {
      prompt = `You are Synergy Hub AI. The user sent: "${messageContent || userMessage || JSON.stringify(body)}". Respond helpfully.`;
    }

    // Call LLM via invoke-llm function
    const { data: llmData, error: llmError } = await supabase.functions.invoke('invoke-llm', {
      body: { prompt },
    });

    if (llmError) throw llmError;

    return Response.json({
      success: true,
      data: llmData?.result || llmData,
      action: action || 'chat',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
