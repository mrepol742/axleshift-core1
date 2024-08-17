<?php

use App\Http\Controllers\APIController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\FreightController;
use App\Http\Controllers\TrackController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes();

Route::middleware(['auth'])->group(function () {

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
