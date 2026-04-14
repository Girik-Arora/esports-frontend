'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Swords, AlertCircle } from 'lucide-react';

// Adjust this if you use an environment variable!
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nexus-gg-api.onrender.com/api';

export default function ScheduleMatch() {
  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [matchDate, setMatchDate] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch teams when the page loads so we can populate the dropdowns
  // Fetch teams when the page loads so we can populate the dropdowns
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/teams`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const responseData = await res.json();
        
        // UNWRAP THE PACKAGE: Check if teams are inside responseData.data, otherwise use responseData
        const teamsArray = responseData.data ? responseData.data : responseData;
        
        if (Array.isArray(teamsArray)) {
          setTeams(teamsArray);
        } else {
          console.error("Failed to load teams. Backend returned:", responseData);
          setTeams([]);
        }
      } catch (err) {
        console.error("Failed to load teams", err);
        setTeams([]);
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (teamA === teamB) {
      return setError("A team cannot play against itself!");
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/matches/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Passing the JWT passport!
        },
        body: JSON.stringify({
          tournament_id: null, // Hardcoded for now, can add a dropdown later
          team_a_id: teamA,
          team_b_id: teamB,
          match_date: matchDate
        })
      });

      if (!res.ok) throw new Error("Failed to schedule match");

      // Redirect back to the matches dashboard on success
      router.push('/matches');
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Schedule Match</h1>
            <p className="text-slate-400 text-sm">Set up an upcoming official fixture.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Team A */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-400">Team Alpha *</label>
              <select 
                required
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>Select Team...</option>
                {teams.map(t => (
                  <option key={t.team_id} value={t.team_id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* VS Icon */}
            <div className="hidden md:flex justify-center items-center pb-3 text-slate-500">
              <Swords className="h-6 w-6" />
            </div>

            {/* Team B */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-400">Team Bravo *</label>
              <select 
                required
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>Select Team...</option>
                {teams.map(t => (
                  <option key={t.team_id} value={t.team_id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Match Date & Time *</label>
            <input 
              type="datetime-local" 
              required
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none [color-scheme:dark]"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center mt-8 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Confirm Schedule"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}