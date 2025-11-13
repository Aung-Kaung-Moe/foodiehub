<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CartController;

Route::prefix('api')->middleware(['web'])->group(function () {
    // Auth (public)
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    // Protected (must be logged in)
    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);

        // Profile
        Route::get('/profile',            [ProfileController::class, 'show']);
        Route::put('/profile',            [ProfileController::class, 'update']);
        Route::post('/profile/avatar',    [ProfileController::class, 'updateAvatar']);
        Route::put('/profile/password',   [ProfileController::class, 'updatePassword']);
        Route::post('/profile/password',  [ProfileController::class, 'updatePassword']);

        // Cart
        Route::get('/cart',               [CartController::class, 'show']);
        Route::post('/cart/items',        [CartController::class, 'addItem']);
        Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
        Route::put('/cart/transport',     [CartController::class, 'setTransport']);
        Route::post('/cart/checkout',     [CartController::class, 'checkout']);
    });
});
