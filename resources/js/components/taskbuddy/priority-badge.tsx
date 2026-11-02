import React from 'react';
import { AlertCircle, ArrowDown, ArrowUp, Flame } from 'lucide-react';
import type { TaskPriority } from '@/types';

interface PriorityBadgeProps {
    priority: TaskPriority;
    className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
    switch (priority) {
        case 'urgent':
            return (
                <span
                    className={`inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 ${className}`}
                >
                    <Flame className="size-3.5 fill-rose-500 text-rose-600" />
                    Urgent
                </span>
            );
        case 'high':
            return (
                <span
                    className={`inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50 ${className}`}
                >
                    <ArrowUp className="size-3.5 text-orange-600 dark:text-orange-400" />
                    High
                </span>
            );
        case 'medium':
            return (
                <span
                    className={`inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200 dark:border-sky-900/50 ${className}`}
                >
                    <span className="size-1.5 rounded-full bg-sky-500" />
                    Medium
                </span>
            );
        case 'low':
        default:
            return (
                <span
                    className={`inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 ${className}`}
                >
                    <ArrowDown className="size-3.5 text-slate-500" />
                    Low
                </span>
            );
    }
}

