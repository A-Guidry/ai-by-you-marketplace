"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Award, Gamepad2, AppWindow, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ArenaProject {
    id: number;
    title: string;
    developer_name: string;
    image_url: string;
    category: string;
}

export default function ArenaPage() {
    const [matchup, setMatchup] = useState<ArenaProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVoting, setIsVoting] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const fetchMatchup = useCallback(async () => {
        setIsLoading(true);
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
            router.push('/login');
            return;
        }

        const { data, error } = await supabase.rpc('get_arena_matchup');
        if (data && data.length === 2) {
            setMatchup(data);
        } else {
            // Fallback handling if no projects exist or rpc fails
            console.error("Matchup fetch error:", error);
            setMatchup([]);
        }
        setIsLoading(false);
    }, [router, supabase]);

    useEffect(() => {
        const init = async () => {
            await fetchMatchup();
        };
        init();
    }, [fetchMatchup]);

    const handleVote = async (winnerId: number, loserId: number) => {
        setIsVoting(true);
        const { error } = await supabase.rpc('process_arena_vote', {
            p_winner_id: winnerId,
            p_loser_id: loserId
        });

        if (error) {
            console.error("Error submitting vote:", error);
            alert("Failed to submit vote");
            setIsVoting(false);
            return;
        }

        // Fetch next matchup
        await fetchMatchup();
        setIsVoting(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-900 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full flex flex-col items-center justify-center relative">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-orange-500/20 text-orange-400 rounded-2xl mb-4">
                        <Award size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
                        LMArena Curator
                    </h1>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">
                        Which project is better? Your votes directly update the global Elo algorithms and determine marketplace rankings.
                    </p>
                </div>

                {isLoading || isVoting ? (
                    <div className="flex flex-col items-center justify-center p-24">
                        <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
                        <p className="text-slate-400 font-medium">
                            {isVoting ? 'Calculating new Elo rankings...' : 'Finding next matchup...'}
                        </p>
                    </div>
                ) : matchup.length === 2 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative">
                        {/* VS Badge */}
                        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-slate-950 border-4 border-slate-800 rounded-full items-center justify-center text-xl font-black text-slate-500 shadow-2xl">
                            VS
                        </div>

                        {/* Project A */}
                        <button
                            onClick={() => handleVote(matchup[0].id, matchup[1].id)}
                            className="bg-slate-900 border-2 border-slate-800 hover:border-cyan-500 rounded-3xl p-6 text-left transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(8,145,178,0.2)] group hover:bg-slate-800/80"
                        >
                            <div className={`w-full aspect-video rounded-xl bg-slate-800 ${matchup[0].image_url} mb-6 flex items-center justify-center shadow-inner overflow-hidden relative`}>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors"></div>
                                {matchup[0].category === "App" ? (
                                    <AppWindow size={48} className="text-white/50 relative z-10" />
                                ) : (
                                    <Gamepad2 size={48} className="text-white/50 relative z-10" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{matchup[0].title}</h2>
                            <p className="text-slate-400 font-medium">{matchup[0].developer_name}</p>
                            <div className="mt-6 py-3 px-4 bg-slate-950 rounded-xl text-center font-bold text-slate-300 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                                VOTE A
                            </div>
                        </button>

                        {/* Project B */}
                        <button
                            onClick={() => handleVote(matchup[1].id, matchup[0].id)}
                            className="bg-slate-900 border-2 border-slate-800 hover:border-rose-500 rounded-3xl p-6 text-left transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(244,63,94,0.2)] group hover:bg-slate-800/80"
                        >
                            <div className={`w-full aspect-video rounded-xl bg-slate-800 ${matchup[1].image_url} mb-6 flex items-center justify-center shadow-inner overflow-hidden relative`}>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors"></div>
                                {matchup[1].category === "App" ? (
                                    <AppWindow size={48} className="text-white/50 relative z-10" />
                                ) : (
                                    <Gamepad2 size={48} className="text-white/50 relative z-10" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{matchup[1].title}</h2>
                            <p className="text-slate-400 font-medium">{matchup[1].developer_name}</p>
                            <div className="mt-6 py-3 px-4 bg-slate-950 rounded-xl text-center font-bold text-slate-300 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                VOTE B
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="text-center p-12 bg-slate-900 rounded-2xl border border-slate-800">
                        <p className="text-xl text-slate-300 mb-6">Not enough projects in the database to run the Arena.</p>
                        <button onClick={fetchMatchup} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl mx-auto transition-colors">
                            <RefreshCw size={18} /> Retry
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
