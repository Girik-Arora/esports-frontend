'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Trophy, ArrowLeft, Calendar, DollarSign, Gamepad2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewTournamentPage() {
  const router = useRouter();
  const [games, setGames] = useState<{game_id: number, game_name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tournament_name: '',
    game_id: '',
    start_date: '',
    end_date: '',
    prize_pool: ''
  });

  useEffect(() => {
    axios.get('https://nexus-gg-api.onrender.com/api/games').then(res => setGames(res.data.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://nexus-gg-api.onrender.com/api/tournaments', formData);
      router.push('/'); // Go back to dashboard to see the new list
    } catch (err) {
      alert("Error creating tournament");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-6">
      <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Trophy className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Tournament</h1>
            <p className="text-slate-400 text-sm">Set up a new competitive event.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Tournament Name</label>
            <input 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="e.g. Winter Invitational 2026"
              onChange={e => setFormData({...formData, tournament_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Game Title</label>
            <div className="relative">
              <Gamepad2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <select 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none transition-all"
                onChange={e => setFormData({...formData, game_id: e.target.value})}
              >
                <option value="">Select a game...</option>
                {games.map(g => <option key={g.game_id} value={g.game_id}>{g.game_name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Start Date</label>
              <input 
                type="date" required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">End Date</label>
              <input 
                type="date" required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Prize Pool ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
              <input 
                type="number" required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="50000"
                onChange={e => setFormData({...formData, prize_pool: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg mt-4 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Launch Tournament'}
          </button>
        </form>
      </div>
    </div>
  );
}