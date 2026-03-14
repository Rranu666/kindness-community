import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Entity name → Supabase table name mapping
const TABLE_MAP = {
  Donation: 'donations',
  GivingGoal: 'giving_goals',
  Subscription: 'subscriptions',
  CommunityStory: 'community_stories',
  VolunteerSubmission: 'volunteer_submissions',
  VolunteerSignup: 'volunteer_signups',
  VolunteerHours: 'volunteer_hours',
  VolunteerBadge: 'volunteer_badges',
  TeamAnnouncement: 'team_announcements',
  ChatGroup: 'chat_groups',
  TeamMessage: 'team_messages',
  MessageAttachment: 'message_attachments',
  TeamDocument: 'team_documents',
  TeamTask: 'team_tasks',
  TaskAttachment: 'task_attachments',
  Notification: 'notifications',
  TeamMember: 'team_members',
  TeamDirectory: 'team_directory',
  Analytics: 'analytics',
  User: 'users',
};

// Parse base44 orderBy string ('-created_date') into Supabase format
function parseOrderBy(orderBy) {
  if (!orderBy) return null;
  const ascending = !orderBy.startsWith('-');
  const field = orderBy.replace(/^-/, '');
  const fieldMap = { created_date: 'created_at', updated_date: 'updated_at' };
  return { column: fieldMap[field] || field, ascending };
}

function createEntityHandler(tableName) {
  return {
    async list(orderBy = null, limit = null) {
      let query = supabase.from(tableName).select('*');
      if (orderBy) {
        const order = parseOrderBy(orderBy);
        if (order) query = query.order(order.column, { ascending: order.ascending });
      }
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async filter(filters = {}, orderBy = null, limit = null) {
      let query = supabase.from(tableName).select('*');

      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null) continue;
        if (typeof value === 'object' && value.$regex) {
          // MongoDB-style regex → Supabase ilike
          query = query.ilike(key, `%${value.$regex}%`);
        } else if (typeof value === 'object' && value.$gte !== undefined) {
          query = query.gte(key, value.$gte);
        } else if (typeof value === 'object' && value.$lte !== undefined) {
          query = query.lte(key, value.$lte);
        } else {
          query = query.eq(key, value);
        }
      }

      if (orderBy) {
        const order = parseOrderBy(orderBy);
        if (order) query = query.order(order.column, { ascending: order.ascending });
      }

      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async create(data) {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([{ ...data, created_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw error;
      return result;
    },

    async update(id, data) {
      const { data: result, error } = await supabase
        .from(tableName)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },

    async bulkCreate(items) {
      const itemsWithTs = items.map(item => ({ ...item, created_at: new Date().toISOString() }));
      const { data, error } = await supabase.from(tableName).insert(itemsWithTs).select();
      if (error) throw error;
      return data || [];
    },

    subscribe(callback) {
      const channel = supabase
        .channel(`${tableName}_changes_${Date.now()}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, async () => {
          const { data } = await supabase.from(tableName).select('*');
          if (data) callback(data);
        })
        .subscribe();
      return () => supabase.removeChannel(channel);
    },
  };
}

// Dynamic entity proxy — creates a handler for any entity name
const entities = new Proxy({}, {
  get(_, entityName) {
    const tableName = TABLE_MAP[entityName] || entityName.toLowerCase() + 's';
    return createEntityHandler(tableName);
  },
});

// Auth compatibility layer
const auth = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      role: user.user_metadata?.role || 'user',
      avatar_url: user.user_metadata?.avatar_url || null,
      ...user.user_metadata,
    };
  },

  logout(redirectUrl) {
    supabase.auth.signOut().then(() => {
      window.location.href = redirectUrl || '/';
    });
  },

  redirectToLogin(returnUrl) {
    const loginPath = `/login${returnUrl ? `?redirect=${encodeURIComponent(returnUrl)}` : ''}`;
    window.location.href = loginPath;
  },

  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },
};

// Integrations compatibility layer
const integrations = {
  Core: {
    async UploadFile({ file }) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('app-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('app-files')
        .getPublicUrl(filePath);

      return { file_url: publicUrl };
    },

    async InvokeLLM({ prompt, response_json_schema }) {
      const { data, error } = await supabase.functions.invoke('invoke-llm', {
        body: { prompt, response_json_schema },
      });
      if (error) throw error;
      return data?.result || data;
    },
  },
};

// Functions compatibility layer — maps base44 function names to Supabase Edge Functions
const functions = {
  async invoke(functionName, body) {
    // Convert camelCase → kebab-case (e.g. aiMessageAssistant → ai-message-assistant)
    const kebabName = functionName
      .replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
      .replace(/^-/, '');
    const { data, error } = await supabase.functions.invoke(kebabName, { body });
    if (error) throw error;
    return data;
  },
};

// AppLogs compatibility layer — stores page views in analytics table
const appLogs = {
  async logUserInApp(pageName) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('analytics').insert([{
      metric_type: 'page_view',
      metric_value: pageName,
      user_id: user.id,
      user_email: user.email,
      metric_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    }]);
  },
};

// Export as 'base44' for full backward compatibility with all existing components
export const base44 = {
  entities,
  auth,
  integrations,
  functions,
  appLogs,
};
