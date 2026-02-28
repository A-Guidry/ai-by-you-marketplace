import { TrendingUp, Award, Clock, Filter } from 'lucide-react';
import { SortButton } from './SortButton';

interface SortingBarProps {
    sortBy: string;
    setSortBy: (sort: string) => void;
    onToggleFilters: () => void;
    activeFiltersCount: number;
}

export const SortingBar = ({ sortBy, setSortBy, onToggleFilters, activeFiltersCount }: SortingBarProps) => {
    return (
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto">
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-lg overflow-x-auto no-scrollbar">
                <SortButton active={sortBy === 'hot'} onClick={() => setSortBy('hot')} icon={<TrendingUp size={16} />} label="Hot" />
                <SortButton active={sortBy === 'top'} onClick={() => setSortBy('top')} icon={<Award size={16} />} label="Top Ranked" />
                <SortButton active={sortBy === 'new'} onClick={() => setSortBy('new')} icon={<Clock size={16} />} label="New Arrivals" />
                <div className="w-px bg-slate-800 my-2 mx-2"></div>
                <SortButton active={sortBy === 'arena'} onClick={() => setSortBy('arena')} icon={<TrendingUp size={16} className="text-orange-400" />} label="Arena Leaders" />
            </div>

            <div className="h-6 w-px bg-slate-700 mx-2"></div>

            <button
                onClick={onToggleFilters}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors ml-auto relative"
            >
                <Filter size={16} /> Filters
                {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cyan-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                    </span>
                )}
            </button>
        </div>
    );
};
