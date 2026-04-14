'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Swords, Calendar, Trophy, Clock } from 'lucide-react';

// Define the shape of our complex joined data
interface Match {
  match_id: number;
  match_date: string;
  tournament_name: string;
  team1_name: string;
  team2_name: string;
  winner_name: string | null; // Null if the match hasn't happened yet
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <Swords className="text-red-500 h-8 w-8" />
            Match Schedule & Results
          </h1>
          <p className="text-slate-400 mt-2">Track upcoming fixtures and past tournament results.</p>
        </header>

        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading match data...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {matches.map((match) => {
              const isCompleted = match.winner_name !== null;
              const matchDate = new Date(match.match_date);

              return (
                <div 
                  key={match.match_id} 
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors"
                >
                  {/* Card Header: Tournament & Time */}
                  <div className="bg-slate-950/50 px-6 py-3 border-b border-slate-800 flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-300 uppercase tracking-wider">
                      {match.tournament_name}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>{format(matchDate, 'MMM d, yyyy - h:mm a')}</span>
                    </div>
                  </div>

                  {/* Card Body: The Matchup */}
                  <div className="p-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    
                    {/* Team 1 */}
                    <div className={`flex-1 text-center md:text-right ${match.winner_name === match.team1_name ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                      <h3 className="text-2xl sm:text-3xl tracking-tight flex items-center justify-center md:justify-end gap-3">
                        {match.winner_name === match.team1_name && <Trophy className="h-6 w-6" />}
                        {match.team1_name}
                      </h3>
                    </div>

                    {/* VS Badge */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 shadow-lg">
                        <span className="text-slate-400 font-black italic">VS</span>
                      </div>
                      {/* Status Badge & Actions */}
                      <div className="mt-4 flex flex-col items-center gap-2">
                        {isCompleted ? (
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                            FINAL
                          </span>
                        ) : (
                          <>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> UPCOMING
                            </span>
                            {/* New Log Result Button */}
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

                    {/* Team 2 */}
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