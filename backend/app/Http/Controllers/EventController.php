<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRequest;
use App\Models\Events;

class EventController extends Controller
{
    // did the validation by form request vaidation class
    public function createEvent(EventRequest $request)
    {

        try {

            $validInput = $request->validated();

            // create the event information
            $eventData = Events::create([
                "name" => $validInput['event_name'],
                "location" => $validInput['location'],
                "duration" => $validInput['duration'],
                "from_date" => $validInput['from_date'],
                "to_date" => $validInput['to_date'],
                "from_time" => $validInput['from_time'],
                "to_time" => $validInput['to_time'],
            ]);


            if ($eventData->wasRecentlyCreated) {

                // create the time slot
                $slotData = SlotController::createTimeSlots($eventData);

                if ($slotData) {

                    //return collection or array then convert this  response with middelware
                    return [
                        'success' => true,
                        'message' => 'Event created successfuly'
                    ];
                }
            } else {

                //return collection or array then convert this  response with middelware
                return [
                    'success' => false,
                    'message' => 'Opps! Issue while create the event'
                ];
            }
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function getList()
    {

        try {

            // get the event details
            $eventData = Events::all();

            //return collection or array then convert this  response with middelware
            return [
                'success' => true,
                'message' => 'get event list successfuly',
                'data' => $eventData
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
