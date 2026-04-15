'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Users, DollarSign, Activity, Plus, Trash2 } from 'lucide-react'; // <-- Added Trash2
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
  const [tournaments, setTournaments] = useState<any[]>([]); // <-- Added state for the tournament list
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both Analytics AND the Tournament list at the same time
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, tournamentsRes] = await Promise.all([
          axios.get('https://nexus-gg-api.onrender.com/api/analytics'),
          axios.get('https://nexus-gg-api.onrender.com/api/tournaments')
        ]);
        
        setData(analyticsRes.data);
        setTournaments(tournamentsRes.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // THE DELETE FUNCTION
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete the "${name}" tournament?`)) {
      return;
    }

    try {
      await axios.delete(`https://nexus-gg-api.onrender.com/api/tournaments/${id}`);
      // Reload the page to instantly update the chart and the list
      window.location.reload(); 
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Error deleting tournament.');
    }
  };

  if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading command center...</div>;
  if (!data) return <div className="p-8 text-red-400">Failed to load analytics.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
     <header className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="text-blue-400 h-8 w-8" /> 
            Platform Analytics
          </h1>
          <p className="text-slate-400 mt-2">Live overview of your esports ecosystem.</p>
        </div>

        <Link 
          href="/tournaments/new" 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center gap-2 shrink-0"
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

      {/* NEW: Tournament Management List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl mt-8">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Manage Tournaments</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Tournament Name</th>
                <th className="p-4 font-medium">Prize Pool</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tournaments.map((t: any) => (
                <tr key={t.tournament_id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-white">{t.name || t.tournament_name}</td>
                  <td className="p-4 text-emerald-400 font-medium">
                    ${Number(t.prize_pool).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(t.tournament_id, t.name || t.tournament_name)}
                      className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20 text-sm font-medium"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {tournaments.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">
                    No tournaments found. Create one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}