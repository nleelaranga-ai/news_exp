import React, { useState } from 'react';
import { IntelligenceReport, UserRole } from '../types';
import { generateIntelligence } from '../services/intelligence';
import { EntityGraph } from './EntityGraph';
import { Timeline } from './Timeline';
import { CausalChain } from './CausalChain';
import { ScenarioPanel } from './ScenarioPanel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Zap, 
  Network, 
  History, 
  ArrowRightLeft, 
  Eye, 
  Target, 
  AlertCircle,
  Loader2,
  PlusCircle,
  X
} from 'lucide-react';

export const IntelligenceDashboard: React.FC = () => {
  const [newsInputs, setNewsInputs] = useState<string[]>(['']);
  const [userRole, setUserRole] = useState<UserRole>('investor');
  const [report, setReport] = useState<IntelligenceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'graph' | 'timeline' | 'causal' | 'scenarios'>('graph');

  const handleAddInput = () => setNewsInputs([...newsInputs, '']);
  const handleRemoveInput = (index: number) => setNewsInputs(newsInputs.filter((_, i) => i !== index));
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...newsInputs];
    newInputs[index] = value;
    setNewsInputs(newInputs);
  };

  const processIntelligence = async () => {
    const validInputs = newsInputs.filter(n => n.trim().length > 0);
    if (validInputs.length === 0) return;

    setLoading(true);
    try {
      const result = await generateIntelligence(validInputs, userRole);
      setReport(result);
    } catch (error) {
      console.error('Failed to generate intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <Zap size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">BIZINTEL</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Intelligence Engine v1.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['student', 'investor', 'founder'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                  userRole === role ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {!report && !loading ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black tracking-tighter leading-none">
                TRANSFORM NEWS INTO <span className="text-blue-600">INTELLIGENCE</span>
              </h2>
              <p className="text-gray-500 text-lg">
                Paste fragmented news articles below. Our multi-agent system will synthesize them into a unified intelligence model.
              </p>
            </div>

            <div className="space-y-4">
              {newsInputs.map((input, index) => (
                <div key={index} className="relative group">
                  <textarea
                    value={input}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`Paste news article ${index + 1} content...`}
                    className="w-full h-32 p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-sm"
                  />
                  {newsInputs.length > 1 && (
                    <button
                      onClick={() => handleRemoveInput(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              <div className="flex gap-4">
                <button
                  onClick={handleAddInput}
                  className="flex-1 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
                >
                  <PlusCircle size={16} />
                  Add Source
                </button>
                <button
                  onClick={processIntelligence}
                  className="flex-[2] py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                >
                  <Search size={16} />
                  Synthesize Intelligence
                </button>
              </div>
            </div>
          </motion.div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Synthesizing Story System</h3>
              <p className="text-gray-400 font-mono text-xs animate-pulse">
                AGENTS ACTIVE: EXTRACTION, GRAPH, SCENARIO, PERSONALIZATION...
              </p>
            </div>
          </div>
        ) : report && (
          <div className="space-y-12">
            {/* Core Insight Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">Core Intelligence Insight</div>
                <h2 className="text-3xl font-black tracking-tight leading-tight max-w-4xl">
                  {report.coreInsight}
                </h2>
              </div>
              <div className="absolute top-[-20%] right-[-10%] opacity-10">
                <Zap size={300} />
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Navigation & Meta */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                  <NavButton 
                    active={activeTab === 'graph'} 
                    onClick={() => setActiveTab('graph')}
                    icon={<Network size={18} />}
                    label="Entity Graph"
                  />
                  <NavButton 
                    active={activeTab === 'timeline'} 
                    onClick={() => setActiveTab('timeline')}
                    icon={<History size={18} />}
                    label="Story Timeline"
                  />
                  <NavButton 
                    active={activeTab === 'causal'} 
                    onClick={() => setActiveTab('causal')}
                    icon={<ArrowRightLeft size={18} />}
                    label="Causal Chain"
                  />
                  <NavButton 
                    active={activeTab === 'scenarios'} 
                    onClick={() => setActiveTab('scenarios')}
                    icon={<Eye size={18} />}
                    label="Future Scenarios"
                  />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      <Target size={12} />
                      Personalized for {userRole}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{report.personalizedInsight}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      <AlertCircle size={12} />
                      Key Uncertainties
                    </div>
                    <ul className="space-y-2">
                      {report.uncertainties.map((u, i) => (
                        <li key={i} className="text-xs text-gray-500 flex gap-2">
                          <span className="text-blue-500">•</span>
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={() => setReport(null)}
                  className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all"
                >
                  New Synthesis
                </button>
              </div>

              {/* Right Column: Active View */}
              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'graph' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-black uppercase tracking-tighter">Entity Relationship Graph</h3>
                          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Company</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Person</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Sector</span>
                          </div>
                        </div>
                        <EntityGraph entities={report.entities} relationships={report.relationships} />
                      </div>
                    )}

                    {activeTab === 'timeline' && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Synthesized Story Timeline</h3>
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                          <Timeline events={report.timeline} />
                        </div>
                      </div>
                    )}

                    {activeTab === 'causal' && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Causal Intelligence Chain</h3>
                        <CausalChain links={report.causalChain} />
                      </div>
                    )}

                    {activeTab === 'scenarios' && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Forward-Looking Scenarios</h3>
                        <ScenarioPanel scenarios={report.scenarios} />
                        
                        <div className="mt-12 p-8 bg-blue-600 text-white rounded-[2rem] shadow-xl">
                          <div className="text-[10px] font-bold text-blue-200 uppercase tracking-[0.3em] mb-4">Actionable Signals to Watch</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report.signals.map((signal, i) => (
                              <div key={i} className="flex items-start gap-3 bg-white/10 p-4 rounded-xl">
                                <div className="mt-1 text-blue-200"><Zap size={14} /></div>
                                <div className="text-sm font-medium">{signal}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
    }`}
  >
    {icon}
    {label}
  </button>
);
