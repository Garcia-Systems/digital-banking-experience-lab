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
    Route::get('/members', [App\Http\Controllers\Operations\MemberController::class, 'index']);
    Route::get('/members/{memberId}', [App\Http\Controllers\Operations\MemberController::class, 'show']);
    Route::get('/transfers', [App\Http\Controllers\Operations\TransferController::class, 'index']);
    Route::get('/transfers/{transferId}', [App\Http\Controllers\Operations\TransferController::class, 'show']);
    Route::get('/failures', [App\Http\Controllers\Operations\FailureController::class, 'index']);
    Route::get('/failures/{failureId}', [App\Http\Controllers\Operations\FailureController::class, 'show']);
    Route::get('/verifications', [App\Http\Controllers\Operations\VerificationController::class, 'index']);
    Route::get('/verifications/{verificationId}', [App\Http\Controllers\Operations\VerificationController::class, 'show']);
});
