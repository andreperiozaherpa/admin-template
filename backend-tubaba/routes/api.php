<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SaldoController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (requires authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard - all authenticated users can view
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/comparison', [DashboardController::class, 'comparison']);
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/top-rekening', [DashboardController::class, 'topRekening']);
    Route::get('/dashboard/banks', [DashboardController::class, 'banks']);

    // Saldo - all authenticated users can view
    Route::get('/saldo', [SaldoController::class, 'index']);
    Route::get('/saldo/latest', [SaldoController::class, 'latest']);
    Route::get('/saldo/summary', [SaldoController::class, 'summary']);
    Route::get('/saldo/history', [SaldoController::class, 'history']);

    // Saldo Upload - only admin and bank can upload
    Route::middleware('role:admin,bank')->group(function () {
        Route::post('/saldo/upload', [SaldoController::class, 'upload']);
        Route::delete('/saldo', [SaldoController::class, 'destroyByDate']);
    });

    // User Management - only admin
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });
});
