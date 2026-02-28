import { ReactNode } from "react";

interface SortButtonProps {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
}

export const SortButton = ({ active, onClick, icon, label }: SortButtonProps) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${active
            ? 'bg-slate-800 text-white shadow-sm'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
            }`}
    >
        {icon}
        {label}
    </button>
);
