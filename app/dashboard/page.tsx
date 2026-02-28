import { createClient } from '@/utils/supabase/server';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { Plus, Edit2, Trash2, TrendingUp, Download, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch user's projects with their metrics
    const { data: projects, error } = await supabase
        .from('projects')
        .select(`
            id, title, category, created_at,
            metrics!inner(downloads_count, upvotes, downvotes, hot_score)
        `)
        .eq('developer_id', user?.id)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Developer Dashboard</h1>
                        <p className="text-slate-400 mt-1">Manage your applications and view analytics.</p>
                    </div>
                    <Link href="/upload" className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <Plus size={18} /> New Project
                    </Link>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-900/50">
                        <h2 className="font-semibold text-white">My Projects</h2>
                    </div>

                    {!projects || projects.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Plus size={32} className="text-slate-500" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-300 mb-2">No projects yet</h3>
                            <p className="text-slate-400 mb-6 max-w-sm">You haven't uploaded any games or apps to the marketplace. Start building your audience today.</p>
                            <Link href="/upload" className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-full transition-colors border border-slate-700">
                                Upload Your First Project
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {projects.map((project: any) => (
                                <div key={project.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/30 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-white">{project.title}</h3>
                                            <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                                                {project.category}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                                <CheckCircle size={12} /> Published
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400">
                                            Added on {new Date(project.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-8 bg-slate-950 p-4 rounded-lg border border-slate-800/50">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm text-slate-500 font-medium mb-1">Downloads</span>
                                            <div className="flex items-center gap-1.5 text-white font-semibold">
                                                <Download size={14} className="text-blue-400" />
                                                {project.metrics.downloads_count}
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-slate-800"></div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm text-slate-500 font-medium mb-1">Net Score</span>
                                            <div className="flex items-center gap-1.5 text-white font-semibold">
                                                <TrendingUp size={14} className="text-orange-400" />
                                                {project.metrics.upvotes - project.metrics.downvotes}
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-slate-800"></div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm text-slate-500 font-medium mb-1">Hot Rank</span>
                                            <div className="flex items-center gap-1.5 text-white font-semibold flex-col">
                                                <span className="text-cyan-400 font-bold">{project.metrics.hot_score}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-600" title="Edit Project">
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950 rounded-lg transition-colors border border-transparent hover:border-rose-900/50" title="Delete Project">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
