import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="font-body min-h-screen flex items-center justify-center p-6 selection:bg-primary-container selection:text-on-primary-container bg-[#131313] text-[#e5e2e1]">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[150px]"></div>
      </div>
      <main className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-stretch bg-surface-container rounded-xl overflow-hidden editorial-shadow border border-outline-variant/10 shadow-[0_32px_64px_-4px_rgba(14,14,14,0.4)]">
        <section className="hidden md:flex md:w-1/2 p-12 flex-col justify-between relative bg-surface-container-low overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-headline font-bold italic text-primary leading-none tracking-tighter">
              AI Learning Companion
            </h1>
            <p className="mt-4 font-body text-on-surface-variant max-w-xs leading-relaxed">
              Master complex topics with personalized AI guidance and mistake analysis.
            </p>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1">auto_stories</span>
              <div>
                <h3 className="text-on-surface font-semibold text-sm font-label uppercase tracking-widest">The Tutor</h3>
                <p className="text-on-surface-variant text-sm mt-1">Deep learning for your academic growth.</p>
              </div>
            </div>
            <div className="pt-8 border-t border-outline-variant/20">
              <p className="text-xs font-label text-on-surface-variant/60 tracking-widest uppercase italic">
                © 2026 Student Protocol
              </p>
            </div>
          </div>
        </section>
        
        <section className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-surface">
          <div className="max-w-sm mx-auto w-full">
            <header className="mb-10">
              <h2 className="text-4xl font-headline font-bold text-on-surface mb-2">Secure Access</h2>
              <p className="text-on-surface-variant font-body">Verification required to proceed.</p>
            </header>
            
            {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-label font-medium uppercase tracking-widest text-primary" htmlFor="email">
                  Fellowship Email
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-surface-container-lowest border-0 rounded-lg py-4 pl-4 pr-12 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary focus:bg-surface-container-high transition-all duration-300" 
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-label font-medium uppercase tracking-widest text-primary" htmlFor="password">
                    Security Key
                  </label>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    id="password" 
                    className="w-full bg-surface-container-lowest border-0 rounded-lg py-4 pl-4 pr-12 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary focus:bg-surface-container-high transition-all duration-300" 
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 px-6 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-label font-semibold text-sm uppercase tracking-[0.2em] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                {isLogin ? 'Authenticate' : 'Request Access'}
              </button>
            </form>
            
            <footer className="mt-12 text-center">
              <p className="text-on-surface-variant text-sm font-body">
                {isLogin ? 'New Fellow?' : 'Already a Fellow?'}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline underline-offset-4 ml-1">
                  {isLogin ? 'Request Access' : 'Authenticate'}
                </button>
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
