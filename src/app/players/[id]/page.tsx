'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { User, Shield, ArrowLeft, Calendar, Mail, MapPin, Trophy } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function PlayerProfilePage() {
  const params = useParams();
  const id = params.id;

  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    axios.get(`https://nexus-gg-api.onrender.com/api/players/${id}`)
      .then((response) => {
        setPlayer(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching player:', err);
        setError('Failed to load player data.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-slate-400 animate-pulse text-center mt-20">Accessing Nexus Database...</div>;
  if (error) return <div className="p-8 text-red-400 text-center mt-20">{error}</div>;
  if (!player) return <div className="p-8 text-slate-400 text-center mt-20">Player not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      
      {/* Back Navigation */}
      <Link href="/players" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Player Database
      </Link>

      {/* Hero Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="h-32 w-32 bg-slate-950 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-xl shrink-0">
             <span className="text-5xl font-black text-slate-600">{player.gamer_tag.charAt(0).toUpperCase()}</span>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              {player.gamer_tag}
            </h1>
            <p className="text-xl text-slate-400 mb-6">{player.real_name}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
              <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-md text-slate-300 border border-slate-700">
                <MapPin className="h-4 w-4 text-red-400" /> {player.country}
              </span>
              <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-md text-slate-300 border border-slate-700">
                <Calendar className="h-4 w-4 text-emerald-400" /> Joined {format(new Date(player.join_date), 'MMM yyyy')}
              </span>
              <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-md text-slate-300 border border-slate-700">
                <Mail className="h-4 w-4 text-blue-400" /> {player.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Stats / Team Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Team Assignment Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Current Affiliation</h2>
          </div>
          
          {player.team_name ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400 font-medium mb-1">Organization</p>
                <Link href={`/teams/${player.team_id}`} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                  {player.team_name}
                </Link>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <p className="text-sm text-slate-500 font-medium mb-1">Roster Role</p>
                <p className="text-xl font-semibold text-slate-300">{player.role}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-950 border border-slate-800 border-dashed rounded-lg">
              <span className="inline-block px-4 py-2 bg-slate-800 text-slate-400 rounded-full font-medium mb-3">Free Agent</span>
              <p className="text-sm text-slate-500">This player is not currently assigned to an active roster.</p>
            </div>
          )}
        </div>

        {/* Career Stats Placeholder */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Career Statistics</h2>
          </div>
          <div className="py-8 text-center bg-slate-950 border border-slate-800 rounded-lg">
             <p className="text-slate-500 italic">Advanced telemetry and match statistics are currently being synced with the Nexus servers.</p>
          </div>
        </div>

      </div>
    </div>
  );
}