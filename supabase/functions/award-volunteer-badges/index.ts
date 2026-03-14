import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const BADGE_THRESHOLDS: Record<string, number> = {
  first_steps: 5,
  champion: 25,
  leader: 50,
  ambassador: 100,
  lifetime: 250,
};

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

    // Get all hours for this user
    const { data: allHours = [] } = await supabase
      .from('volunteer_hours')
      .select('*')
      .eq('user_email', user.email);

    const totalHours = allHours.reduce((sum: number, h: any) => sum + (h.hours || 0), 0);

    // Get existing badges
    const { data: existingBadges = [] } = await supabase
      .from('volunteer_badges')
      .select('*')
      .eq('user_email', user.email);

    const existingBadgeTypes = existingBadges.map((b: any) => b.badge_type);

    // Award badges based on hours
    const badgesToAward = [];
    for (const [badgeType, threshold] of Object.entries(BADGE_THRESHOLDS)) {
      if (totalHours >= threshold && !existingBadgeTypes.includes(badgeType)) {
        badgesToAward.push({
          user_email: user.email,
          badge_type: badgeType,
          hours_earned_at: totalHours,
          earned_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        });
      }
    }

    // Create new badges
    if (badgesToAward.length > 0) {
      await supabase.from('volunteer_badges').insert(badgesToAward);
    }

    return Response.json({
      success: true,
      totalHours,
      badgesAwarded: badgesToAward.length,
      newBadges: badgesToAward,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
