import { Award, TrendingUp } from 'lucide-react';
import { SidebarTag } from './SidebarTag';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const Sidebar = async () => {
    const supabase = await createClient();
    const { data: trendingTags } = await supabase.rpc('get_trending_tags');

    return (
        <div className="hidden lg:block space-y-6">
            {/* Curation Module Card */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-orange-500/20 p-1.5 rounded text-orange-400">
                        <Award size={18} />
                    </div>
                    <h3 className="font-bold text-white">LMArena Curator</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                    Help us filter the noise. Play two anonymous AI levels and vote for the best to improve the ranking algorithm.
                </p>
                <Link href="/arena" className="block text-center w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded-lg transition-colors text-sm shadow-[0_0_15px_rgba(8,145,178,0.4)]">
                    Enter the Arena
                </Link>
            </div>

            {/* Trending Tags */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-slate-400" /> Trending Tech
                </h3>
                <div className="flex flex-wrap gap-2">
                    {trendingTags && trendingTags.length > 0 ? (
                        trendingTags.map((tag: { feature: string; usage_count: number }) => (
                            <SidebarTag key={tag.feature} label={tag.feature} count={tag.usage_count} />
                        ))
                    ) : (
                        <p className="text-slate-500 text-xs text-center w-full border border-dashed border-slate-800 py-2 rounded">Not enough data to trend.</p>
                    )}
                </div>
            </div>

            {/* Community Highlight */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider text-slate-500">
                    Community Notice
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Per the Jan 2026 Developer Update, games utilizing pure AI-generation without substantial human curation will be heavily penalized by the &quot;Hot&quot; algorithm to combat gameslop.
                </p>
                <a href="#" className="text-xs text-cyan-400 hover:underline">Read the full platform policy →</a>
            </div>
        </div>
    );
};
