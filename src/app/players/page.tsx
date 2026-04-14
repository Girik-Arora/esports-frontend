// src/app/players/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Plus, Shield } from 'lucide-react';
import Link from 'next/link';

interface Player {
  player_id: number;
  gamer_tag: string;
  real_name: string;
  country: string;
  role: string | null;
  team_name: string | null;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://nexus-gg-api.onrender.com/api/players')
      .then(res => { setPlayers(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <User className="text-purple-400 h-8 w-8" />
            Player Database
          </h1>
          <p className="text-slate-400 mt-2">Manage individual athlete profiles and team assignments.</p>
        </div>
        <Link 
          href="/players/new" 
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Player
        </Link>
      </header>

      {loading ? <p className="text-slate-400">Loading players...</p> : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Gamer Tag</th>
                <th className="p-4 font-medium">Real Name</th>
                <th className="p-4 font-medium">Origin</th>
                <th className="p-4 font-medium">Current Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {players.map((player, index) => (
                <tr key={`${player.player_id}-${index}`} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-white text-lg">{player.gamer_tag}</td>
                  <td className="p-4 text-slate-300">{player.real_name}</td>
                  <td className="p-4 text-slate-400">{player.country}</td>
                  <td className="p-4">
                    {player.team_name ? (
                      <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                        <Shield className="h-3 w-3" /> {player.team_name} ({player.role})
                      </span>
                    ) : (
                      <span className="text-slate-500 italic text-sm">Free Agent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}