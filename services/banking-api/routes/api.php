<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TransferController;
use App\Http\Middleware\RequireLaboratorySession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::middleware(StartSession::class)->group(function (): void {
    Route::post('/login', [SessionController::class, 'login']);
    Route::post('/logout', [SessionController::class, 'logout']);
    Route::get('/session', [SessionController::class, 'show']);

    Route::middleware(RequireLaboratorySession::class)->group(function (): void {
        Route::get('/dashboard', DashboardController::class);
        Route::post('/transfers', [TransferController::class, 'store']);
        Route::get('/transfers/{transferId}', [TransferController::class, 'show']);
    });
});
