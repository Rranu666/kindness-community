import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'magic'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate(redirectTo);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError('');
      setMode('login');
      setLoading(false);
      setError('Account created! Please check your email to confirm, then log in.');
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + redirectTo },
    });
    if (error) {
      setError(error.message);
    } else {
      setMagicSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] to-[#1B2B22] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30 mb-4">
            <span className="text-2xl">💚</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Kindness Community</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to access your dashboard</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Mode tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
            {[['login', 'Sign In'], ['signup', 'Sign Up'], ['magic', 'Magic Link']].map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setMagicSent(false); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {magicSent ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">📬</div>
              <h3 className="text-white font-bold text-lg mb-2">Check your email</h3>
              <p className="text-slate-400 text-sm">We sent a magic link to <strong className="text-white">{email}</strong>. Click it to sign in.</p>
              <button onClick={() => setMagicSent(false)} className="mt-4 text-rose-400 text-sm hover:text-rose-300">
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleMagicLink}
              className="flex flex-col gap-4">

              {mode === 'signup' && (
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors text-sm"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors text-sm"
                />
              </div>

              {mode !== 'magic' && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {error && (
                <p className={`text-sm text-center rounded-lg px-3 py-2 ${
                  error.includes('created') ? 'text-green-400 bg-green-500/10' : 'text-rose-400 bg-rose-500/10'
                }`}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Magic Link'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Kindness Community Foundation · Powered by Supabase
        </p>
      </motion.div>
    </div>
  );
}
