<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HealthMetricsController;

Route::prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::post('/upload', [HealthMetricsController::class, 'upload']);
        Route::get('/health-metrics/daily', [HealthMetricsController::class, 'getDailyMetrics']);
        Route::get('/health-metrics/weekly', [HealthMetricsController::class, 'getWeeklyMetrics']);
    });

});