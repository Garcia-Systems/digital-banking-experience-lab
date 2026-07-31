<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransferController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', DashboardController::class);
Route::post('/transfers', TransferController::class);
