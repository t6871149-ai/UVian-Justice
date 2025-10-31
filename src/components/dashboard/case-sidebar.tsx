"use client";

import Link from 'next/link';
import { type Case } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface CaseSidebarProps {
    cases: Case[];
    selectedCaseId: string | null;
    isLoading: boolean;
}

export function CaseSidebar({ cases, selectedCaseId, isLoading }: CaseSidebarProps) {
    if (isLoading) {
        return (
            <div className="p-2 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <nav className="p-2">
                <ul className="space-y-1">
                    {cases.map((caseItem) => (
                        <li key={caseItem.id}>
                            <Link 
                                href={`/dashboard?caseId=${caseItem.id}`}
                                className={cn(
                                    "block p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
                                    selectedCaseId === caseItem.id && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                )}
                            >
                                <div className="font-semibold truncate">{caseItem.title}</div>
                                <div className={cn("text-xs truncate", selectedCaseId === caseItem.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                    Created {formatDistanceToNow(new Date(caseItem.createdAt as any), { addSuffix: true })}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </ScrollArea>
    )
}
