import React from 'react';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    RotateCcw,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CategoryBadge } from './category-badge';
import { PriorityBadge } from './priority-badge';
import { StatusBadge } from './status-badge';
import type { Task, TaskStatus } from '@/types';

interface TaskCardProps {
    task: Task;
    onRestore?: (task: Task) => void;
    onForceDelete?: (task: Task) => void;
    isTrashed?: boolean;
}

export function TaskCard({
    task,
    onRestore,
    onForceDelete,
    isTrashed = false,
}: TaskCardProps) {
    const isCompleted = task.status === 'completed';

    const handleStatusToggle = () => {
        if (isTrashed) return;
        const newStatus: TaskStatus = isCompleted ? 'to_do' : 'completed';
        router.patch(`/tasks/${task.id}/status`, { status: newStatus }, { preserveScroll: true });
    };

    // Calculate due date status
    const formatDueDate = () => {
        if (!task.due_date) return null;

        const due = new Date(task.due_date + 'T00:00:00');
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const isToday = due.getTime() === now.getTime();
        const isPast = due.getTime() < now.getTime();

        const formatted = due.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: due.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });

        if (isCompleted) {
            return (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {formatted}
                </span>
            );
        }

        if (isPast) {
            return (
                <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                    <AlertCircle className="size-3.5" />
                    Overdue ({formatted})
                </span>
            );
        }

        if (isToday) {
            return (
                <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                    <Clock className="size-3.5" />
                    Due today
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                {formatted}
            </span>
        );
    };

    return (
        <Card
            className={`group border border-border/70 shadow-xs transition-all duration-200 hover:shadow-md hover:border-border ${
                isCompleted ? 'bg-muted/20 opacity-80' : 'bg-card'
            }`}
        >
            <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Status Checkbox Button */}
                        {!isTrashed && (
                            <button
                                type="button"
                                onClick={handleStatusToggle}
                                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                                    isCompleted
                                        ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                                        : 'border-input hover:border-primary hover:bg-primary/5'
                                }`}
                                title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                                {isCompleted && <CheckCircle2 className="size-3.5" />}
                            </button>
                        )}

                        <div className="min-w-0 flex-1">
                            <h4
                                className={`text-base font-semibold leading-snug tracking-tight text-foreground ${
                                    isCompleted ? 'line-through text-muted-foreground' : ''
                                }`}
                            >
                                {task.title}
                            </h4>

                            {task.description && (
                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                            >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Task actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            {!isTrashed ? (
                                <DropdownMenuItem onClick={() => router.patch(`/tasks/${task.id}/status`, { status: 'completed' }, { preserveScroll: true })}>
                                    <CheckCircle2 className="mr-2 size-4" />
                                    Mark as Completed
                                </DropdownMenuItem>
                            ) : (
                                <>
                                    {onRestore && (
                                        <DropdownMenuItem onClick={() => onRestore(task)}>
                                            <RotateCcw className="mr-2 size-4" />
                                            Restore Task
                                        </DropdownMenuItem>
                                    )}
                                    {onForceDelete && (
                                        <DropdownMenuItem
                                            onClick={() => onForceDelete(task)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            Delete Permanently
                                        </DropdownMenuItem>
                                    )}
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Badges & Meta */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                        <CategoryBadge category={task.category} />
                    </div>

                    <div className="shrink-0">{formatDueDate()}</div>
                </div>
            </CardContent>
        </Card>
    );
}

