<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = $request->user()->categories()
            ->withCount('tasks')
            ->with(['tasks' => fn ($tasks) => $tasks->latest()])
            ->orderBy('name')
            ->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $request->user()->categories()->create($request->validated());
        return redirect()->back()->with('success', 'Category created successfully.');
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category = $request->user()->categories()->findOrFail($category->getKey());
        $category->update($request->validated());
        return redirect()->back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        $category = $request->user()->categories()->findOrFail($category->getKey());
        $category->tasks()->update(['category_id' => null]);
        $category->delete();
        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
