<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingRequest;
use App\Mail\Booking as MailBooking;
use App\Models\Booking;
use App\Models\Events;
use App\Models\Slot;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    // did the validation by form request vaidation class
    public function doBooking(BookingRequest $request)
    {

        //check the time availablity and book the slot
        try {

            $validInput = $request->validated();

            // ge the solt data with event using relationship
            $slotData = Slot::with('event')->find($validInput['slot_id']);

            if ($slotData && $slotData->is_booked) {

                //return collection or array then convert this  response with middelware
                return [
                    'success' => false,
                    'message' => 'Slot already Booked'
                ];
            }

            $bookingData = Booking::Create($validInput);

            if ($bookingData->wasRecentlyCreated) {

                $slotData->is_booked = 1;
                $slotData->save();

                // mail template with data
                $maildata = [
                    "user_name" =>  $bookingData->name,
                    "event_name" => $slotData->event->name,
                    "date" => $slotData->date,
                    "time" => $slotData->start_time->format('h:i A') . " - " . $slotData->end_time->format('h:i A'),
                    "start_time" => $slotData->start_time,
                    "end_time" => $slotData->end_time,
                    "location" => $slotData->event->location,
                ];

                // create ics content
                $maildata['ics'] = self::icsFile($maildata);

                // send mail with mailable class
                Mail::to($bookingData->email)->send(new MailBooking($maildata));

                //return collection or array then convert this  response with middelware
                return [
                    'success' => true,
                    'message' => 'Slot booked successfuly'
                ];
            } else {

                //return collection or array then convert this  response with middelware
                return [
                    'success' => false,
                    'message' => 'Opps! Issue while booking the slot'
                ];
            }
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function showBooking(Request $request, $event_id)
    {

        try {

            // get the event data with solt data
            $event = Events::with('slots')->findOrFail($event_id);

            $data = [
                "event_name" => $event->name,
                "duration" => $event->duration,
                "location" => $event->location,
                "date" => $event->slots->pluck('date')->unique()->toArray(),
                "slot_data" => $event->slots->toArray(),
            ];

            //return collection or array then convert this  response with middelware
            return [
                'success' => true,
                'message' => 'get booking details successfully',
                'data' => $data
            ];
        } catch (ModelNotFoundException $m) {
            throw $m;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public static function icsFile($data)
    {

        return "BEGIN:VCALENDAR
                VERSION:2.0
                PRODID:-//YourApp//Meeting//EN
                BEGIN:VEVENT
                UID:" . uniqid() . "
                DTSTAMP:" . now()->format('Ymd\THis\Z') . "
                DTSTART:" . $data['start_time']->utc()->format('Ymd\THis\Z') . "
                DTEND:" . $data['end_time']->utc()->format('Ymd\THis\Z') . "
                SUMMARY:" . $data['event_name'] . "
                DESCRIPTION:" . ($data['description'] ?? '') . "
                LOCATION:" . ($data['location'] ?? 'Online') . "
                END:VEVENT
                END:VCALENDAR";
    }
}
