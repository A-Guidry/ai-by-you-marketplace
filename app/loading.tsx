import { Navbar } from '@/components/Navbar';
import { ArrowBigUp, ArrowBigDown, Gamepad2 } from 'lucide-react';

const SkeletonCard = () => (
    <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row overflow-hidden animate-pulse">
        {/* UPVOTE SKELETON */}
        <div className="bg-slate-900/50 sm:w-16 flex flex-row sm:flex-col items-center justify-center sm:justify-start py-3 px-4 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-800 gap-2 sm:gap-1">
            <div className="p-1 text-slate-700">
                <ArrowBigUp size={24} />
            </div>
            <div className="h-4 w-6 bg-slate-800 rounded"></div>
            <div className="p-1 text-slate-700">
                <ArrowBigDown size={24} />
            </div>
        </div>

        {/* CONTENT SKELETON */}
        <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4">
            {/* THUMBNAIL SKELETON */}
            <div className={`w-full sm:w-40 h-32 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden`}>
                <Gamepad2 size={32} className="text-slate-700 relative z-10" />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-1">
                    <div className="space-y-2 w-full max-w-xs">
                        {/* TITLE SKELETON */}
                        <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                        {/* SUBTITLE SKELETON */}
                        <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 ml-4">
                        <div className="h-6 w-16 bg-slate-800 rounded-md"></div>
                        <div className="h-4 w-12 bg-slate-800 rounded"></div>
                    </div>
                </div>

                {/* DESCRIPTION SKELETON */}
                <div className="mt-4 space-y-2 flex-1">
                    <div className="h-3 bg-slate-800 rounded w-full"></div>
                    <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                </div>

                {/* BOTTOM TAGS SKELETON */}
                <div className="flex flex-wrap items-end justify-between gap-3 mt-4 pt-4 border-t border-slate-800/50">
                    <div className="flex flex-wrap gap-2">
                        <div className="h-6 w-20 bg-slate-800 rounded"></div>
                        <div className="h-6 w-24 bg-slate-800 rounded"></div>
                    </div>

                    <div className="flex gap-4">
                        <div className="h-6 w-16 bg-slate-800 rounded"></div>
                        <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                    {/* BAR SKELETON */}
                    <div className="bg-slate-900 h-14 rounded-xl border border-slate-800 flex items-center px-4 animate-pulse">
                        <div className="h-6 w-48 bg-slate-800 rounded"></div>
                        <div className="h-6 w-px bg-slate-700 mx-4"></div>
                        <div className="h-6 w-20 bg-slate-800 rounded ml-auto"></div>
                    </div>

                    {/* REPEATED CARD SKELETONS */}
                    <div className="space-y-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
                <div className="hidden lg:block space-y-6">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 h-48 animate-pulse shadow-lg"></div>
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 h-64 animate-pulse"></div>
                </div>
            </main>
        </div>
    );
}
