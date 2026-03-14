import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function SearchOverlay({ onClose, isMobile, messages, tasks, documents, announcements, onNavigate }) {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();
  const results = q.length < 1 ? [] : [
    ...tasks.filter(t => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
      .map(t => ({ icon: '✅', label: t.title, sub: 'Task', page: 'tasks' })),
    ...messages.filter(m => m.message?.toLowerCase().includes(q))
      .map(m => ({ icon: '💬', label: m.message?.slice(0, 60), sub: `from ${m.sender_name || 'Team'}`, page: 'messages' })),
    ...documents.filter(d => d.title?.toLowerCase().includes(q))
      .map(d => ({ icon: '📄', label: d.title, sub: 'Document', page: 'documents' })),
    ...announcements.filter(a => a.title?.toLowerCase().includes(q) || a.content?.toLowerCase().includes(q))
      .map(a => ({ icon: '📣', label: a.title, sub: 'Announcement', page: 'announcements' })),
  ].slice(0, 8);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: isMobile ? '60px' : '80px' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: isMobile ? '90%' : '100%', maxWidth: '580px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: '18px', color: 'var(--text3)' }}>🔍</span>
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", fontSize: '16px' }} placeholder="Search tasks, messages, documents..." />
          <span onClick={onClose} style={{ fontSize: '14px', color: 'var(--text3)', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>✕</span>
        </div>
        <div style={{ padding: '8px 0', maxHeight: '360px', overflowY: 'auto' }}>
          {query.length === 0 && (
            <>
              <div style={{ padding: '8px 18px 4px', fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Quick Navigation</div>
              {[
                { icon: '⚡', label: 'Dashboard', page: 'dashboard' },
                { icon: '✅', label: 'Tasks', page: 'tasks' },
                { icon: '💬', label: 'Messages', page: 'messages' },
                { icon: '📣', label: 'Announcements', page: 'announcements' },
                { icon: '📄', label: 'Documents', page: 'documents' },
                { icon: '👥', label: 'Team Directory', page: 'directory' },
              ].map((item, i) => (
                <div key={i} onClick={() => onNavigate(item.page)} style={{ padding: '10px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
                  <div style={{ flex: 1, fontSize: '13px' }}>{item.label}</div>
                </div>
              ))}
            </>
          )}
          {query.length > 0 && results.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)', fontSize: '13px' }}>No results for "{query}"</div>
          )}
          {results.length > 0 && (
            <>
              <div style={{ padding: '8px 18px 4px', fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Results</div>
              {results.map((r, i) => (
                <div key={i} onClick={() => onNavigate(r.page)} style={{ padding: '10px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{r.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{r.sub}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamPortal() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const aiChatRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch {
        // Not authenticated — handled by auth guard
      }
    };
    fetchUser();
  }, []);

  // Fetch data
  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: () => base44.entities.TeamMessage.list(),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => base44.entities.Notification.list(),
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => base44.entities.TeamAnnouncement.list(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.TeamTask.list(),
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.TeamDocument.list(),
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.TeamMember.list(),
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: (taskData) => base44.entities.TeamTask.create(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskTitle('');
      setNewTaskDesc('');
      setModalOpen(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, ...data }) => base44.entities.TeamTask.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const createMessageMutation = useMutation({
    mutationFn: (msgData) => base44.entities.TeamMessage.create(msgData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setMessageInput('');
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data) => base44.entities.TeamAnnouncement.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setNewAnnTitle('');
      setNewAnnContent('');
      setAnnModalOpen(false);
    },
  });

  const createDocumentMutation = useMutation({
    mutationFn: (data) => base44.entities.TeamDocument.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setNewDocTitle('');
      setNewDocContent('');
      setDocModalOpen(false);
    },
  });

  const handleCreateDocument = () => {
    if (!newDocTitle.trim()) return;
    createDocumentMutation.mutate({
      title: newDocTitle,
      content: newDocContent,
      author_name: currentUser?.full_name || 'Team',
      author_email: currentUser?.email || '',
    });
  };

  const handleCreateAnnouncement = () => {
    if (!newAnnTitle.trim()) return;
    createAnnouncementMutation.mutate({
      title: newAnnTitle,
      content: newAnnContent,
      author_name: currentUser?.full_name || 'Team',
      author_email: currentUser?.email || '',
      priority: 'normal',
    });
  };

  const markNotificationRead = useMutation({
    mutationFn: (notificationId) => base44.entities.Notification.update(notificationId, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const pageTitles = {
    dashboard: 'Dashboard',
    messages: 'Messages',
    dm: 'Direct Messages',
    documents: 'Documents',
    tasks: 'Tasks',
    announcements: 'Announcements',
    directory: 'Team Directory',
    profile: 'My Profile',
    ai: 'AI Assistant',
    notifications: 'Notifications',
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    createMessageMutation.mutate({
      sender_email: currentUser?.email || 'user@example.com',
      sender_name: currentUser?.full_name || 'User',
      message: messageInput,
      message_type: 'group',
    });
  };

  const sendAI = async () => {
    const text = aiInput.trim();
    if (!text || aiLoading) return;
    setAiInput('');
    const userMsg = { role: 'user', text, id: Date.now() };
    setAiMessages(prev => [...prev, userMsg]);
    setAiLoading(true);
    setTimeout(() => {
      if (aiChatRef.current) aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }, 50);
    try {
      const response = await base44.functions.invoke('aiMessageAssistant', {
        action: 'chat',
        userMessage: text,
      });
      const aiText = response?.result || response?.message || response?.data || 'Sorry, I could not process that.';
      setAiMessages(prev => [...prev, { role: 'ai', text: aiText, id: Date.now() + 1 }]);
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.', id: Date.now() + 1 }]);
    } finally {
      setAiLoading(false);
      setTimeout(() => {
        if (aiChatRef.current) aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
      }, 50);
    }
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    createTaskMutation.mutate({
      title: newTaskTitle,
      description: newTaskDesc,
      created_by_email: currentUser?.email || 'user@example.com',
      status: 'todo',
      priority: 'medium',
    });
  };

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#0a0b0f', color: '#e8eaf0', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
      <style>{`
        :root {
          --bg: #0a0b0f;
          --surface: #111318;
          --surface2: #181c24;
          --surface3: #1e2330;
          --border: #252b3a;
          --border2: #2e3649;
          --text: #e8eaf0;
          --text2: #9aa0b4;
          --text3: #5c6480;
          --accent: #4f7cff;
          --accent2: #7c5cfc;
          --accent-glow: rgba(79,124,255,0.15);
          --green: #2ecc8f;
          --yellow: #f5c842;
          --red: #ff5263;
          --orange: #ff8c42;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 18px; cursor: pointer; color: var(--text2); transition: all 0.15s; position: relative; }
        .nav-item:hover { background: var(--surface2); color: var(--text); }
        .nav-item.active { background: var(--accent-glow); color: var(--accent); font-weight: 500; }
        .nav-item.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; background: var(--accent); border-radius: 0 3px 3px 0; }
        .btn { padding: 7px 14px; border-radius: 10px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: all 0.15s; }
        .btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-secondary { background: var(--surface2); border: 1px solid var(--border); color: var(--text); }
        .btn-secondary:hover { border-color: var(--border2); }
        .page { display: none; }
        .page.active { display: flex; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <nav style={{
        width: isMobile ? '240px' : '240px',
        minWidth: '240px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (sidebarOpen ? '0' : '-240px') : '0',
        top: 0,
        zIndex: 101,
        transition: isMobile ? 'left 0.3s ease' : 'none',
      }}>
        <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: '800', fontSize: '16px', color: 'white' }}>S</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '18px', letterSpacing: '-0.3px' }}>Synergy Hub</span>
        </div>

        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setCurrentPage('profile')}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f7cff, #7c5cfc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px', color: 'white' }}>
            {currentUser?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: '13px' }}>{currentUser?.full_name || currentUser?.email?.split('@')[0] || 'Loading...'}</div>
            <div style={{ fontSize: '11px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)' }}></span>Active
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {['dashboard', 'announcements', 'notifications'].map((id) => (
            <div key={id} className={`nav-item ${currentPage === id ? 'active' : ''}`} onClick={() => setCurrentPage(id)}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
                {id === 'dashboard' && '⚡'}
                {id === 'announcements' && '📣'}
                {id === 'notifications' && '🔔'}
              </span>
              <span style={{ flex: 1, fontSize: '13px' }}>
                {id === 'dashboard' && 'Dashboard'}
                {id === 'announcements' && 'Announcements'}
                {id === 'notifications' && 'Notifications'}
              </span>
              {id === 'announcements' && announcements.length > 0 && <span style={{ background: 'var(--red)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '10px' }}>{announcements.length}</span>}
              {id === 'notifications' && notifications.filter(n => !n.is_read).length > 0 && <span style={{ background: 'var(--accent)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '10px' }}>{notifications.filter(n => !n.is_read).length}</span>}
            </div>
          ))}

          <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', color: 'var(--text3)', textTransform: 'uppercase', padding: '14px 18px 6px' }}>Communicate</div>
          {['messages', 'dm'].map((id) => (
            <div key={id} className={`nav-item ${currentPage === id ? 'active' : ''}`} onClick={() => setCurrentPage(id)}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
                {id === 'messages' && '💬'}
                {id === 'dm' && '✉️'}
              </span>
              <span style={{ flex: 1, fontSize: '13px' }}>
                {id === 'messages' && 'Messages'}
                {id === 'dm' && 'Direct Messages'}
              </span>
              {id === 'messages' && messages.length > 0 && <span style={{ background: 'var(--accent)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '10px' }}>{messages.length}</span>}
            </div>
          ))}

          <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', color: 'var(--text3)', textTransform: 'uppercase', padding: '14px 18px 6px' }}>Work</div>
          {['tasks', 'documents'].map((id) => (
            <div key={id} className={`nav-item ${currentPage === id ? 'active' : ''}`} onClick={() => setCurrentPage(id)}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
                {id === 'tasks' && '✅'}
                {id === 'documents' && '📁'}
              </span>
              <span style={{ flex: 1, fontSize: '13px' }}>
                {id === 'tasks' && 'Tasks'}
                {id === 'documents' && 'Documents'}
              </span>
            </div>
          ))}

          <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', color: 'var(--text3)', textTransform: 'uppercase', padding: '14px 18px 6px' }}>People</div>
          {['directory', 'profile', 'ai'].map((id) => (
            <div key={id} className={`nav-item ${currentPage === id ? 'active' : ''}`} onClick={() => setCurrentPage(id)}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
                {id === 'directory' && '👥'}
                {id === 'profile' && '👤'}
                {id === 'ai' && '🤖'}
              </span>
              <span style={{ flex: 1, fontSize: '13px' }}>
                {id === 'directory' && 'Team Directory'}
                {id === 'profile' && 'My Profile'}
                {id === 'ai' && 'AI Assistant'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
          <button
            style={{ flex: 1, padding: '7px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text2)', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', transition: 'all 0.15s' }}
            onClick={() => setSearchOpen(true)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
          >🔍 Search</button>
          <button
            style={{ flex: 1, padding: '7px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text2)', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', transition: 'all 0.15s' }}
            onClick={() => setModalOpen(true)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
          >+ New</button>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
        {/* TOPBAR */}
        <div style={{ height: '52px', minHeight: '52px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: isMobile ? '0 12px' : '0 20px', gap: '8px' }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--surface2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'var(--text2)' }}>☰</button>
          )}
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? '14px' : '16px', fontWeight: '700', flex: 1, minWidth: 0 }}>{pageTitles[currentPage]}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px' }}>
            <Link to="/"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: '12px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
            >
              ← {isMobile ? '' : 'Main Website'}
            </Link>
            <button
              style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--surface2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'var(--text2)', transition: 'all 0.15s' }}
              onClick={() => setSearchOpen(true)}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >🔍</button>
            {!isMobile && (
              <>
                <button onClick={() => setCurrentPage('notifications')} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--surface2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'var(--text2)', position: 'relative', transition: 'all 0.15s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>🔔{notifications.filter(n => !n.is_read).length > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--red)', color: 'white', fontSize: '9px', fontWeight: '700', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{notifications.filter(n => !n.is_read).length}</span>}</button>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ New Task</button>
              </>
            )}
            {isMobile && (
              <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => setModalOpen(true)}>+</button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div className={`page ${currentPage === 'dashboard' ? 'active' : ''}`} style={{ flexDirection: 'column', overflow: 'auto', padding: '24px', gap: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(79,124,255,0.1), rgba(124,92,252,0.1))', border: '1px solid rgba(79,124,255,0.2)', borderRadius: '10px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '28px' }}>👋</div>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: '700', marginBottom: '3px' }}>
                  {(() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; })()}, {currentUser?.full_name?.split(' ')[0] || 'there'}!
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
                  {notifications.filter(n => !n.is_read).length > 0
                    ? `You have ${notifications.filter(n => !n.is_read).length} unread notification${notifications.filter(n => !n.is_read).length !== 1 ? 's' : ''}.`
                    : tasks.filter(t => t.status !== 'completed').length > 0
                      ? `You have ${tasks.filter(t => t.status !== 'completed').length} open task${tasks.filter(t => t.status !== 'completed').length !== 1 ? 's' : ''}.`
                      : "Everything is up to date. Great work!"}
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '14px' }}>
              {[
                { label: 'Messages', value: messages.length, delta: messages.length > 0 ? `${messages.length} total` : 'No messages yet', color: 'blue' },
                { label: 'Tasks Done', value: tasks.filter(t => t.status === 'completed').length, delta: `of ${tasks.length} total`, color: 'green' },
                { label: 'Open Tasks', value: tasks.filter(t => t.status !== 'completed').length, delta: tasks.filter(t => t.status !== 'completed').length > 0 ? 'pending' : 'all clear!', color: 'yellow' },
                { label: 'Team Members', value: teamMembers.length, delta: teamMembers.length > 0 ? `${teamMembers.length} members` : 'No members yet', color: 'red' },
              ].map((stat, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: stat.color === 'blue' ? 'linear-gradient(90deg, var(--accent), var(--accent2))' : stat.color === 'green' ? 'var(--green)' : stat.color === 'yellow' ? 'var(--yellow)' : 'var(--red)' }}></div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{stat.label}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: '700', margin: '4px 0' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: stat.color === 'green' ? 'var(--green)' : 'var(--text2)' }}>{stat.delta}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '14px', marginTop: '4px' }}>
              {[
                { icon: '💬', title: 'Send a Message', desc: 'Post to the team channel', page: 'messages' },
                { icon: '✅', title: 'Create a Task', desc: 'Add to the team task list', page: null, action: () => setModalOpen(true) },
                { icon: '📣', title: 'Post Announcement', desc: 'Share news with the team', page: null, action: () => setAnnModalOpen(true) },
                { icon: '👥', title: 'Team Directory', desc: 'View all team members', page: 'directory' },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => item.action ? item.action() : setCurrentPage(item.page)}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--surface2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
                >
                  <span style={{ fontSize: '22px', width: '36px', height: '36px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`page ${currentPage === 'messages' ? 'active' : ''}`} style={{ flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 ? (
                <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No messages yet. Start a conversation!</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f7cff, #7c5cfc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px', color: 'white' }}>{msg.sender_name?.charAt(0) || 'U'}</div>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>{msg.sender_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', marginLeft: 'auto' }}>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text2)' }}>{msg.message}</p>
                  </div>
                ))
              )}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px' }}>
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}
                  placeholder="Send a message to the team..."
                />
                <button onClick={sendMessage} disabled={!messageInput.trim()} style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', opacity: !messageInput.trim() ? 0.5 : 1 }}>Send ↑</button>
              </div>
            </div>
          </div>

          <div className={`page ${currentPage === 'tasks' ? 'active' : ''}`} style={{ flexDirection: 'column', padding: '20px', gap: '12px', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ New Task</button>
            </div>
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No tasks yet. Create one to get started!</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} style={{ background: 'var(--surface)', border: `1px solid ${task.status === 'completed' ? 'var(--green)' : 'var(--border)'}`, borderRadius: '10px', padding: '14px', opacity: task.status === 'completed' ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <button
                      onClick={() => updateTaskMutation.mutate({ id: task.id, status: task.status === 'completed' ? 'todo' : 'completed' })}
                      style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${task.status === 'completed' ? 'var(--green)' : 'var(--border2)'}`, background: task.status === 'completed' ? 'var(--green)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}
                    >{task.status === 'completed' ? '✓' : ''}</button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '14px', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.title}</div>
                      {task.description && <p style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '4px' }}>{task.description}</p>}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', background: task.status === 'completed' ? 'var(--green)' : task.status === 'in_progress' ? 'var(--accent)' : 'var(--surface3)', color: 'white', padding: '2px 8px', borderRadius: '6px' }}>{task.status || 'todo'}</span>
                        {task.priority && <span style={{ fontSize: '11px', background: task.priority === 'high' ? 'var(--red)' : task.priority === 'medium' ? 'var(--yellow)' : 'var(--surface3)', color: 'white', padding: '2px 8px', borderRadius: '6px' }}>{task.priority}</span>}
                        {task.assigned_to_email && <span style={{ fontSize: '11px', color: 'var(--text3)' }}>→ {task.assigned_to_email}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={`page ${currentPage === 'documents' ? 'active' : ''}`} style={{ flexDirection: 'column', padding: '24px', gap: '16px', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setDocModalOpen(true)}>+ New Document</button>
            </div>
            {documents.length === 0 ? (
              <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No documents yet.</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '14px' }}>{doc.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)' }}>by {doc.author_name}</div>
                    </div>
                    <span style={{ fontSize: '10px', background: 'var(--accent)', color: 'white', padding: '3px 8px', borderRadius: '4px' }}>{doc.category}</span>
                  </div>
                  {doc.description && <p style={{ fontSize: '12px', color: 'var(--text2)' }}>{doc.description}</p>}
                </div>
              ))
            )}
          </div>

          <div className={`page ${currentPage === 'announcements' ? 'active' : ''}`} style={{ flexDirection: 'column', padding: '24px', gap: '14px', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setAnnModalOpen(true)}>+ Post Announcement</button>
            </div>
            {announcements.length === 0 ? (
              <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No announcements yet.</p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f7cff, #7c5cfc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px', color: 'white', minWidth: '32px' }}>{ann.author_name?.charAt(0) || 'A'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{ann.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '4px' }}>{ann.author_name}</div>
                    </div>
                    {ann.is_pinned && <span style={{ fontSize: '14px' }}>📌</span>}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.5' }}>{ann.content}</p>
                </div>
              ))
            )}
          </div>

          <div className={`page ${currentPage === 'directory' ? 'active' : ''}`} style={{ flexDirection: 'column', padding: '24px', gap: '16px', overflow: 'auto' }}>
            {teamMembers.length === 0 ? (
              <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No team members found.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '14px' }}>
                {teamMembers.map((member) => (
                  <div key={member.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f7cff, #7c5cfc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', color: 'white', minWidth: '40px' }}>{member.full_name?.charAt(0) || 'M'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{member.full_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{member.department}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '4px' }}>{member.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`page ${currentPage === 'profile' ? 'active' : ''}`} style={{ flexDirection: 'column', padding: '24px', gap: '0', overflow: 'auto' }}>
            {/* Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1a2040 0%, #0f1626 50%, #1a1040 100%)', borderRadius: '12px 12px 0 0', height: '130px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(79,124,255,0.3), transparent 60%), radial-gradient(circle at 70% 50%, rgba(124,92,252,0.2), transparent 60%)' }}></div>
            </div>
            {/* Profile card */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '0 24px 24px', marginBottom: '20px' }}>
              {/* Avatar */}
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '24px', color: 'white', border: '3px solid var(--bg)', marginTop: '-36px', marginBottom: '12px' }}>
                {currentUser?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '?'}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>{currentUser?.full_name || (currentUser ? currentUser.email?.split('@')[0] : 'Not signed in')}</div>
              {currentUser?.email && <div style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '8px' }}>{currentUser.email}</div>}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: 'var(--text2)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)' }}></span>
                {(currentUser?.role || 'team_member').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            </div>
            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '14px' }}>
              {[
                { label: 'Department', value: currentUser?.department || '—', icon: '🏢' },
                { label: 'Phone', value: currentUser?.phone || '—', icon: '📞' },
                { label: 'Member Since', value: currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—', icon: '📅' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '18px', marginBottom: '6px' }}>{item.icon}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`page ${currentPage === 'dm' ? 'active' : ''}`} style={{ flexDirection: 'column', padding: '24px', gap: '16px', overflow: 'auto' }}>
            {teamMembers.length === 0 ? (
              <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No team members found. Add members to start chatting.</p>
            ) : (
              teamMembers.filter(m => m.email !== currentUser?.email).map((member) => (
                <div key={member.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onClick={() => setCurrentPage('messages')}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f7cff, #7c5cfc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px', color: 'white' }}>{member.full_name?.charAt(0) || 'M'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '13px' }}>{member.full_name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{member.email}</div>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--accent)' }}>Message →</span>
                </div>
              ))
            )}
          </div>

          <div className={`page ${currentPage === 'ai' ? 'active' : ''}`} style={{ flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
            <div ref={aiChatRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {aiMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤖</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '6px' }}>Synergy Hub AI Assistant</div>
                  <div style={{ fontSize: '13px', marginBottom: '28px' }}>Your smart workspace companion — ask anything or pick a suggestion below.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '560px', margin: '0 auto' }}>
                    {[
                      '📝 Draft a team announcement',
                      '✅ How do I manage tasks?',
                      '📨 Write a message to the team',
                      '💡 Give me productivity tips',
                      '👥 How to use the team directory?',
                      '📅 Help me plan my week',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => { setAiInput(suggestion.replace(/^[^ ]+ /, '')); }}
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: '20px', padding: '8px 16px', color: 'var(--text2)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif' " }}
                        onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
                        onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text2)'; }}
                      >{suggestion}</button>
                    ))}
                  </div>
                </div>
              )}
              {aiMessages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'ai' && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginRight: '8px', flexShrink: 0, marginTop: '2px' }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: '75%',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--surface2)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: 'var(--text)',
                    whiteSpace: 'pre-wrap',
                  }}>{msg.text}</div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🤖</div>
                  <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '10px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0,1,2].map(i => <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: `bounce 1.2s ${i*0.2}s ease-in-out infinite`, opacity: 0.7 }} />)}
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ maxWidth: '700px', margin: '0 auto', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px' }}>
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendAI()}
                  disabled={aiLoading}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', opacity: aiLoading ? 0.5 : 1 }}
                  placeholder="Ask anything about your workspace..."
                />
                <button onClick={sendAI} disabled={aiLoading || !aiInput.trim()} style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: aiLoading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '500', opacity: aiLoading || !aiInput.trim() ? 0.5 : 1 }}>Send ↑</button>
              </div>
            </div>
          </div>

          <div className={`page ${currentPage === 'notifications' ? 'active' : ''}`} style={{ flexDirection: 'column', padding: '24px', gap: '12px', overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No notifications yet.</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} onClick={() => markNotificationRead.mutate(notif.id)} style={{ background: 'var(--surface)', border: `1px solid ${notif.is_read ? 'var(--border)' : 'var(--accent)'}`, borderRadius: '10px', padding: '12px 16px', cursor: 'pointer', opacity: notif.is_read ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <div style={{ fontSize: '16px' }}>
                      {notif.type === 'message' && '💬'}
                      {notif.type === 'mention' && '🔗'}
                      {notif.type === 'task_assigned' && '✅'}
                      {notif.type === 'announcement' && '📣'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>{notif.type?.replace(/_/g, ' ') || 'Notification'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{notif.message}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && isMobile && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0, 0, 0, 0.5)' }} />
      )}

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          isMobile={isMobile}
          messages={messages}
          tasks={tasks}
          documents={documents}
          announcements={announcements}
          onNavigate={(page) => { setCurrentPage(page); setSearchOpen(false); }}
        />
      )}

      {/* DOCUMENT MODAL */}
      {docModalOpen && (
        <div onClick={() => setDocModalOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 8888, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '16px' : '0' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '14px', padding: '24px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '18px' }}>New Document</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text2)' }}>Title</label>
              <input value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontSize: '14px', outline: 'none', width: '100%' }} placeholder="Document title..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text2)' }}>Content</label>
              <textarea value={newDocContent} onChange={(e) => setNewDocContent(e.target.value)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontSize: '14px', outline: 'none', width: '100%', resize: 'none' }} rows="4" placeholder="Document content..." />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button className="btn btn-secondary" onClick={() => setDocModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateDocument} disabled={createDocumentMutation.isPending}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {annModalOpen && (
        <div onClick={() => setAnnModalOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 8888, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '16px' : '0' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '14px', padding: '24px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '18px' }}>Post Announcement</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text2)' }}>Title</label>
              <input value={newAnnTitle} onChange={(e) => setNewAnnTitle(e.target.value)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontSize: '14px', outline: 'none', width: '100%' }} placeholder="Announcement title..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text2)' }}>Content</label>
              <textarea value={newAnnContent} onChange={(e) => setNewAnnContent(e.target.value)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontSize: '14px', outline: 'none', width: '100%', resize: 'none' }} rows="3" placeholder="Write the announcement..." />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button className="btn btn-secondary" onClick={() => setAnnModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateAnnouncement} disabled={createAnnouncementMutation.isPending}>Post</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 8888, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '16px' : '0' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '14px', padding: isMobile ? '18px' : '24px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '18px' }}>Create New Task</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text2)' }}>Task Title</label>
              <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontSize: '14px', outline: 'none', width: '100%' }} placeholder="What needs to be done?" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text2)' }}>Description</label>
              <textarea value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontSize: '14px', outline: 'none', width: '100%', resize: 'none' }} rows="2" placeholder="Add details..." />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateTask}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}