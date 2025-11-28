<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\FilterTaskRequest;
use App\Http\Requests\SortTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Services\TaskService;

class TaskController extends Controller
{
    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Display a listing of the task resource of the authenticated user.
     */
    public function index(FilterTaskRequest $request)
    {
        $userId = Auth::id();

        // Extract validated params
        $params = $request->validated();

        // Call service fetch method
        $tasks = $this->taskService->getTasks($userId, $params);

        return TaskResource::collection($tasks);
    }

    /**
     * Store a newly created task for the authenticated user.
     */
    public function store(CreateTaskRequest $request)
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Extract validated params
        $params = $request->validated();
        
        // Call service create method
        $createdTask = $this->taskService->createTask($userId, $params);

        // If success, return the newly created task data.
        return response()->json([
            'data' => $createdTask
        ], 201);
    }

    /**
     * Display the specified task.
     */
    public function show(string $id)
    {
        // Get task data by ID.
        $task = $this->taskService->showTask($id);

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
        $check = $this->taskService->showTask($id);
        if ($check->user_id != $userId) {
            return response()->json(['error' => 'You are not allowed to edit this task'], 403);
        }

        // Only update fields that exist in the request
        $task = $this->taskService->updateTask($id, 
            $request->only(
                ['description', 'done', 'sort_order']
            )
        );

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

        // Ensure only owner can delete
        $check = $this->taskService->showTask($id);
        if ($check->user_id != $userId) {
            return response()->json(['error' => 'You are not allowed to delete this task'], 403);
        }

        // Process task deletion
        $task = $this->taskService->deleteTask($id);

        return response()->noContent(); // 204 response
    }

    public function sort(SortTaskRequest $request)
    {
        $ids = $request->taskIds;
        // Get authenticated user's ID
        $userId = Auth::id();

        // Ensure only owner can update
        foreach($ids as $indx => $id) {
            $check = $this->taskService->showTask($id);

            if ($check->user_id != $userId) {
                return response()->json(['error' => 'One or more tasks do not belong to the authenticated user.'], 403);
            }
        }

        // Only update fields that exist in the request
        foreach($ids as $indx => $id) {
            $task = $this->taskService->updateTask($id, ['sort_order' => $indx]);
        }

        return response()->noContent(); // 204 response
    }
}
