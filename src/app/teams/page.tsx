'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import { Users, Shield, UserCircle, Plus } from 'lucide-react';



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

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Users className="text-blue-400 h-8 w-8" />
                    Team Roster Management
                </h1>
                <p className="text-slate-400 mt-2">View active teams, coaches, and roster capacities.</p>
            </div>
            <Link 
                href="/teams/new" 
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
            <Plus className="h-5 w-5" />
                Register Team
            </Link>
        </header>

        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading team database...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((team) => (
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