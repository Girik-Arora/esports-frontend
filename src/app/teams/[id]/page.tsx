'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Shield, UserCircle, Users, ArrowLeft, Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function TeamProfilePage() {
  const params = useParams();
  const id = params.id; // This grabs the ID straight from the URL!

  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    axios.get(`https://nexus-gg-api.onrender.com/api/teams/${id}`)
      .then((response) => {
        setTeamData(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching team:', err);
        setError('Failed to load team data.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-slate-400 animate-pulse text-center mt-20">Accessing Nexus Database...</div>;
  if (error) return <div className="p-8 text-red-400 text-center mt-20">{error}</div>;
  if (!teamData) return <div className="p-8 text-slate-400 text-center mt-20">Team not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <Link href="/teams" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Team Roster
      </Link>

      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="h-32 w-32 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 shadow-xl shrink-0 z-10">
          <Shield className="h-16 w-16 text-blue-500" />
        </div>
        
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            {teamData.team_name}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
            <span className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg text-slate-300 border border-slate-700">
              <UserCircle className="h-5 w-5 text-purple-400" /> 
              Coach: <span className="text-white">{teamData.coach_name || 'TBD'}</span>
            </span>
            <span className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg text-slate-300 border border-slate-700">
              <Calendar className="h-5 w-5 text-emerald-400" /> 
              Est: <span className="text-white">{format(new Date(teamData.created_at), 'MMM yyyy')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Roster Section */}
      <div className="mb-6 flex items-center gap-3">
        <Users className="h-7 w-7 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Active Roster</h2>
      </div>

      {teamData.roster && teamData.roster.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamData.roster.map((player: any) => (
            <div key={player.player_id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800 shrink-0">
                <span className="text-lg font-black text-slate-500">{player.gamer_tag.charAt(0)}</span>
              </div>
              <div className="overflow-hidden">
                <h3 className="text-lg font-bold text-white truncate">{player.gamer_tag}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-medium">
                    {player.role || 'Player'}
                  </span>
                  <span className="text-xs text-slate-500 truncate">{player.real_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <p className="text-slate-400">This team currently has no active players assigned to their roster.</p>
        </div>
      )}

    </div>
  );
}