<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('slots', function (Blueprint $table) {
            $table->id();

            $table->date('date');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->foreignId('event_id')->constrained();
            $table->tinyInteger('is_booked')->default(0)->comment("0 - available, 1- booked");
            $table->tinyInteger('status')->default(1)->comment("0 - inactive, 1- active");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slots');
    }
};
