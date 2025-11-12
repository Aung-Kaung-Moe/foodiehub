<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/health', fn() => response()->json(['ok'=>true,'service'=>'foodiehub-api']));

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login',    [AuthController::class, 'login']);
// Route::post('/logout',   [AuthController::class, 'logout']);
// Route::middleware(['web','auth'])->prefix('api')->group(function () {
//     Route::get('/me',        [\App\Http\Controllers\AuthController::class, 'me']);

//     Route::get('/profile',   [ProfileController::class, 'show']);
//     Route::put('/profile',   [ProfileController::class, 'update']);               // name, email?, address fields
//     Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);   // multipart
//     Route::put('/profile/password', [ProfileController::class, 'updatePassword']); // current/new/confirm
// });
