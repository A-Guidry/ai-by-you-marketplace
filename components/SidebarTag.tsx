interface SidebarTagProps {
    label: string;
    count: string | number;
}

export const SidebarTag = ({ label, count }: SidebarTagProps) => (
    <div className="flex items-center justify-between w-full p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer group">
        <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">{label}</span>
        <span className="text-xs bg-slate-950 px-2 py-1 rounded text-slate-500 border border-slate-800">{count}</span>
    </div>
);
