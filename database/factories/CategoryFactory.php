<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement(['Work', 'Personal', 'Development', 'Urgent', 'Health', 'Finance', 'Design', 'Meetings']),
            'color' => fake()->randomElement($colors),
            'description' => fake()->sentence(),
        ];
    }
}

