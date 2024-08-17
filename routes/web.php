<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes();

Route::middleware(['auth'])->group(function () {

    Route::get('/', function () {
        return view('index');
    });

    Route::get('/subitem', function () {
        return view('subitem');
    })->name('subitem');

    Route::get('/subitem1', function () {
        return view('subitem');
    })->name('subitem1');


    
});