'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Swords, Calendar, Trophy, Clock, Plus, Search } from 'lucide-react'; // <-- Added Search icon
import Link from 'next/link';

interface Match {
  match_id: number;
  match_date: string;
  tournament_name: string;
  team1_name: string;
  team2_name: string;
  winner_name: string | null;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 1. New State for the Search Bar
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://nexus-gg-api.onrender.com/api/matches')
      .then((response) => {
        setMatches(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching matches:', error);
        setLoading(false);
      });
  }, []);

  // 2. The Filter Logic
  // This looks at our original 'matches' array and creates a temporary filtered list
  const filteredMatches = matches.filter((match) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      match.tournament_name.toLowerCase().includes(searchLower) ||
      match.team1_name.toLowerCase().includes(searchLower) ||
      match.team2_name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Swords className="text-red-500 h-8 w-8" />
              Match Schedule & Results
            </h1>
            <p className="text-slate-400 mt-2">Track upcoming fixtures and past tournament results.</p>
          </div>
          
          <Link 
            href="/matches/new"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 shrink-0"
          >
            <Plus className="h-5 w-5" />
            Schedule Match
          </Link>
        </header>

        {/* 3. The Search Input UI */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by tournament or team name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500 shadow-inner"
          />
        </div>

        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading match data...</p>
        ) : filteredMatches.length === 0 ? ( // Check if our filter returned 0 results
          <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
            <p className="text-slate-400">No matches found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* IMPORTANT: We now map over 'filteredMatches', NOT 'matches' */}
            {filteredMatches.map((match) => {
              const isCompleted = match.winner_name !== null;
              const matchDate = new Date(match.match_date);

              return (
                <div key={match.match_id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
                  <div className="bg-slate-950/50 px-6 py-3 border-b border-slate-800 flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-300 uppercase tracking-wider">
                      {match.tournament_name}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>{format(matchDate, 'MMM d, yyyy - h:mm a')}</span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    <div className={`flex-1 text-center md:text-right ${match.winner_name === match.team1_name ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                      <h3 className="text-2xl sm:text-3xl tracking-tight flex items-center justify-center md:justify-end gap-3">
                        {match.winner_name === match.team1_name && <Trophy className="h-6 w-6" />}
                        {match.team1_name}
                      </h3>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 shadow-lg">
                        <span className="text-slate-400 font-black italic">VS</span>
                      </div>
                      <div className="mt-4 flex flex-col items-center gap-2">
                        {isCompleted ? (
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">FINAL</span>
                        ) : (
                          <>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> UPCOMING
                            </span>
                            <button 
                              onClick={() => window.location.href = `/matches/${match.match_id}`}
                              className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors border border-slate-700 hover:border-slate-500"
                            >
                              Log Result
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className={`flex-1 text-center md:text-left ${match.winner_name === match.team2_name ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                      <h3 className="text-2xl sm:text-3xl tracking-tight flex items-center justify-center md:justify-start gap-3">
                        {match.team2_name}
                        {match.winner_name === match.team2_name && <Trophy className="h-6 w-6" />}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}