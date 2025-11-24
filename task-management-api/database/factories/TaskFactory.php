<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'description' => fake()->sentence(1),
            'done' => fake()->boolean(),
            'created_at' => $this->randomDate(),
            'updated_at' => now(),
        ];
    }

    private function randomDate()
    {
        return fake()->dateTimeBetween('2025-11-24', '2025-11-29');
    }
}
