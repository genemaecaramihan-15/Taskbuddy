import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckSquare,
    Grid,
    List,
    Plus,
    RotateCcw,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    ConfirmationModal,
    EmptyState,
    TaskCard,
    TaskModal,
    TaskTable,
} from '@/components/taskbuddy';
import type { Category, PaginatedData, Task, TaskFilters } from '@/types';

interface TasksPageProps {
    tasks: PaginatedData<Task>;
    categories: Category[];
    filters: TaskFilters;
    counts: {
        active: number;
        trashed: number;
    };
}

export default function TasksIndex({
    tasks,
    categories,
    filters,
    counts,
}: TasksPageProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Confirmation Modal States
    const [confirmForceDeleteTask, setConfirmForceDeleteTask] = useState<Task | null>(null);

    const isTrashedView = filters.view === 'trashed';
    const selectedCategory = categories.find((category) => category.id === Number(filters.category_id));

    const handleSwitchViewTab = (view: 'active' | 'trashed') => {
        router.get(
            '/tasks',
            { view },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Task Action Handlers
    const handleCreateTask = () => {
        setIsTaskModalOpen(true);
    };

    const handleRestoreTask = (task: Task) => {
        router.post(`/tasks/${task.id}/restore`, {}, {
            preserveScroll: true,
        });
    };

    const handleForceDeleteTask = (task: Task) => {
        setConfirmForceDeleteTask(task);
    };

    const handleConfirmForceDelete = () => {
        if (!confirmForceDeleteTask) return;
        router.delete(`/tasks/${confirmForceDeleteTask.id}/force`, {
            preserveScroll: true,
            onSuccess: () => setConfirmForceDeleteTask(null),
        });
    };

    return (
        <>
            <Head title={isTrashedView ? 'Trashed Tasks' : selectedCategory ? `${selectedCategory.name} Tasks` : 'My Tasks'} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Title & Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {isTrashedView ? 'Trashed Tasks' : selectedCategory ? `${selectedCategory.name} Tasks` : 'My Tasks'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {isTrashedView
                                ? 'View and restore tasks that have been removed from your active list.'
                                : selectedCategory
                                ? `Tasks assigned to ${selectedCategory.name}.`
                                : 'Manage, prioritize, and track all your tasks in one place.'}
                        </p>
                    </div>

                </div>

                {/* Tabs & View Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    {/* Active vs Trashed Tabs */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleSwitchViewTab('active')}
                            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                                !isTrashedView
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <CheckSquare className="size-4" />
                            Active Tasks
                            <span
                                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                                    !isTrashedView
                                        ? 'bg-primary-foreground/20 text-primary-foreground'
                                        : 'bg-muted-foreground/10 text-muted-foreground'
                                }`}
                            >
                                {counts.active}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSwitchViewTab('trashed')}
                            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                                isTrashedView
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <Trash2 className="size-4" />
                            Trash
                            <span
                                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                                    isTrashedView
                                        ? 'bg-primary-foreground/20 text-primary-foreground'
                                        : 'bg-muted-foreground/10 text-muted-foreground'
                                }`}
                            >
                                {counts.trashed}
                            </span>
                        </button>
                    </div>

                    {/* Grid vs Table View Mode */}
                    <div className="flex items-center self-end sm:self-auto gap-1 rounded-lg border border-border p-1 bg-muted/40">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`flex size-8 items-center justify-center rounded-md text-sm transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title="Grid View"
                        >
                            <Grid className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`flex size-8 items-center justify-center rounded-md text-sm transition-colors ${
                                viewMode === 'table'
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title="Table View"
                        >
                            <List className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Tasks Content */}
                {tasks.data.length === 0 ? (
                    <EmptyState
                        title={
                            isTrashedView
                                ? 'Trash is empty'
                                : selectedCategory ? 'No tasks in this category yet' : 'No tasks yet'
                        }
                        description={
                            isTrashedView
                                ? 'No deleted tasks found. Any tasks you delete will show up here.'
                                : selectedCategory ? `Create a task in ${selectedCategory.name} to see it here.` : 'Get started by creating your first task to stay organized.'
                        }
                    />
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tasks.data.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onRestore={handleRestoreTask}
                                onForceDelete={handleForceDeleteTask}
                                isTrashed={isTrashedView}
                            />
                        ))}
                    </div>
                ) : (
                    <TaskTable
                        tasks={tasks.data}
                        onRestore={handleRestoreTask}
                        onForceDelete={handleForceDeleteTask}
                        isTrashed={isTrashedView}
                    />
                )}

                {/* Pagination */}
                {tasks.total > tasks.per_page && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{tasks.from}</span> to{' '}
                            <span className="font-semibold text-foreground">{tasks.to}</span> of{' '}
                            <span className="font-semibold text-foreground">{tasks.total}</span> tasks
                        </p>

                        <div className="flex items-center gap-1">
                            {tasks.links.map((link, idx) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={idx}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="px-3 py-1.5 text-xs text-muted-foreground/50 rounded-md"
                                        />
                                    );
                                }

                                return (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground font-bold'
                                                : 'text-foreground hover:bg-muted'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Task Create / Edit Modal */}
            <TaskModal
                open={isTaskModalOpen}
                onOpenChange={setIsTaskModalOpen}
                categories={categories}
                defaultCategoryId={selectedCategory?.id}
            />

            {/* Permanent Delete Confirmation Modal */}
            <ConfirmationModal
                open={!!confirmForceDeleteTask}
                onOpenChange={(open) => !open && setConfirmForceDeleteTask(null)}
                title="Permanently Delete Task?"
                description={`This action cannot be undone. "${confirmForceDeleteTask?.title}" will be permanently removed.`}
                confirmText="Delete Permanently"
                variant="destructive"
                onConfirm={handleConfirmForceDelete}
            />
        </>
    );
}

TasksIndex.layout = {
    breadcrumbs: [
        {
            title: 'My Tasks',
            href: '/tasks',
        },
    ],
};

