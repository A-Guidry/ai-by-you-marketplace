import { ArrowBigUp, ArrowBigDown, Gamepad2, AppWindow, Sparkles, Download } from 'lucide-react';
import { PlatformIcon } from './icons/PlatformIcon';
import { formatNumber, getPriceSubtext } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export interface ProjectData {
    id: number;
    title: string;
    description: string;
    developer_name: string;
    category: string;
    platforms: string[];
    "aiFeatures": string[];
    image_url: string;
    price_model: string;
    user_vote?: number;
    score: number;
    elo_score?: number;
    created_at: string;
    // The following fields were present in the original interface but not in the provided update snippet's main body.
    // Assuming the instruction intended to remove them unless they were part of the duplicated block.
    // Given the duplicated block, it seems the intention was to re-include them.
    // Re-integrating them to maintain a complete and syntactically correct interface.
    genre: string;
    type: string;
    os: string[];
    downloads_count: number;
}

interface ProjectCardProps {
    project: ProjectData;
    onVote: (id: number, voteType: number) => void;
}

export const ProjectCard = ({ project, onVote }: ProjectCardProps) => {
    let timeAgo = '';
    try {
        timeAgo = formatDistanceToNow(new Date(project.created_at), { addSuffix: true });
    } catch {
        timeAgo = 'recently';
    }

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row overflow-hidden shadow-sm hover:shadow-cyan-900/10 hover:shadow-lg group">
            {/* UPVOTE COLUMN */}
            <div className="bg-slate-900/50 sm:w-16 flex flex-row sm:flex-col items-center justify-center sm:justify-start py-3 px-4 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-800 gap-2 sm:gap-1">
                <button
                    onClick={() => onVote(project.id, 1)}
                    className={`p-1 rounded transition-colors ${project.user_vote === 1 ? 'text-orange-500 bg-orange-500/10' : 'text-slate-400 hover:text-orange-500 hover:bg-slate-800'}`}
                >
                    <ArrowBigUp size={24} className={project.user_vote === 1 ? "fill-current" : ""} />
                </button>
                <span className={`font-bold text-sm ${project.user_vote === 1 ? 'text-orange-500' : project.user_vote === -1 ? 'text-cyan-500' : 'text-slate-200'}`}>
                    {formatNumber(project.score)}
                </span>
                <button
                    onClick={() => onVote(project.id, -1)}
                    className={`p-1 rounded transition-colors ${project.user_vote === -1 ? 'text-cyan-500 bg-cyan-500/10' : 'text-slate-400 hover:text-cyan-500 hover:bg-slate-800'}`}
                >
                    <ArrowBigDown size={24} className={project.user_vote === -1 ? "fill-current" : ""} />
                </button>
            </div>

            {/* PROJECT CONTENT */}
            <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4">
                {/* Thumbnail Placeholder */}
                <div className={`w-full sm:w-40 h-32 rounded-lg ${project.image_url} flex items-center justify-center shadow-inner flex-shrink-0 relative overflow-hidden group-hover:scale-[1.02] transition-transform bg-slate-800`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    {project.category === "App" ? (
                        <AppWindow size={32} className="text-white/50 relative z-10" />
                    ) : (
                        <Gamepad2 size={32} className="text-white/50 relative z-10" />
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-1">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover/card:text-cyan-400 transition-colors">
                                    {project.title}
                                </h3>
                                <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                                    <span className="font-medium text-slate-300">{project.developer_name}</span>
                                    <span>•</span>
                                    <span>{timeAgo}</span>
                                </div>
                            </div>

                            {/* Platforms & OS Top Right */}
                            <div className="flex flex-col items-end gap-1.5">
                                <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-md border border-slate-800">
                                    {project.platforms?.map(p => <PlatformIcon key={p} platform={p} />)}
                                </div>
                                <div className="flex flex-wrap justify-end gap-1">
                                    {project.os?.map(o => (
                                        <span key={o} className="text-[9px] uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                                            {o}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-400 line-clamp-2 mt-2 mb-3 flex-1">
                            {project.description}
                        </p>

                        {/* Tags & Action */}
                        <div className="flex flex-wrap items-end justify-between gap-3 mt-auto pt-2 border-t border-slate-800/50">
                            <div className="flex flex-wrap gap-2 pb-1">
                                {project.aiFeatures?.map((feature, i) => (
                                    <span key={i} className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-cyan-900/20 text-cyan-400 border border-cyan-800/30">
                                        <Sparkles size={10} />
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-col items-end w-full sm:w-auto mt-2 sm:mt-0">
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1.5 text-slate-400 mr-2" title="Downloads / Installs">
                                        <Download size={14} />
                                        <span className="font-medium">{formatNumber(project.downloads_count || 0)}</span>
                                    </div>
                                    <button className="flex-1 sm:flex-none bg-slate-100 hover:bg-white text-slate-900 font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                        {project.price_model === 'Free (Ads)' ? 'Play Free' : project.price_model}
                                    </button>
                                </div>
                                <span className="text-[10px] text-slate-500 mt-1.5 mr-1 text-right">
                                    {getPriceSubtext(project.price_model || '')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
