"use client";

import Link from 'next/link';
import { type Case } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { type Timestamp } from 'firebase/firestore';

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
                    {cases.map((caseItem) => {
                        // Defensive conversion of Timestamp to Date
                        const createdAtDate = caseItem.createdAt && typeof (caseItem.createdAt as Timestamp).toDate === 'function' 
                            ? (caseItem.createdAt as Timestamp).toDate() 
                            : new Date(caseItem.createdAt as Date);

                        const formattedDate = !isNaN(createdAtDate.getTime())
                            ? formatDistanceToNow(createdAtDate, { addSuffix: true })
                            : "a few moments ago";

                        return (
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
                                        Created {formattedDate}
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </ScrollArea>
    )
}
