<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\SlotController;
use Illuminate\Support\Facades\Route;

// use blue green approche for api stable
Route::prefix('/v1')->group(function (){

    Route::prefix('/slot')->group(function () {

        Route::get('/available',[SlotController::class,'getAvailableSolt']);
        Route::get('/booked',[SlotController::class,'getBookedSolt']);

    });
    Route::prefix('/booking')->group(function () {

        Route::post('/create',[BookingController::class,'doBooking']);
        Route::get('/show/{event_id}',[BookingController::class,'showBooking']);

    });
    Route::prefix('/event')->group(function () {

        Route::post('/create',[EventController::class,'createEvent']);
        Route::get('/list',[EventController::class,'getList']);

    });


});

