import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ClipboardList, Eye, LayoutGrid, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CategoryModal, ConfirmationModal, EmptyState, StatusBadge, TaskModal } from '@/components/taskbuddy';
import type { Category, Task } from '@/types';

export default function CategoriesIndex({ categories }: { categories: Category[] }) {
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

    const createCategory = () => { setSelectedCategory(null); setCategoryModalOpen(true); };
    const addTask = (category: Category) => {
        setSelectedTask(null);
        setSelectedCategory(category);
        setTaskModalOpen(true);
    };
    const editTask = (task: Task) => {
        setSelectedTask(task);
        setSelectedCategory(null);
        setTaskModalOpen(true);
    };
    const deleteSelected = () => {
        if (!deleteCategory) return;
        router.delete(`/categories/${deleteCategory.id}`, { preserveScroll: true, onSuccess: () => setDeleteCategory(null) });
    };

    return (
        <>
            <Head title="Categories" />
            <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-7 px-5 py-8 sm:px-8 lg:px-10 lg:py-9">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-4"><LayoutGrid className="size-10 text-blue-400" /><h1 className="text-3xl font-bold sm:text-4xl">Categories</h1></div>
                        <p className="mt-2 text-base text-muted-foreground sm:text-lg">Organize your tasks by topic or project.</p>
                    </div>
                    <Button onClick={createCategory} className="h-12 gap-2 self-start rounded-xl px-5"><Plus className="size-5" /> Create category</Button>
                </div>

                {categories.length === 0 ? (
                    <EmptyState title="No categories yet" description="Create a category to group related tasks." icon={LayoutGrid} />
                ) : (
                    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 2xl:grid-cols-3">
                        {categories.map((category) => {
                            const count = category.tasks_count ?? 0;
                            const isExpanded = expandedCategories.includes(category.id);
                            return (
                                <article key={category.id} className="flex self-start flex-col rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-6" style={{ borderColor: `${category.color}66`, backgroundImage: `linear-gradient(135deg, ${category.color}14, transparent 48%)` }}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-4">
                                            <span className="grid size-12 shrink-0 place-items-center rounded-2xl shadow-sm" style={{ backgroundColor: `${category.color}24`, color: category.color }}><LayoutGrid className="size-6" /></span>
                                            <div className="min-w-0"><h2 className="truncate text-xl font-bold text-foreground">{category.name}</h2><p className="mt-1 text-sm font-medium" style={{ color: category.color }}>{category.color.toUpperCase()}</p></div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${category.name}`}><MoreHorizontal className="size-5" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setSelectedCategory(category); setCategoryModalOpen(true); }}><Pencil className="mr-2 size-4" /> Edit category</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setDeleteCategory(category)} className="text-destructive"><Trash2 className="mr-2 size-4" /> Delete category</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-muted-foreground"><ClipboardList className="size-5" /> {count} {count === 1 ? 'task' : 'tasks'}</div>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description || 'Keep related tasks organized in one place.'}</p>
                                    {count > 0 && isExpanded && <div className="mt-4 space-y-2">
                                        {category.tasks?.map((task) => (
                                            <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/80 px-3.5 py-3 shadow-sm transition-colors hover:border-sky-400/50">
                                                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-foreground">{task.title}</p>{task.due_date && <p className="mt-1 text-xs text-muted-foreground">Due {new Date(`${task.due_date.slice(0, 10)}T00:00:00`).toLocaleDateString()}</p>}</div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    <StatusBadge status={task.status} />
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8 text-muted-foreground" aria-label={`Actions for ${task.title}`}><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => editTask(task)}><Pencil className="mr-2 size-4" /> Edit task</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        ))}
                                        {category.tasks?.length === 0 && <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">No tasks to show yet.</p>}
                                    </div>}
                                    <div className="mt-auto pt-5">
                                        {count > 0 ? (
                                            <Button type="button" variant="ghost" aria-expanded={isExpanded} onClick={() => setExpandedCategories((current) => isExpanded ? current.filter((id) => id !== category.id) : [...current, category.id])} className="h-12 w-full rounded-xl text-sm font-semibold text-foreground transition-colors hover:text-foreground" style={{ backgroundColor: `${category.color}24` }}><Eye className="size-5" />{isExpanded ? 'Hide tasks' : 'View tasks'}</Button>
                                        ) : (
                                            <Button variant="ghost" onClick={() => addTask(category)} className="h-12 w-full rounded-xl text-sm font-semibold text-foreground" style={{ backgroundColor: `${category.color}24` }}><Plus className="size-5" /> Add task</Button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
            <CategoryModal open={categoryModalOpen} onOpenChange={setCategoryModalOpen} category={selectedCategory} />
            <TaskModal open={taskModalOpen} onOpenChange={setTaskModalOpen} task={selectedTask} categories={categories} defaultCategoryId={selectedCategory?.id} />
            <ConfirmationModal open={!!deleteCategory} onOpenChange={(open) => !open && setDeleteCategory(null)} title="Delete Category?" description={`Delete "${deleteCategory?.name}"? Its tasks will become uncategorized.`} confirmText="Delete Category" variant="destructive" onConfirm={deleteSelected} />
        </>
    );
}

CategoriesIndex.layout = { breadcrumbs: [{ title: 'Categories', href: '/categories' }] };
