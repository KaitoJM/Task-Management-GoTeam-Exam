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
            'description' => $this->randomTask(),
            'done' => fake()->boolean(),
            'created_at' => $this->randomDate(),
            'updated_at' => now(),
        ];
    }

    private function randomDate()
    {
        return fake()->dateTimeBetween('2025-11-1', date('Y-m-d'));
    }

    private function randomTask() {
        $tasks = [
            "Buy groceries for the week including fruits and vegetables.",
            "Finish reading the latest chapter of the novel.",
            "Call mom to check how she's doing.",
            "Schedule dentist appointment for next month.",
            "Clean the living room and vacuum the carpet.",
            "Prepare a presentation for tomorrow's meeting.",
            "Update the project documentation with new features.",
            "Take the dog for a 30-minute walk.",
            "Organize the files on the desktop.",
            "Send emails to clients about the new offers.",
            "Water the plants in the balcony.",
            "Plan weekend trip and book hotel.",
            "Review the monthly budget and expenses.",
            "Write a blog post about productivity tips.",
            "Respond to pending messages on Slack.",
            "Research for the upcoming marketing campaign.",
            "Backup important files to external drive.",
            "Clean up the kitchen and wash dishes.",
            "Practice guitar for at least 20 minutes.",
            "Check flight prices for holiday trip.",
            "Finish the online course module on Vue 3.",
            "Prepare lunch for tomorrow.",
            "Declutter the wardrobe and donate old clothes.",
            "Update LinkedIn profile with recent achievements.",
            "Check the weather forecast for the weekend.",
            "Install updates for all software on the PC.",
            "Write a thank-you note to a colleague.",
            "Plan meals for the week and make a shopping list.",
            "Go for a morning run for at least 3 km.",
            "Check and pay pending bills online.",
            "Organize bookshelf by genre and author.",
            "Create a backup of phone photos to cloud storage.",
            "Update task management app with current progress.",
            "Watch a tutorial about advanced JavaScript topics.",
            "Clean and organize email inbox.",
            "Set reminders for upcoming deadlines.",
            "Prepare a small gift for a friend’s birthday.",
            "Plan a team-building activity for next month.",
            "Do a 20-minute meditation session.",
            "Check social media notifications and respond.",
            "Update personal finance spreadsheet with latest expenses."
        ];

        $indx = fake()->numberBetween(0, 39);
        return $tasks[$indx];
    }
}
