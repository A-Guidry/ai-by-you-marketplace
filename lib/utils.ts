import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

export const getPriceSubtext = (price: string) => {
    if (price.includes('IAP')) return 'Includes In-App Purchases';
    if (price.includes('API')) return 'Bring your own API Key';
    if (price.includes('/mo')) return 'Billed through AI by You';
    if (price.includes('Ads')) return 'Ad-supported';
    return 'One-time purchase';
};
