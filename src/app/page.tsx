'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Users, DollarSign, Activity, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface AnalyticsData {
  metrics: {
    totalTeams: number;
    totalPlayers: number;
    totalPrizeMoney: string;
  };
  chartData: { name: string; value: string }[];
}

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://nexus-gg-api.onrender.com/api/analytics')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading command center...</div>;
  if (!data) return <div className="p-8 text-red-400">Failed to load analytics.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
     <header className="border-b border-slate-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="text-blue-400 h-8 w-8" /> 
            Platform Analytics
          </h1>
          <p className="text-slate-400 mt-2">Live overview of your esports ecosystem.</p>
        </div>

        <Link 
          href="/tournaments/new" 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Tournament
        </Link>
      </header>
      

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
          <div className="h-14 w-14 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <DollarSign className="h-7 w-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Prize Pool Distributed</p>
            <p className="text-3xl font-black text-white">
              ${Number(data.metrics.totalPrizeMoney).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
          <div className="h-14 w-14 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Users className="h-7 w-7 text-blue-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Active Registered Teams</p>
            <p className="text-3xl font-black text-white">{data.metrics.totalTeams}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
          <div className="h-14 w-14 bg-purple-500/10 rounded-full flex items-center justify-center">
            <Trophy className="h-7 w-7 text-purple-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Players</p>
            <p className="text-3xl font-black text-white">{data.metrics.totalPlayers}</p>
          </div>
        </div>
      </div>

      {/* Data Visualization Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Top Tournaments by Prize Pool</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chartData}>
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                cursor={{fill: '#1e293b'}}
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f8fafc' }}
                itemStyle={{ color: '#10b981' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Prize Pool']}
              />
              <Bar 
                dataKey="value" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}