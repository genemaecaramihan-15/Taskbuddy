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

interface TaskTableProps {
    tasks: Task[];
    onRestore?: (task: Task) => void;
    onForceDelete?: (task: Task) => void;
    isTrashed?: boolean;
}

export function TaskTable({
    tasks,
    onRestore,
    onForceDelete,
    isTrashed = false,
}: TaskTableProps) {
    const handleStatusToggle = (task: Task) => {
        if (isTrashed) return;
        const newStatus: TaskStatus = task.status === 'completed' ? 'to_do' : 'completed';
        router.patch(`/tasks/${task.id}/status`, { status: newStatus }, { preserveScroll: true });
    };

    const renderDueDate = (task: Task) => {
        if (!task.due_date) return <span className="text-muted-foreground/60 text-xs">—</span>;

        const due = new Date(task.due_date + 'T00:00:00');
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const isToday = due.getTime() === now.getTime();
        const isPast = due.getTime() < now.getTime();

        const formatted = due.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        });

        if (task.status === 'completed') {
            return <span className="text-xs text-muted-foreground">{formatted}</span>;
        }

        if (isPast) {
            return (
                <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                    <AlertCircle className="size-3" />
                    {formatted} (Overdue)
                </span>
            );
        }

        if (isToday) {
            return (
                <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                    <Clock className="size-3" />
                    Today
                </span>
            );
        }

        return <span className="text-xs text-muted-foreground">{formatted}</span>;
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-border/80 bg-muted/40 text-xs font-medium uppercase text-muted-foreground">
                    <tr>
                        <th className="w-12 px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3">Task Details</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="w-12 px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                    {tasks.map((task) => {
                        const isCompleted = task.status === 'completed';
                        return (
                            <tr
                                key={task.id}
                                className={`transition-colors hover:bg-muted/30 ${
                                    isCompleted ? 'bg-muted/10 opacity-75' : ''
                                }`}
                            >
                                {/* Checkbox / Status */}
                                <td className="px-4 py-3 text-center align-top pt-3.5">
                                    {!isTrashed ? (
                                        <button
                                            type="button"
                                            onClick={() => handleStatusToggle(task)}
                                            className={`inline-flex size-5 items-center justify-center rounded-md border transition-colors ${
                                                isCompleted
                                                    ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                                                    : 'border-input hover:border-primary hover:bg-primary/5'
                                            }`}
                                            title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                                        >
                                            {isCompleted && <CheckCircle2 className="size-3.5" />}
                                        </button>
                                    ) : (
                                        <StatusBadge status={task.status} showIcon={false} />
                                    )}
                                </td>

                                {/* Title & Description */}
                                <td className="px-4 py-3">
                                    <div className="space-y-0.5">
                                        <div
                                            className={`font-medium text-foreground ${
                                                isCompleted ? 'line-through text-muted-foreground' : ''
                                            }`}
                                        >
                                            {task.title}
                                        </div>
                                        {task.description && (
                                            <p className="line-clamp-1 text-xs text-muted-foreground">
                                                {task.description}
                                            </p>
                                        )}
                                    </div>
                                </td>

                                <td className="px-4 py-3 whitespace-nowrap">
                                    <CategoryBadge category={task.category} />
                                </td>

                                {/* Priority */}
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <PriorityBadge priority={task.priority} />
                                </td>

                                {/* Due Date */}
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {renderDueDate(task)}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-muted-foreground hover:text-foreground"
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
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

