<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the task resource of the authenticated user.
     */
    public function index()
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Get all tasks created by the authenticated user.
        $tasks = Task::where('user_id', $userId)->get();

        // Return a collection of the tasks.
        return TaskResource::collection($tasks);
    }

    /**
     * Store a newly created task for the authenticated user.
     */
    public function store(CreateTaskRequest $request)
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Process assigning of task to authenticated user.
        $createdTask = Task::create([
            'description' => $request->description,
            'user_id' => $userId
        ]);

        // If creation of task failed, return an error.
        if (!$createdTask) {
            return response()->json(['error' => 'Creation of task failed'], 400) ;
        }

        // If success, return the newly created task data.
        return response()->json($createdTask, 201);
    }

    /**
     * Display the specified task.
     */
    public function show(string $id)
    {
        // Get task data by ID.
        $task = Task::findOrFail($id);

        // Return the tasks data.
        return new TaskResource($task);
    }

    /**
     * Update the specified task in storage.
     */
    public function update(UpdateTaskRequest $request, string $id)
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Ensure only owner can update
        $task = Task::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        // Only update fields that exist in the request
        $task->update($request->only(['description', 'done']));

        // Return the updated task data
        return (new TaskResource($task))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(string $id)
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Ensure only owner can update
        $task = Task::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        // Process task deletion
        $task->delete();

        return response()->noContent(); // 204 response
    }
}
