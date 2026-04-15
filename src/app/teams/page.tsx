'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import { Users, Shield, UserCircle, Plus, Search } from 'lucide-react'; // <-- Added Search

interface Team {
  team_id: number;
  team_name: string;
  coach_name: string;
  created_at: string;
  roster_size: number;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. New State for the Search Bar
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://nexus-gg-api.onrender.com/api/teams')
      .then((response) => {
        setTeams(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
        setLoading(false);
      });
  }, []);

  // 2. The Filter Logic
  const filteredTeams = teams.filter((team) => {
    const searchLower = searchTerm.toLowerCase();
    // Safety check for coach_name since it could be null
    const coachName = team.coach_name ? team.coach_name.toLowerCase() : '';
    
    return (
      team.team_name.toLowerCase().includes(searchLower) ||
      coachName.includes(searchLower)
    );
  });

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Users className="text-blue-400 h-8 w-8" />
                    Team Roster Management
                </h1>
                <p className="text-slate-400 mt-2">View active teams, coaches, and roster capacities.</p>
            </div>
            <Link 
                href="/teams/new" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 shrink-0"
            >
            <Plus className="h-5 w-5" />
                Register Team
            </Link>
        </header>

        {/* 3. The Search Input UI */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by team name or coach..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500 shadow-inner"
          />
        </div>

        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading team database...</p>
        ) : filteredTeams.length === 0 ? (
          /* Empty State if search finds nothing */
          <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
            <p className="text-slate-400">No teams found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* IMPORTANT: We now map over 'filteredTeams', NOT 'teams' */}
            {filteredTeams.map((team) => (
              <div 
                key={team.team_id} 
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all flex flex-col items-center text-center"
              >
                <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border-2 border-slate-700">
                  <Shield className="h-8 w-8 text-slate-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {team.team_name}
                </h3>
                
                <div className="w-full mt-4 pt-4 border-t border-slate-800 space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded-md">
                    <span className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-purple-400" /> Coach
                    </span>
                    <span className="font-medium text-white">{team.coach_name || 'TBD'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded-md">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" /> Roster
                    </span>
                    <span className="font-medium text-white">{team.roster_size} Players</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}