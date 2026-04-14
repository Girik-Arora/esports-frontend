'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    team_name: '',
    coach_name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('https://nexus-gg-api.onrender.com/api/teams', formData);
      // If successful, push the user back to the teams list
      router.push('/teams');
      router.refresh(); // Forces Next.js to fetch the fresh data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create team.');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10">
      <Link href="/teams" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Teams
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Register New Team</h1>
            <p className="text-slate-400 text-sm">Add a new organization to the database.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Team Name <span className="text-red-400">*</span>
            </label>
            <input 
              type="text" 
              required
              value={formData.team_name}
              onChange={(e) => setFormData({...formData, team_name: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Natus Vincere"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Head Coach Name
            </label>
            <input 
              type="text" 
              value={formData.coach_name}
              onChange={(e) => setFormData({...formData, coach_name: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Andrey Gorodenskiy"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register Organization'}
          </button>
        </form>
      </div>
    </div>
  );
}