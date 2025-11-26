<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskGroupController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/users', [UserController::class, 'index'])->middleware('auth:sanctum');
Route::apiResource('/tasks', TaskController::class)->middleware('auth:sanctum');
Route::get('/task-groups', [TaskGroupController::class, 'index'])->middleware('auth:sanctum');
Route::patch('/tasks-reorder', [TaskController::class, 'sort'])->middleware('auth:sanctum');