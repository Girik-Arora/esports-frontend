'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Swords, ArrowLeft, Trophy, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface MatchDetails {
  match_id: number;
  tournament_name: string;
  team1_id: number;
  team1_name: string;
  team2_id: number;
  team2_name: string;
}

export default function ScoreMatchPage() {
  const router = useRouter();
  const params = useParams(); // Grabs the ID from the URL
  
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`https://nexus-gg-api.onrender.com/api/matches/${params.id}`)
      .then(res => {
        setMatch(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async () => {
    if (!selectedWinner) return;
    setSaving(true);
    
    try {
      await axios.put(`https://nexus-gg-api.onrender.com/api/matches/${params.id}`, {
        winner_team_id: selectedWinner
      });
      router.push('/matches');
    } catch (error) {
      alert("Failed to save result.");
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading match details...</div>;
  if (!match) return <div className="p-8 text-red-400">Match not found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto mt-6">
      <Link href="/matches" className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Schedule
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="inline-flex h-16 w-16 bg-red-500/10 rounded-2xl items-center justify-center border border-red-500/20 mb-6">
          <Swords className="h-8 w-8 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Log Official Result</h1>
        <p className="text-slate-400 text-sm mb-8">{match.tournament_name}</p>

        <h2 className="text-lg font-medium text-slate-300 mb-6">Select the Winning Team:</h2>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <button 
            onClick={() => setSelectedWinner(match.team1_id)}
            className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 ${
              selectedWinner === match.team1_id 
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600'
            }`}
          >
            {selectedWinner === match.team1_id && <Trophy className="h-8 w-8" />}
            <span className="text-2xl font-black">{match.team1_name}</span>
          </button>

          <button 
            onClick={() => setSelectedWinner(match.team2_id)}
            className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 ${
              selectedWinner === match.team2_id 
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600'
            }`}
          >
            {selectedWinner === match.team2_id && <Trophy className="h-8 w-8" />}
            <span className="text-2xl font-black">{match.team2_name}</span>
          </button>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!selectedWinner || saving}
          className="w-full md:w-auto px-12 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 mx-auto"
        >
          {saving ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm Final Result'}
        </button>
      </div>
    </div>
  );
}