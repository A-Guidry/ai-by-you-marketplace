"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (!error) router.push('/');
    };

    const handleOAuth = async (provider: 'google' | 'github') => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Log In or Sign Up</h1>

                <form onSubmit={handleLogin} className="space-y-4 mb-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded-lg transition-colors">
                        Sign In with Email
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs text-slate-500">
                        <span className="bg-slate-900 px-2">Or continue with</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button onClick={() => handleOAuth('google')} className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-2 rounded-lg transition-colors">
                        Google
                    </button>
                    <button onClick={() => handleOAuth('github')} className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold py-2 rounded-lg transition-colors">
                        GitHub
                    </button>
                </div>
            </div>
        </div>
    );
}
