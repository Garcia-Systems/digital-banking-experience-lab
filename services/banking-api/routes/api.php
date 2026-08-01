<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberVerificationController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TransferController;
use App\Http\Middleware\RequireLaboratorySession;
use App\Http\Middleware\RequireOperationsRole;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::middleware(StartSession::class)->group(function (): void {
    Route::post('/login', [SessionController::class, 'login']);
    Route::post('/logout', [SessionController::class, 'logout']);
    Route::get('/session', [SessionController::class, 'show']);

    Route::middleware(RequireLaboratorySession::class)->group(function (): void {
        Route::get('/dashboard', DashboardController::class);
        Route::get('/member-verification', [MemberVerificationController::class, 'show']);
        Route::post('/member-verification', [MemberVerificationController::class, 'store']);
        Route::post('/transfers', [TransferController::class, 'store']);
        Route::get('/transfers/{transferId}', [TransferController::class, 'show']);
    });
});

Route::prefix('operations')->middleware(RequireOperationsRole::class)->group(function (): void {
    Route::get('/dashboard', App\Http\Controllers\Operations\DashboardController::class);
    Route::get('/members', App\Http\Controllers\Operations\MemberController::class);
    Route::get('/transfers', App\Http\Controllers\Operations\TransferController::class);
});
