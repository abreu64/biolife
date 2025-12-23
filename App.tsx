
import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  Gender, 
  ActivityLevel, 
  Goal, 
  WeightEntry, 
  MealPlan 
} from './types';
import { 
  calculateBMI, 
  getBMICategory,
  exportToCSV
} from './utils/calculations';
import { generateMealPlan } from './services/geminiService';
import BMIGauge from './components/BMIGauge';
import WeightChart from './components/WeightChart';

const STORAGE_KEY_PROFILE = 'biolife_v3_profile';
const STORAGE_KEY_HISTORY = 'biolife_v3_history';
const STORAGE_KEY_MEALPLAN = 'biolife_v3_mealplan';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    return saved ? JSON.parse(saved) : {
      age: 30,
      gender: Gender.MALE,
      height: 175,
      weight: 70,
      activityLevel: ActivityLevel.MODERATELY_ACTIVE,
      goal: Goal.MAINTAIN
    };
  });

  const [history, setHistory] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MEALPLAN);
    return saved ? JSON.parse(saved) : null;
  });

  const [loadingMeals, setLoadingMeals] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'meals'>('dashboard');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (mealPlan) {
      localStorage.setItem(STORAGE_KEY_MEALPLAN, JSON.stringify(mealPlan));
    }
  }, [mealPlan]);

  const currentBmi = calculateBMI(profile.weight, profile.height);

  const addWeightEntry = () => {
    const bmi = calculateBMI(profile.weight, profile.height);
    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      weight: profile.weight,
      bmi: bmi
    };
    setHistory(prev => [newEntry, ...prev]);
    setActiveTab('dashboard');
  };

  const deleteHistoryEntry = (id: string) => {
    if (confirm("Deseja remover este registro do histórico?")) {
      setHistory(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const clearAllHistory = () => {
    if (confirm("ATENÇÃO: Isso apagará TODOS os dados do histórico. Continuar?")) {
      setHistory([]);
    }
  };

  const handleGenerateMeals = async () => {
    setLoadingMeals(true);
    try {
      const plan = await generateMealPlan(profile);
      setMealPlan(plan);
      setActiveTab('meals');
    } catch (error) {
      alert("Erro ao conectar com a IA. Verifique sua conexão.");
    } finally {
      setLoadingMeals(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col max-w-md mx-auto relative pb-24 font-sans antialiased text-white selection:bg-cyan-500 overflow-x-hidden">
      
      {/* Glossy Header Original */}
      <header className="p-6 bg-black/80 backdrop-blur-2xl flex items-center justify-between sticky top-0 z-50 border-b border-cyan-500/40 shadow-[0_4px_30px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] transform -rotate-3 border-2 border-white/20">
            <i className="fa-solid fa-dna text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-[900] tracking-tighter text-white leading-none uppercase">Bio LIFE</h1>
            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em] mt-1">SAÚDE CONECTADA</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportToCSV(history)}
            className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black transition-all"
            title="Exportar CSV"
          >
            <i className="fa-solid fa-file-export"></i>
          </button>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-6">
        
        {/* VIEW: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="glossy-black p-8 rounded-[3rem] flex flex-col items-center border-cyan-500/40">
              <BMIGauge bmi={currentBmi} />
              <div className={`mt-6 px-6 py-2 rounded-full text-[11px] font-black ${getBMICategory(currentBmi).color} bg-white/5 border border-current uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
                {getBMICategory(currentBmi).label}
              </div>
            </div>

            <div className="glossy-black p-6 rounded-[2.5rem] h-64 border-cyan-500/40 shadow-inner">
              <h3 className="font-black text-white text-xs mb-4 flex items-center gap-2 uppercase tracking-widest">
                <i className="fa-solid fa-chart-area text-cyan-400"></i>
                EVOLUÇÃO
              </h3>
              <WeightChart data={[...history].reverse()} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.3em]">Logs de Atividade</h3>
                {history.length > 0 && (
                  <button 
                    onClick={clearAllHistory}
                    className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors"
                  >
                    Limpar Tudo
                  </button>
                )}
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {history.length > 0 ? (
                  history.map(entry => (
                    <div key={entry.id} className="glossy-black p-5 rounded-[2rem] flex items-center justify-between border-cyan-500/20 hover:border-emerald-500 transition-all group relative overflow-hidden bg-black/60">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-lg flex flex-col items-center justify-center text-cyan-400 border border-cyan-500/30">
                          <span className="text-[9px] font-black">{entry.date.split('/')[0]}</span>
                          <span className="text-sm font-black">{entry.date.split('/')[1]}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-white tracking-tighter">{entry.weight}kg</span>
                          <span className="text-[9px] font-bold text-slate-500">IMC {entry.bmi}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteHistoryEntry(entry.id)}
                        className="w-10 h-10 rounded-full bg-black/50 border border-slate-800 flex items-center justify-center text-slate-600 hover:text-rose-500 hover:border-rose-500/50 transition-all"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                     <i className="fa-solid fa-history text-4xl mb-3 text-slate-800"></i>
                     <p className="text-[10px] font-black uppercase text-slate-700">O histórico será gerado aqui</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-white px-2 tracking-tighter flex items-center gap-4">
              <i className="fa-solid fa-user-shield text-emerald-500"></i>
              BIOMETRIA
            </h2>
            
            <div className="glossy-black p-8 rounded-[3rem] space-y-8 border-cyan-500/30 bg-black/40">
              {[
                { label: 'IDADE', min: 15, max: 100, unit: 'Anos', key: 'age', icon: 'fa-id-card' },
                { label: 'ALTURA', min: 120, max: 230, unit: 'CM', key: 'height', icon: 'fa-ruler-vertical' },
                { label: 'PESO', min: 30, max: 200, unit: 'KG', key: 'weight', icon: 'fa-weight-hanging' }
              ].map(item => (
                <div key={item.key} className="space-y-4">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[11px] font-black text-slate-400 tracking-[0.2em] flex items-center gap-2 uppercase">
                      <i className={`fa-solid ${item.icon} text-cyan-500`}></i>
                      {item.label}
                    </label>
                    <span className="text-white font-black text-3xl tracking-tighter">
                      {(profile as any)[item.key]} <span className="text-[12px] text-cyan-400 uppercase font-black">{item.unit}</span>
                    </span>
                  </div>
                  <input 
                    type="range" min={item.min} max={item.max} 
                    value={(profile as any)[item.key]} 
                    onChange={(e) => setProfile({...profile, [item.key]: Number(e.target.value)})}
                    className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              ))}

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase px-1">Meta de Desempenho</label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.values(Goal).map(goal => (
                    <button
                      key={goal}
                      onClick={() => setProfile({...profile, goal})}
                      className={`p-5 rounded-2xl text-left text-xs font-black border-2 transition-all flex items-center justify-between ${profile.goal === goal ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-black text-slate-500 border-slate-800 hover:border-cyan-500'}`}
                    >
                      {goal}
                      <i className={`fa-solid fa-circle-check text-lg ${profile.goal === goal ? 'text-black' : 'text-transparent'}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={addWeightEntry}
                className="w-full py-6 bg-emerald-500 text-black rounded-[2rem] font-black shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:bg-emerald-400 transition-all flex items-center justify-center gap-4 text-xl active:scale-95 border-b-4 border-emerald-700"
              >
                <i className="fa-solid fa-sync-alt"></i>
                GRAVAR AGORA
              </button>
            </div>
          </div>
        )}

        {/* VIEW: MEALS */}
        {activeTab === 'meals' && (
          <div className="space-y-6 animate-in fade-in duration-500 pb-16">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <i className="fa-solid fa-dna text-emerald-500"></i>
                  CARDÁPIO IA
                </h2>
                <p className="text-[10px] text-cyan-400 font-bold mt-1 max-w-[240px] leading-tight uppercase tracking-wider">
                  Os dados persistirão até que um novo cardápio seja solicitado.
                </p>
              </div>
              <button 
                onClick={handleGenerateMeals}
                disabled={loadingMeals}
                className="w-12 h-12 bg-black border border-cyan-500/40 text-cyan-400 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all active:scale-90 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              >
                {loadingMeals ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>}
              </button>
            </div>

            {mealPlan ? (
              <div className="space-y-5">
                <div className="glossy-black p-8 rounded-[3rem] bg-gradient-to-br from-emerald-600 to-black text-white border-cyan-500/40 relative overflow-hidden shadow-2xl">
                  <div className="relative z-10">
                    <p className="text-[11px] font-black uppercase mb-1 text-white/70 tracking-[0.3em]">Cálculo Calórico Diário</p>
                    <p className="text-6xl font-black tracking-tighter">{mealPlan.calories} <span className="text-xl font-medium opacity-70">kcal</span></p>
                  </div>
                  <i className="fa-solid fa-bolt absolute -right-6 -bottom-6 text-white/10 text-9xl"></i>
                </div>

                {[
                  { key: 'breakfast', icon: 'fa-mug-hot' },
                  { key: 'lunch', icon: 'fa-utensils' },
                  { key: 'snack', icon: 'fa-cookie' },
                  { key: 'dinner', icon: 'fa-moon' }
                ].map(meal => {
                  const data = (mealPlan as any)[meal.key];
                  return (
                    <div key={meal.key} className="glossy-black p-6 rounded-[2.5rem] border-cyan-500/30 group bg-black/40">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                          <i className={`fa-solid ${meal.icon} text-xl`}></i>
                        </div>
                        <div>
                          <h4 className="font-black text-white text-lg leading-tight">{data.title}</h4>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Refeição Otimizada</p>
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-4">
                        <p className="text-xs text-slate-300 font-bold leading-relaxed italic">
                          {data.description}
                        </p>
                      </div>
                      <ul className="space-y-3 px-1">
                        {data.items.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-4 text-[13px] text-white font-[800]">
                            <i className="fa-solid fa-circle-check text-emerald-500 mt-1"></i>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-10 border-2 border-dashed border-cyan-500/20 rounded-[3rem] bg-emerald-900/5">
                <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] mb-8">
                  <i className="fa-solid fa-robot text-4xl"></i>
                </div>
                <h3 className="text-white font-black mb-4 text-2xl tracking-tighter">Gerar Cardapio</h3>
                <p className="text-slate-500 text-sm font-bold mb-10 leading-relaxed">Personalização de alta fidelidade persistente.</p>
                <button 
                  onClick={handleGenerateMeals}
                  className="w-full py-6 bg-emerald-500 text-black rounded-[2rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-xl"
                >
                  PROCESSAR DIETA
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Glossy Navigation Original */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/90 backdrop-blur-2xl border-t border-cyan-500/30 px-10 py-6 flex justify-between items-center z-50 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] rounded-t-[3rem]">
        {[
          { id: 'profile', icon: 'fa-id-card', label: 'PERFIL' },
          { id: 'dashboard', icon: 'fa-layer-group', label: 'HOME' },
          { id: 'meals', icon: 'fa-utensils', label: 'IA NUTRI' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-2 transition-all relative group ${activeTab === tab.id ? 'text-emerald-500' : 'text-slate-600'}`}
          >
            {activeTab === tab.id && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]"></div>
            )}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-emerald-500/10 shadow-inner scale-110' : 'bg-transparent group-hover:text-cyan-400'}`}>
              <i className={`fa-solid ${tab.icon} text-2xl`}></i>
            </div>
            <span className="text-[10px] font-black tracking-[0.2em]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
