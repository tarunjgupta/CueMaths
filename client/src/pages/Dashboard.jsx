import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ progress: [], recent_attempts: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/problem/dashboard');
        setData(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchDashboard();
  }, [user]);

  const solvedCount = data.recent_attempts.length;
  const overallAccuracy = data.progress.length > 0
    ? (data.progress.reduce((acc, p) => acc + parseFloat(p.accuracy), 0) / data.progress.length).toFixed(1)
    : 0;

  return (
    <div className="font-body selection:bg-primary-container selection:text-on-primary-container bg-background min-h-screen text-[#e5e2e1]">
      <header className="bg-[#131313]/60 backdrop-blur-xl docked full-width top-0 z-50 fixed shadow-[0_32px_64px_-4px_rgba(14,14,14,0.4)]">
        <nav className="flex justify-between items-center w-full px-8 h-20">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-serif italic text-[#b1c5ff]">AI Learning Companion</span>
            <div className="hidden md:flex gap-6 items-center">
              <span className="text-[#b1c5ff] border-b-2 border-[#b1c5ff] pb-1 font-label text-sm uppercase tracking-widest cursor-default">Dashboard</span>
              <button onClick={() => navigate('/practice')} className="text-[#c3c6d5] hover:text-[#b1c5ff] transition-colors duration-300 font-label text-sm uppercase tracking-widest">Practice</button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[#b1c5ff]">
              <button className="active:scale-95 transition-transform"><span className="material-symbols-outlined">notifications</span></button>
              <button className="active:scale-95 transition-transform" onClick={() => logout()}><span className="material-symbols-outlined">logout</span></button>
              <div className="h-10 w-10 rounded-full overflow-hidden border border-outline-variant bg-[#2a2a2a] flex items-center justify-center">
                 <span className="text-sm font-bold">{user?.email?.[0]?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </nav>
      </header>
      
      <div className="flex pt-20">
        <aside className="bg-[#1c1b1b] h-screen w-72 left-0 top-0 fixed bg-gradient-to-r from-[#1c1b1b] to-[#131313] flex-col py-8 px-6 gap-y-6 hidden md:flex z-40 mt-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            </div>
            <div>
              <h2 className="font-serif font-bold text-[#b1c5ff]">{user?.email?.split('@')[0]}</h2>
              <p className="text-xs font-label text-[#c3c6d5] uppercase tracking-tighter">Student</p>
            </div>
          </div>
          
          <button onClick={() => navigate('/practice')} className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-label font-bold py-3 px-4 rounded-md shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform duration-200">
            <span className="material-symbols-outlined">add</span>
            New Problem
          </button>
          
          <nav className="flex flex-col gap-2 mt-4">
            <button className="text-[#b1c5ff] font-bold bg-[#2a2a2a] rounded-md flex items-center gap-3 py-3 px-4 duration-200 ease-in-out w-full text-left">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-serif tracking-tight">Dashboard</span>
            </button>
            <button onClick={() => navigate('/solve')} className="text-[#c3c6d5] hover:bg-[#201f1f] hover:text-[#e5e2e1] rounded-md flex items-center gap-3 py-3 px-4 duration-200 ease-in-out w-full text-left">
              <span className="material-symbols-outlined">auto_fix</span>
              <span className="font-serif tracking-tight">AI Solve Assistant</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 md:ml-72 p-8 bg-background min-h-screen">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-2 tracking-tight">Student Progress</h1>
            <p className="text-on-surface-variant font-body italic text-lg opacity-80">Track your learning journey.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-[#3366cc] to-[#b1c5ff] rounded-xl p-8 flex flex-col justify-between h-48 group cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="flex justify-between items-start">
                    <span className="material-symbols-outlined text-on-primary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                  </div>
                  <div>
                    <h4 className="text-on-primary text-sm font-label font-bold uppercase tracking-wider">Problems Solved</h4>
                    <p className="text-white text-5xl font-headline font-bold leading-none">{solvedCount}</p>
                  </div>
                </div>

                <div className="bg-surface-container-high rounded-xl p-8 flex flex-col justify-between h-48 border border-outline-variant/20 hover:bg-surface-bright transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="material-symbols-outlined text-primary text-4xl">analytics</span>
                  </div>
                  <div>
                    <h4 className="text-on-surface-variant text-sm font-label font-bold uppercase tracking-wider">Overall Accuracy</h4>
                    <p className="text-on-surface text-5xl font-headline font-bold leading-none">{overallAccuracy}<span className="text-xl ml-2 font-normal opacity-60">%</span></p>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-container rounded-xl p-8 border border-outline-variant/10 shadow-xl overflow-hidden relative">
                <h3 className="font-headline text-2xl text-on-surface font-bold mb-6">Topic Mastery</h3>
                <div className="space-y-4">
                  {data.progress.length === 0 && <p className="text-sm text-on-surface-variant">No learning data yet.</p>}
                  {data.progress.map((prog, i) => (
                    <div key={i} className="flex flex-col max-w-lg">
                      <div className="flex justify-between font-label text-sm uppercase tracking-widest text-on-surface-variant mb-1">
                        <span>{prog.topic}</span>
                        <span>{parseFloat(prog.accuracy).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full border-r-[1px] border-[#131313]" style={{ width: `${prog.accuracy}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 mt-4 lg:mt-0">
              <div className="flex items-end gap-4 mb-8">
                <h3 className="font-headline text-2xl text-on-surface font-bold">Recent Attempts</h3>
              </div>
              <div className="flex flex-col gap-6">
                {data.recent_attempts.length === 0 && <p className="text-sm text-on-surface-variant">No recent activity.</p>}
                {data.recent_attempts.map((attempt) => (
                  <div key={attempt.id} className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 hover:border-primary/40 transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-2 py-1 bg-secondary-container text-on-secondary-container rounded text-[10px] font-label font-bold uppercase">{attempt.topic}</span>
                      <span className={`text-[10px] font-label font-bold uppercase ${attempt.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                        {attempt.is_correct ? 'Correct' : 'Mistaken'}
                      </span>
                    </div>
                    <p className="font-body text-sm text-on-surface line-clamp-3 mb-2">{attempt.question_text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
