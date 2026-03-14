import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { MessageSquare, FileText, Megaphone, Users, Lock, Zap } from 'lucide-react';

export default function TeamPortalLanding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        // If admin or team member, redirect to portal
        if (currentUser) {
          navigate('/TeamPortal');
        }
      } catch (error) {
        console.error('Auth error:', error);
      }
    };
    checkAuth();
  }, [navigate]);

  const features = [
    {
      icon: MessageSquare,
      title: 'Real-time Messaging',
      description: 'Direct messages and group chats with your team members',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Upload, organize, and share documents securely',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Megaphone,
      title: 'Announcements',
      description: 'Stay informed with company-wide announcements',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      title: 'Team Directory',
      description: 'Connect with team members and view profiles',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Enterprise-grade security for your data',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Lightning-fast performance for seamless collaboration',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            KCF Team Portal
          </div>
          <button
            onClick={() => navigate('/TeamPortal')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 rounded-lg font-semibold transition-all duration-200"
          >
            Enter Portal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Team Communication <br />
          <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            Made Simple
          </span>
        </h1>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          A secure, all-in-one platform for your team to communicate, collaborate, and share. Built for Kindness Community.
        </p>
        <button
          onClick={() => navigate('/TeamPortal')}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          Access Team Portal →
        </button>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 shadow-lg group"
              >
                <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-pink-600 rounded-2xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to collaborate?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join your team in the KCF Team Portal and start communicating effectively today.
          </p>
          <button
            onClick={() => navigate('/TeamPortal')}
            className="px-8 py-3 bg-white hover:bg-slate-100 text-blue-600 font-semibold rounded-lg transition-all duration-200"
          >
            Enter Portal Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        <p>© 2026 Kindness Community. Team Portal.</p>
      </footer>
    </div>
  );
}