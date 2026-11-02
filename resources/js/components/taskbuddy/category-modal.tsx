import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Check, FolderPlus, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/types';

const colors = ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#14b8a6'];

export function CategoryModal({ open, onOpenChange, category }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category | null;
}) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: category?.name ?? '',
        color: category?.color ?? '#3b82f6',
        description: category?.description ?? '',
    });

    useEffect(() => {
        if (open) {
            setData({ name: category?.name ?? '', color: category?.color ?? '#3b82f6', description: category?.description ?? '' });
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    }, [open, category]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const options = { onSuccess: () => onOpenChange(false) };
        if (category) put(`/categories/${category.id}`, options);
        else post('/categories', options);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2"><FolderPlus className="size-5 text-primary" /><DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle></div>
                        <DialogDescription>Organize your tasks with color-coded categories.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="category-name">Category Name</Label>
                            <Input id="category-name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Work, Personal, Fitness" />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5"><Palette className="size-3.5" /> Color</Label>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color) => <button key={color} type="button" aria-label={`Choose ${color}`} onClick={() => setData('color', color)} className="flex size-7 items-center justify-center rounded-full" style={{ backgroundColor: color }}>{data.color === color && <Check className="size-4 text-white" />}</button>)}
                            </div>
                            <Input type="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className="h-10 w-16 p-1" />
                            {errors.color && <p className="text-xs text-destructive">{errors.color}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="category-description">Description (Optional)</Label>
                            <textarea id="category-description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="What belongs in this category?" />
                            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>Cancel</Button>
                        <Button type="submit" disabled={processing}>{category ? 'Save Category' : 'Create Category'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
