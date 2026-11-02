<?php

namespace App\Http\Requests;

use App\Rules\ValidDateOnly;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['required', Rule::in(['to_do', 'in_progress', 'completed'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'due_date' => ['bail', 'required', new ValidDateOnly],
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->where('user_id', $this->user()->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'A task title is required.',
            'status.in' => 'Selected status is invalid. Choose To Do, In Progress, or Completed.',
            'priority.in' => 'Selected priority is invalid. Choose Low, Medium, High, or Urgent.',
            'due_date.required' => 'Due date is required. Please select a date.',
            'category_id.exists' => 'The selected category is invalid or does not belong to you.',
        ];
    }
}

