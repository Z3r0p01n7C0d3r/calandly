<?php

namespace App\Http\Controllers;

use App\Models\Slot;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;

class SlotController extends Controller
{
    function getAvailableSolt()
    {

        try {

            //get active and avaiable time slots
            $availableSolts = Slot::active()->available()->get();


            //return collection or array then convert this  response with middelware
            return $availableSolts;
        } catch (\Throwable $th) {


            throw $th;
        }
    }
    function getBookedSolt()
    {

        try {

            //get active and booked time slots
            $bookedSolts = Slot::active()->booked()->get();

            //return collection or array then convert this  response with middelware
            return $bookedSolts;
        } catch (\Throwable $th) {

            throw $th;
        }
    }

    public static function createTimeSlots($eventData)
    {
        try {


            // generate the time slot with multiple date and time
            $insertTimePeriod = self::TimeSlotgenerate($eventData->from_date,$eventData->to_date,$eventData->duration,$eventData->from_time,$eventData->to_time,$eventData->id);

            $insert = Slot::insert($insertTimePeriod);

            return $insert;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public static function TimeSlotgenerate($startDate, $endDate, $duration, $startTime, $endTime,$event_id)
    {
        $result = [];

        $datePeriod = CarbonPeriod::create($startDate, $endDate);

        foreach ($datePeriod as $date) {

            $dayStart = Carbon::parse($date->format('Y-m-d') . ' ' . $startTime->format('H:i'));
            $dayEnd   = Carbon::parse($date->format('Y-m-d') . ' ' . $endTime->format('H:i'));

            $timePeriod = CarbonPeriod::create($dayStart, "{$duration} minutes", $dayEnd);

            foreach ($timePeriod as $time) {
                $slotEnd = $time->copy()->addMinutes((int)$duration);

                if ($slotEnd->gt($dayEnd)) {
                    break;
                }

                $result[] = [
                    "event_id"=>$event_id,
                    "date"=>$date->format('Y-m-d'),
                    "start_time"=>$time->format('h:i A'),
                    "end_time"=>$slotEnd->format('h:i A'),
                    "created_at"=>now(),
                    "updated_at"=>now(),
                ];
            }
        }

        return $result;
    }
}
