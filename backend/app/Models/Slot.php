<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slot extends Model
{
    protected $fillable = ['date','start_time','end_time','event_id','is_booked','status'];

    // cast the model value to carbon instnce
    protected $casts = ['start_time' =>'datetime:h:i A','end_time'=>'datetime:h:i A'];

    // make the relationship with event model
    public function event(){

        return $this->belongsTo(Events::class);

    }

    // make the relationship with booking model
    public function booking() {

        return $this->hasOne(Booking::class);

    }

    // create scope to flitering
    public function scopeActive($query){

        return $query->where('status',1);

    }
    // create scope to flitering
    public function scopeBooked($query){

        return $query->where('is_booked',1);

    }
    // create scope to flitering
    public function scopeAvailable($query){

        return $query->where('is_booked',0);

    }



}
