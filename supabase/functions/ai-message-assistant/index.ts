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
    let jsonSchema: any = null;

    if (action === 'chat' || (!action && userMessage)) {
      const msg = userMessage || messageContent || '';
      prompt = `You are Synergy Hub AI — a helpful, friendly assistant for a nonprofit team workspace called Synergy Hub (part of Kindness Community Foundation).

You help team members with:
- Answering questions about teamwork, tasks, and communication
- Drafting messages, announcements, or emails
- Brainstorming ideas and giving suggestions
- Explaining how to use the workspace features (Messages, Tasks, Documents, Announcements, Directory)
- General productivity and collaboration advice

Current user: ${user.user_metadata?.full_name || user.email} (${user.email})

User's message: "${msg}"

Respond in a helpful, concise, and friendly tone. If they ask you to draft something, write it out fully. If they ask a question, answer clearly. Keep responses focused and practical.`;

    } else if (action === 'draft') {
      prompt = `You are a professional message assistant for the Synergy Hub team workspace. The user wants to send a message to ${targetPerson || 'the team'}.

Intent: ${messageContent}

Generate a professional, clear, and concise message that conveys this intent. The message should be appropriate for a team environment.
Return a single well-crafted message ready to send.`;

    } else if (action === 'suggest_reply') {
      prompt = `You are a helpful message assistant. Someone sent this message:

"${incomingMessage}"

Suggest a thoughtful, professional reply that:
1. Acknowledges the sender's message
2. Provides a helpful response
3. Is concise and appropriate for a team environment

Return a single suggested reply message.`;

    } else if (action === 'route') {
      const memberNames = (teamMembers || []).map((m: any) => `- ${m.full_name} (${m.department || 'General'})`).join('\n');
      prompt = `You are a message routing assistant. Based on this message content, determine which team member(s) should receive it.

Message: "${messageContent}"

Available team members:
${memberNames}

Analyze the message and suggest who it should go to and why.`;
      jsonSchema = {
        type: 'object',
        properties: {
          suggested_recipients: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                reason: { type: 'string' },
              },
            },
          },
          summary: { type: 'string' },
        },
      };
    } else {
      prompt = `You are Synergy Hub AI — a helpful assistant for a nonprofit team workspace. The user sent: "${messageContent || userMessage || JSON.stringify(body)}". Respond helpfully and concisely.`;
    }

    // Call Claude API via invoke-llm function
    const { data: llmData, error: llmError } = await supabase.functions.invoke('invoke-llm', {
      body: { prompt, response_json_schema: jsonSchema },
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
