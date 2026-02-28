import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Feed } from '@/components/Feed';
import { createClient } from '@/utils/supabase/server';

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient();
    const resolvedParams = await searchParams;

    const currentSort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'hot';
    const currentCategory = typeof resolvedParams.category === 'string' ? resolvedParams.category : null;
    const currentPlatform = typeof resolvedParams.platform === 'string' ? resolvedParams.platform : null;
    const currentGenre = typeof resolvedParams.genre === 'string' ? resolvedParams.genre : null;
    const currentOs = typeof resolvedParams.os === 'string' ? resolvedParams.os : null;

    // Fetch projects
    const { data: projects, error } = await supabase.rpc('get_projects', {
        p_sort: currentSort,
        p_category: currentCategory,
        p_platform: currentPlatform,
        p_genre: currentGenre,
        p_os: currentOs
    });

    if (error) {
        console.error("Error fetching projects:", error);
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                    <Feed
                        initialProjects={projects || []}
                        currentSort={currentSort}
                        searchParams={resolvedParams}
                    />
                </div>
                <Sidebar />
            </main>
        </div>
    );
}
