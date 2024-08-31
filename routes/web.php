<?php

use App\Http\Controllers\APIController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\FreightController;
use App\Http\Controllers\TrackController;
use App\Http\Middleware\EnsureEmailIsVerified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Auth::routes();

Route::get('/email/verify', function () {
    return view('auth.verify');
})
    ->middleware('auth')
    ->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/');
})
    ->middleware(['auth', 'signed'])
    ->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('resent', 'Verification link sent!');
})
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.resend');
    
Route::middleware(['auth', EnsureEmailIsVerified::class])->group(function () {

    Route::get('/', [Controller::class, 'index']);

    Route::get('/freight/{method}', [FreightController::class, 'request'])
        ->where('method', '.*');


    Route::get('/track/', [TrackController::class, 'index'])
        ->name('track.search');
    Route::get('/track/search/{tracking_id}', [TrackController::class, 'request'])
        ->where('tracking_id', '.*');


    Route::fallback(function () {

        return view('errors.404');
    });
});

Route::post('/api/{what}', [APIController::class, 'request'])
    ->where('what', '.*');
