<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UniversityController;
use App\Http\Controllers\Api\V1\TemplateController;
use App\Http\Controllers\Api\V1\ReportController;

Route::prefix('v1')->group(function () {
    // Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
        Route::post('/resend-verification', [AuthController::class, 'resendVerification']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/user', [AuthController::class, 'user']);
            Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
        });
    });

    // Public / Read-Only University & Template Discovery
    Route::get('/universities', [UniversityController::class, 'index']);
    Route::get('/universities/{id}', [UniversityController::class, 'show']);
    Route::get('/universities/{id}/report-types', [UniversityController::class, 'reportTypes']);
    Route::get('/universities/{id}/templates', [UniversityController::class, 'templates']);

    Route::get('/templates', [TemplateController::class, 'index']);
    Route::get('/templates/resolve', [TemplateController::class, 'resolve']);
    Route::get('/templates/{id}/preview', [TemplateController::class, 'preview']);
    Route::post('/templates/sync', [TemplateController::class, 'sync']);

    // Report Management & Dynamic Generation
    Route::post('/reports', [ReportController::class, 'initialize']);
    Route::post('/reports/initialize', [ReportController::class, 'initialize']);
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);
    Route::match(['put', 'patch'], '/reports/{reportId}/sections/{sectionId}', [ReportController::class, 'updateSection']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/profile/academic', [AuthController::class, 'updateAcademicProfile']);
    });
});

