import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Calendar, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category, Task, TaskPriority, TaskStatus } from '@/types';

const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const isRealDateOnly = (value: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const parsedDate = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsedDate.getTime())
        && parsedDate.toISOString().slice(0, 10) === value;
};

const isValidDateOnly = (value: string): boolean => {
    return isRealDateOnly(value) && value >= getTodayDate();
};

const getDueDateError = (value: string): string => {
    if (!value) return 'Due date is required. Please select a date.';
    if (!isRealDateOnly(value)) return 'That date does not exist. Please select a valid date.';
    if (value < getTodayDate()) {
        return 'Due date cannot be in the past. Please choose today or a future date.';
    }

    return 'That date does not exist. Please select a valid date.';
};

interface TaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: Task | null;
    categories: Category[];
    defaultStatus?: TaskStatus;
    defaultCategoryId?: number;
}

export function TaskModal({
    open,
    onOpenChange,
    task,
    categories,
    defaultStatus = 'to_do',
    defaultCategoryId,
}: TaskModalProps) {
    const isEditing = !!task;

    const { data, setData, post, put, processing, errors, reset, clearErrors, setError, transform } = useForm({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: (task?.status ?? defaultStatus) as TaskStatus,
        priority: (task?.priority ?? 'medium') as TaskPriority,
        due_date: task?.due_date ? String(task.due_date).substring(0, 10) : '',
        category_id: task
            ? task.category_id === null ? '' : String(task.category_id)
            : String(defaultCategoryId ?? ''),
    });

    useEffect(() => {
        if (open) {
            setData({
                title: task?.title ?? '',
                description: task?.description ?? '',
                status: (task?.status ?? defaultStatus) as TaskStatus,
                priority: (task?.priority ?? 'medium') as TaskPriority,
                due_date: task?.due_date ? String(task.due_date).substring(0, 10) : '',
                category_id: task
                    ? task.category_id === null ? '' : String(task.category_id)
                    : String(defaultCategoryId ?? ''),
            });
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    }, [open, task, defaultStatus, defaultCategoryId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const dueDate = data.due_date;
        const validDueDate = isValidDateOnly(dueDate);

        if (!validDueDate) {
            setError('due_date', getDueDateError(dueDate));
            return;
        }

        transform((currentData) => ({
            ...currentData,
            category_id: currentData.category_id ? Number(currentData.category_id) : null,
            due_date: currentData.due_date,
        }));

        if (isEditing && task) {
            put(`/tasks/${task.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        } else {
            post('/tasks', {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <CheckSquare className="size-5" />
                            </div>
                            <DialogTitle>
                                {isEditing ? 'Edit Task' : 'Create New Task'}
                            </DialogTitle>
                        </div>
                        <DialogDescription>
                            {isEditing
                                ? 'Update details, status, or deadline for this task.'
                                : 'Add a new task to organize your work and stay on schedule.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <Label htmlFor="task-title">
                                Task Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="task-title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="What needs to be done?"
                                autoFocus
                            />
                            {errors.title && (
                                <p className="text-xs font-medium text-destructive">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="task-description">Description (Optional)</Label>
                            <textarea
                                id="task-description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Add any notes, steps, or details..."
                                rows={3}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                            {errors.description && (
                                <p className="text-xs font-medium text-destructive">{errors.description}</p>
                            )}
                        </div>

                        {/* Status and priority for new tasks */}
                        <div className={`grid grid-cols-1 gap-4 ${isEditing ? '' : 'sm:grid-cols-2'}`}>
                            <div className="space-y-1.5">
                                <Label htmlFor="task-status">Status</Label>
                                <select
                                    id="task-status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as TaskStatus)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <option value="to_do">To Do</option>
                                    {(!isEditing || data.status === 'in_progress') && (
                                        <option value="in_progress" disabled={isEditing}>
                                            {isEditing ? 'In Progress (current)' : 'In Progress'}
                                        </option>
                                    )}
                                    <option value="completed">Completed</option>
                                </select>
                                {errors.status && (
                                    <p className="text-xs font-medium text-destructive">{errors.status}</p>
                                )}
                            </div>

                            {!isEditing && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="task-priority">Priority</Label>
                                    <select
                                        id="task-priority"
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value as TaskPriority)}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                    {errors.priority && (
                                        <p className="text-xs font-medium text-destructive">{errors.priority}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="task-due-date" className="flex items-center gap-1.5">
                                <Calendar className="size-3.5" />
                                Due Date <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="task-due-date"
                                type="date"
                                min={getTodayDate()}
                                value={data.due_date}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setData('due_date', value);
                                    if (isValidDateOnly(value)) {
                                        clearErrors('due_date');
                                    } else if (value) {
                                        setError('due_date', getDueDateError(value));
                                    } else {
                                        clearErrors('due_date');
                                    }
                                }}
                                aria-invalid={Boolean(errors.due_date)}
                                aria-describedby={errors.due_date ? 'task-due-date-error' : undefined}
                                className={`h-10 ${errors.due_date ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            />
                            {errors.due_date && (
                                <p id="task-due-date-error" className="text-xs font-medium text-destructive">{errors.due_date}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving...'
                                : isEditing
                                ? 'Save Changes'
                                : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
