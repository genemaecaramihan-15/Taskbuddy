<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks with filtering, search, sorting, and pagination.
     */
    public function index(Request $request): Response
    {
        $view = $request->input('view', 'active');
        $search = $request->input('search');
        $status = $request->input('status', 'all');
        $priority = $request->input('priority', 'all');
        $categoryId = $request->input('category_id', $view === 'active' ? 'categorized' : 'all');
        $dueDatePreset = $request->input('due_date', 'all');
        $sort = $request->input('sort', 'newest');

        $baseQuery = $view === 'trashed'
            ? $request->user()->tasks()->onlyTrashed()
            : $request->user()->tasks();

        $query = $baseQuery->with('category')
            ->search($search)
            ->status($status)
            ->priority($priority)
            ->category($categoryId)
            ->dueDatePreset($dueDatePreset);

        // Sorting
        match ($sort) {
            'oldest' => $query->oldest('created_at'),
            'priority' => $query->orderByRaw("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 ELSE 5 END"),
            'due_date' => $query->orderByRaw('due_date IS NULL, due_date ASC'),
            default => $query->latest('created_at'),
        };

        $tasks = $query->paginate(12)->withQueryString();
        $categories = $request->user()->categories()->orderBy('name')->get();

        $counts = [
            'active' => $request->user()->tasks()->count(),
            'trashed' => $request->user()->tasks()->onlyTrashed()->count(),
        ];

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'categories' => $categories,
            'filters' => [
                'view' => $view,
                'search' => $search ?? '',
                'status' => $status,
                'priority' => $priority,
                'category_id' => $categoryId,
                'due_date' => $dueDatePreset,
                'sort' => $sort,
            ],
            'counts' => $counts,
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if ($data['status'] === 'completed') {
            $data['completed_at'] = Carbon::now();
        }

        $request->user()->tasks()->create($data);

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    /**
     * Update the specified task.
     */
    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $task = $request->user()->tasks()->findOrFail($task->getKey());

        $data = $request->validated();

        if ($data['status'] === 'completed' && $task->status !== 'completed') {
            $data['completed_at'] = Carbon::now();
        } elseif ($data['status'] !== 'completed') {
            $data['completed_at'] = null;
        }

        $task->update($data);

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    /**
     * Quick status update for a task.
     */
    public function updateStatus(Request $request, Task $task): RedirectResponse
    {
        $task = $request->user()->tasks()->findOrFail($task->getKey());

        $validated = $request->validate([
            'status' => ['required', 'in:to_do,in_progress,completed'],
        ]);

        $task->status = $validated['status'];
        $task->completed_at = $validated['status'] === 'completed' ? Carbon::now() : null;
        $task->save();

        return redirect()->back()->with('success', 'Task status updated.');
    }

    /**
     * Soft delete the task.
     */
    public function destroy(Request $request, Task $task): RedirectResponse
    {
        $task = $request->user()->tasks()->findOrFail($task->getKey());

        $task->delete();

        return redirect()->back()->with('success', 'Task moved to trash.');
    }

    /**
     * Restore a soft-deleted task.
     */
    public function restore(Request $request, int $id): RedirectResponse
    {
        $task = $request->user()->tasks()->onlyTrashed()->findOrFail($id);

        $task->restore();

        return redirect()->back()->with('success', 'Task restored successfully.');
    }

    /**
     * Permanently delete a task.
     */
    public function forceDelete(Request $request, int $id): RedirectResponse
    {
        $task = $request->user()->tasks()->onlyTrashed()->findOrFail($id);

        $task->forceDelete();

        return redirect()->back()->with('success', 'Task permanently deleted.');
    }
}

