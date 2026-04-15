'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Plus, Shield, Search } from 'lucide-react'; // <-- Added Search icon
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
  
  // 1. New State for the Search Bar
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://nexus-gg-api.onrender.com/api/players')
      .then(res => { setPlayers(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // 2. The Filter Logic
  // This looks at our original 'players' array and creates a temporary filtered list
  const filteredPlayers = players.filter((player) => {
    const searchLower = searchTerm.toLowerCase();
    // Safety check for team_name since it can be null!
    const teamName = player.team_name ? player.team_name.toLowerCase() : '';
    
    return (
      player.gamer_tag.toLowerCase().includes(searchLower) ||
      player.real_name.toLowerCase().includes(searchLower) ||
      player.country.toLowerCase().includes(searchLower) ||
      teamName.includes(searchLower)
    );
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <header className="mb-8 border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <User className="text-purple-400 h-8 w-8" />
            Player Database
          </h1>
          <p className="text-slate-400 mt-2">Manage individual athlete profiles and team assignments.</p>
        </div>
        <Link 
          href="/players/new" 
          className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 shrink-0"
        >
          <Plus className="h-5 w-5" /> Add Player
        </Link>
      </header>

      {/* 3. The Search Input UI */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Search by gamer tag, real name, team, or origin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // Notice I used focus:ring-purple-500 to match the page's theme!
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-500 shadow-inner"
        />
      </div>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading players...</p>
      ) : filteredPlayers.length === 0 ? (
        /* Empty State if search finds nothing */
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
          <p className="text-slate-400">No players found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
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
              {/* IMPORTANT: We now map over 'filteredPlayers', NOT 'players' */}
              {filteredPlayers.map((player, index) => (
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