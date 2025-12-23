
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { WeightEntry } from '../types';

interface WeightChartProps {
  data: WeightEntry[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center opacity-20">
        <i className="fa-solid fa-chart-line text-4xl mb-2 text-white"></i>
        <span className="text-[10px] font-black uppercase tracking-widest text-white">Sem dados analíticos</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="neonBlueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis 
            dataKey="date" 
            tick={{fontSize: 10, fontWeight: 900, fill: '#FFFFFF'}} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']} 
            tick={{fontSize: 10, fontWeight: 900, fill: '#10b981'}}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: '2px solid #22d3ee', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
              fontSize: '12px',
              fontWeight: 900,
              padding: '12px',
              backgroundColor: '#000000',
              color: '#fff'
            }}
            labelStyle={{ color: '#22d3ee', marginBottom: '4px', textTransform: 'uppercase' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Area 
            type="monotone" 
            dataKey="weight" 
            stroke="#22d3ee" 
            strokeWidth={5}
            fillOpacity={1} 
            fill="url(#neonBlueGradient)" 
            animationDuration={2500}
            activeDot={{ r: 8, stroke: '#000', strokeWidth: 3, fill: '#10b981' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
