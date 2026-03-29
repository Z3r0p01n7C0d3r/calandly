<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    protected $fillable = ['name','location','duration','from_date','to_date','from_time','to_time','status'];

    // cast the model value to carbon instnce
    protected $casts = ['from_date' =>'date','to_date'=>'date','from_time'=>'datetime:H:i','to_time'=>'datetime:H:i'];

    // make the relationship with time slots
    public function slots(){

        return $this->hasMany(Slot::class,'event_id','id');

    }

    // create scope to flitering
    public function scopeActive($query){

        return $query->where('status',1);

    }

}
