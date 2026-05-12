import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Practice = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  
  const [activeProblem, setActiveProblem] = useState(null); // The follow up or initial parsed
  const [solutionSteps, setSolutionSteps] = useState([]);
  const [followUpQ, setFollowUpQ] = useState(null);

  const [userAnswer, setUserAnswer] = useState('');
  const [analysis, setAnalysis] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSolve = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const res = await api.post('/problem/solve', { question, difficulty, user_level: 'student' });
      setActiveProblem(res.data.problem_id);
      setSolutionSteps(res.data.steps || []);
      setFollowUpQ({
        text: res.data.follow_up,
        topic: res.data.topic
      });
      setAnalysis(null);
      setUserAnswer('');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!userAnswer || !activeProblem) return;
    setAnalyzing(true);
    try {
      const res = await api.post('/problem/analyze', {
        problem_id: activeProblem,
        user_answer: userAnswer,
        correct_answer: 'Rely on AI evaluation', // the logic is mostly prompt-driven
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
    }
    setAnalyzing(false);
  };

  return (
    <div className="font-body text-on-surface antialiased overflow-hidden selection:bg-primary-container selection:text-on-primary-container bg-background min-h-screen">
      <nav className="bg-[#131313]/60 backdrop-blur-xl text-[#e5e2e1] leading-relaxed fixed top-0 z-50 flex justify-between items-center w-full px-8 h-20 shadow-[0_32px_64px_-4px_rgba(14,14,14,0.4)]">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-serif italic text-[#b1c5ff]">AI Learning Companion</span>
          <div className="hidden md:flex gap-6 items-center">
            <button onClick={() => navigate('/dashboard')} className="text-[#c3c6d5] hover:text-[#b1c5ff] transition-colors duration-300 font-label text-sm uppercase tracking-widest">Dashboard</button>
            <span className="text-[#b1c5ff] border-b-2 border-[#b1c5ff] pb-1 font-label text-sm uppercase tracking-widest cursor-default">Practice</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="active:scale-95 transition-transform" onClick={() => logout()}><span className="material-symbols-outlined text-[#b1c5ff]">logout</span></button>
          <div className="h-10 w-10 rounded-full overflow-hidden border border-outline-variant bg-[#2a2a2a] flex items-center justify-center">
            <span className="text-sm font-bold text-[#b1c5ff]">{user?.email?.[0]?.toUpperCase()}</span>
          </div>
        </div>
      </nav>

      <aside className="hidden md:flex bg-[#1c1b1b] h-screen w-72 left-0 top-0 fixed flex-col py-8 px-6 gap-y-6 pt-24 bg-gradient-to-r from-[#1c1b1b] to-[#131313] z-40">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant/15">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-[#b1c5ff] leading-none">{user?.email?.split('@')[0]}</h3>
            <p className="font-label text-xs text-on-surface-variant mt-1">Student</p>
          </div>
        </div>
        <div className="space-y-1">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 py-3 px-4 text-[#c3c6d5] hover:bg-[#201f1f] duration-200 ease-in-out font-serif tracking-tight text-left">
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 py-3 px-4 text-[#b1c5ff] font-bold bg-[#2a2a2a] rounded-md duration-200 ease-in-out font-serif tracking-tight text-left">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            <span>Practice</span>
          </button>
        </div>
      </aside>

      <main className="ml-0 md:ml-72 pt-28 px-8 pb-12 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto max-h-screen">
        <header className="lg:col-span-12 mb-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight">Practice Laboratory</h1>
            <p className="text-primary font-label text-sm uppercase tracking-widest opacity-80">AI-Guided Problem Solving</p>
          </div>
        </header>

        <div className="lg:col-span-8 space-y-8">
          {/* Ask AI Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 shadow-xl relative overflow-hidden">
            <h2 className="text-xl font-headline italic text-on-surface mb-4">Ask the AI Tutor</h2>
            <div className="flex gap-4">
              <input 
                type="text" 
                className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:ring-1 focus:ring-primary"
                placeholder="Enter a math or logic problem..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
              <button 
                onClick={handleSolve} 
                disabled={loading}
                className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
                {loading ? 'Solving...' : 'Solve'}
              </button>
            </div>
          </section>

          {/* Solution & Follow Up */}
          {solutionSteps.length > 0 && (
            <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 shadow-xl relative overflow-hidden">
              <h2 className="text-2xl font-headline italic text-primary mb-4">Solution Steps</h2>
              <ul className="space-y-4 mb-8 text-on-surface/90">
                {solutionSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs mt-1">{idx+1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ul>
              
              {followUpQ && (
                <div className="mt-8 border-t border-outline-variant/20 pt-6">
                  <h3 className="font-headline text-lg text-on-surface mb-2 tracking-wide font-bold">Follow-Up Question For You</h3>
                  <p className="text-lg italic text-[#e7ebff]">{followUpQ.text}</p>
                </div>
              )}
            </section>
          )}

          {/* Input Your Answer */}
          {followUpQ && (
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Your Derivation</label>
              </div>
              <div className="bg-surface-container-lowest border border-primary/20 rounded-xl p-1 focus-within:shadow-[0_0_20px_rgba(177,197,255,0.1)] transition-all">
                <textarea 
                  className="w-full bg-transparent border-none focus:ring-0 font-serif text-xl p-6 min-h-[200px] text-on-surface placeholder:text-on-surface-variant/30 leading-loose" 
                  placeholder="Begin your proof or answer here..."
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                />
                <div className="flex justify-between items-center bg-surface-container-low px-6 py-4 rounded-b-lg">
                  <div className="flex gap-4 items-center">
                    {analyzing && <span className="flex items-center gap-2 text-on-surface-variant text-xs font-label">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Analyzing...
                    </span>}
                  </div>
                  <button 
                    onClick={handleAnalyze} 
                    disabled={analyzing}
                    className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-2 rounded-md font-label font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
                    {analyzing ? 'Processing...' : 'Submit Analysis'}
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Analysis */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10 sticky top-28">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-xl text-primary flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                AI Tutor's Analysis
              </h3>
              <span className="text-xs font-label text-on-surface-variant bg-surface-container px-2 py-1 rounded">Live Feedback</span>
            </div>

            <div className="space-y-8">
              {analysis ? (
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border 
                      ${analysis.is_correct ? 'bg-primary/10 border-primary/30' : 'bg-error-container/30 border-error/50'}`}>
                      <span className={`material-symbols-outlined text-[14px] ${analysis.is_correct ? 'text-primary' : 'text-error'}`}>
                        {analysis.is_correct ? 'check' : 'priority_high'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-label text-sm font-bold text-on-surface">
                        {analysis.is_correct ? 'Correct Methodology' : 'Conceptual Error Detected'}
                      </h4>
                      <p className="mt-2 font-serif text-sm text-on-surface-variant leading-relaxed">
                        {analysis.explanation}
                      </p>
                      {analysis.conceptual_gap && analysis.conceptual_gap !== 'None' && (
                        <p className="mt-2 font-serif text-sm text-error leading-relaxed italic">
                          Gap: {analysis.conceptual_gap}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-body text-on-surface-variant">Submit an answer to receive analysis.</p>
              )}
            </div>

            {analysis && (
              <div className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col gap-3">
                <div className="flex justify-between text-xs font-label text-on-surface-variant">
                  <span>Accuracy Tracking Logged</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Practice;
