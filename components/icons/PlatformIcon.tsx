import { Monitor, Gamepad2, Smartphone, Globe } from 'lucide-react';

export const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'PC': return <Monitor size={14} className="text-blue-400" aria-label="PC" />;
        case 'Console': return <Gamepad2 size={14} className="text-green-400" aria-label="Console" />;
        case 'Mobile': return <Smartphone size={14} className="text-yellow-400" aria-label="Mobile" />;
        case 'Web': return <Globe size={14} className="text-purple-400" aria-label="Web" />;
        default: return null;
    }
};
