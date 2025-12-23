
import React from 'react';

interface BMIGaugeProps {
  bmi: number;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi }) => {
  // Faixa de visualização: 15 a 40 de IMC
  const normalized = Math.min(Math.max(bmi, 15), 40);
  const percentage = ((normalized - 15) / (40 - 15)) * 100;

  // Lógica de cores original: Esmeralda (<25), Amarelo (25-30), Vermelho (>30)
  const getDynamicColor = () => {
    if (bmi < 25) return '#10b981'; // Esmeralda (Normal)
    if (bmi < 30) return '#fbbf24'; // Amarelo (Sobrepeso)
    return '#ef4444'; // Vermelho (Obesidade)
  };

  const currentColor = getDynamicColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Track Circular de fundo */}
        <div className="absolute inset-0 rounded-full border-[18px] border-slate-900 shadow-[inset_0_0_15px_black]"></div>
        
        {/* Gauge Segmentado em 3 Cores: Esmeralda, Amarelo, Vermelho */}
        <div 
          className="absolute inset-0 rounded-full border-[18px] border-transparent"
          style={{
            background: `conic-gradient(from 225deg, #10b981 0%, #10b981 30%, #fbbf24 30%, #fbbf24 45%, #ef4444 45%, #ef4444 75%, transparent 75%) padding-box, 
                        conic-gradient(from 225deg, #10b981 0%, #10b981 30%, #fbbf24 30%, #fbbf24 45%, #ef4444 45%, #ef4444 75%, transparent 75%) border-box`,
            mask: 'conic-gradient(from 225deg, black 0%, black 270deg, transparent 270deg)',
            WebkitMask: 'conic-gradient(from 225deg, black 0%, black 270deg, transparent 270deg)',
          }}
        ></div>

        {/* Reflexo Glossy */}
        <div className="absolute top-4 left-4 right-4 bottom-4 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

        {/* Núcleo Central */}
        <div className="w-40 h-40 bg-black rounded-full shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/5 flex flex-col items-center justify-center z-10">
          <span className="text-5xl font-[950] tracking-tighter leading-none" style={{ color: currentColor, textShadow: `0 0 20px ${currentColor}55` }}>
            {bmi}
          </span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">SCORE</span>
        </div>

        {/* Ponteiro (Needle) */}
        <div 
          className="absolute inset-0 z-20 transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${(percentage * 2.7) - 135}deg)` }}
        >
          <div 
            className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-28 rounded-full shadow-[0_0_15px_white]"
            style={{ backgroundColor: currentColor, boxShadow: `0 0 15px ${currentColor}` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-black" style={{ backgroundColor: currentColor }}></div>
          </div>
        </div>
      </div>
      <p className="text-[12px] text-cyan-400 uppercase tracking-[0.5em] font-black mt-4">Índice Bio LIFE</p>
    </div>
  );
};

export default BMIGauge;
