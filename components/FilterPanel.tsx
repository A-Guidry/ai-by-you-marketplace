import { useRouter } from 'next/navigation';

export const FilterPanel = ({ currentFilters }: { currentFilters: Record<string, string | string[] | undefined> }) => {
    const router = useRouter();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/?${params.toString()}`);
    };

    const renderSelect = (label: string, key: string, options: string[]) => {
        const value = typeof currentFilters[key] === 'string' ? currentFilters[key] : '';
        return (
            <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">{label}</label>
                <select
                    value={value}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                    <option value="">All</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
            {renderSelect("OS", "os", ["Windows", "macOS", "Linux", "iOS", "Android", "Web"])}
            {renderSelect("Category", "category", ["Game", "App"])}
            {renderSelect("Platform", "platform", ["PC", "Console", "Mobile", "Web"])}
            {renderSelect("Genre", "genre", ["Action", "Simulation", "Finance", "Productivity", "Mystery", "RPG"])}
        </div>
    );
};
