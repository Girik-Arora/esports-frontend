// src/app/players/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewPlayerPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<{team_id: number, team_name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    gamer_tag: '', real_name: '', email: '', country: '', team_id: '', role: ''
  });

  useEffect(() => {
    // Fetch teams so the admin can assign the player from a dropdown
    axios.get('https://nexus-gg-api.onrender.com/api/teams').then(res => setTeams(res.data.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://nexus-gg-api.onrender.com/api/players', formData);
      router.push('/players');
    } catch (err) {
      alert("Error registering player");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-6">
      <Link href="/players" className="text-slate-400 hover:text-white flex items-center gap-2 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Database
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
            <User className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Register Athlete</h1>
            <p className="text-slate-400 text-sm">Add a new player and assign them to a roster.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Gamer Tag *</label>
              <input required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setFormData({...formData, gamer_tag: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Real Name *</label>
              <input required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setFormData({...formData, real_name: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
              <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Country</label>
              <input className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setFormData({...formData, country: e.target.value})} />
            </div>
          </div>

          <hr className="border-slate-800 my-6" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Assign to Team</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none" onChange={e => setFormData({...formData, team_id: e.target.value})}>
                <option value="">Free Agent (None)</option>
                {teams.map(t => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">In-Game Role</label>
              <input placeholder="e.g. IGL, Duelist, Sniper" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg mt-4 transition-all flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}