<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{

    protected $fillable = ['name','email','slot_id','status'];

    // make the relationship with time slots
    public function  slots(){

        return $this->belongsTo(Slot::class);

    }

    // create scope to flitering
    public function scopeActive($query){

        return $query->where('status',1);

    }

}
