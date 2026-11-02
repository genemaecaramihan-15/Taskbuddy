import React from 'react';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import type { TaskStatus } from '@/types';

interface StatusBadgeProps {
    status: TaskStatus;
    className?: string;
    showIcon?: boolean;
}

export function StatusBadge({ status, className = '', showIcon = true }: StatusBadgeProps) {
    switch (status) {
        case 'completed':
            return (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 ${className}`}
                >
                    {showIcon && <CheckCircle2 className="size-3.5" />}
                    Completed
                </span>
            );
        case 'in_progress':
            return (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50 ${className}`}
                >
                    {showIcon && <Clock className="size-3.5 animate-spin-slow" />}
                    In Progress
                </span>
            );
        case 'to_do':
        default:
            return (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50 ${className}`}
                >
                    {showIcon && <Circle className="size-3.5" />}
                    To Do
                </span>
            );
    }
}

