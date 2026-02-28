"use client";

import { useState, useEffect } from 'react';
import { SortingBar } from './SortingBar';
import { ProjectCard, ProjectData } from './ProjectCard';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FilterPanel } from './FilterPanel';

interface FeedProps {
    initialProjects: ProjectData[];
    currentSort: string;
    searchParams: Record<string, string | string[] | undefined>;
}

export const Feed = ({ initialProjects, currentSort, searchParams }: FeedProps) => {
    const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
    const [showFilters, setShowFilters] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    // Whenever server changes initial projects (e.g., due to filter URL update), update local state
    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);

    const handleVote = async (id: number, targetVoteType: number) => {
        const originalProjects = [...projects];

        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
            router.push('/login');
            return;
        }

        // Optimistic UI Update
        setProjects(projects.map(project => {
            if (project.id === id) {
                let newScore = project.score;
                let newUserVote = targetVoteType;

                if (project.user_vote === targetVoteType) {
                    newScore -= targetVoteType;
                    newUserVote = 0;
                }
                else if (project.user_vote !== 0 && project.user_vote !== undefined) {
                    newScore += (targetVoteType * 2);
                }
                else {
                    newScore += targetVoteType;
                }

                return { ...project, score: newScore, user_vote: newUserVote };
            }
            return project;
        }));

        // Fire RPC call
        const project = projects.find(p => p.id === id);
        let actualVote = targetVoteType;
        if (project?.user_vote === targetVoteType) {
            actualVote = 0; // undo vote
        }

        const { error } = await supabase.rpc('cast_vote', {
            p_id: id,
            v_type: actualVote
        });

        if (error) {
            console.error("Error casting vote:", error);
            // Revert on error
            setProjects(originalProjects);
        }
    };

    const setSortBy = (sort: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set('sort', sort);
        router.push(`/?${params.toString()}`);
    }

    return (
        <div className="space-y-4">
            <SortingBar
                sortBy={currentSort || 'hot'}
                setSortBy={setSortBy}
                onToggleFilters={() => setShowFilters(!showFilters)}
                activeFiltersCount={Object.keys(searchParams).filter(k => k !== 'sort').length}
            />
            {showFilters && <FilterPanel currentFilters={searchParams} />}
            <div className="space-y-4">
                {projects.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                        No projects found matching the current filters.
                    </div>
                ) : (
                    projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onVote={handleVote}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
