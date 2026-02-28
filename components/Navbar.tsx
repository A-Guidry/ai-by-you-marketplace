import { Cpu, Search } from 'lucide-react';
import { UploadIcon } from './icons/UploadIcon';
import Link from 'next/link';

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg">
                        <Cpu className="text-slate-950" size={24} />
                    </div>
                    <span className="text-xl font-black tracking-tight text-white hidden sm:block">
                        AI <span className="text-cyan-400">by You</span>
                    </span>
                </Link>

                <div className="flex-1 max-w-2xl mx-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by app, game, AI model (e.g. LLaMA)..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-500 text-slate-200"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/upload" className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full transition-colors border border-slate-700">
                        <UploadIcon /> Upload Project
                    </Link>
                    <Link href="/login" className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 border-2 border-slate-800 cursor-pointer flex items-center justify-center text-xs font-bold text-white shadow-lg" title="Login">
                    </Link>
                </div>
            </div>
        </nav>
    );
};
