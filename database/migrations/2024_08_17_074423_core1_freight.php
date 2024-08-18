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
        Schema::create('freights', function (Blueprint $table) {
            $table->id();

            $table->string('from');
            // private person or business
            $table->string('type');
            // land, air, sea
            $table->string('mode');

            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->boolean('is_residential_address')->default(false);

            $table->timestamps();
        });

        Schema::create('freight_items', function (Blueprint $table) {
            $table->id();

            /*
             * Measurement are in double kg & cm
             */
            $table->double('item_weight');
            $table->double('item_length');
            $table->double('item_width');
            $table->double('item_height');
            $table->integer('item_quantity');

            /*
             * Values can be Pallet1-3 or Moving Box
             */
            $table->string('size');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freights');
        Schema::dropIfExists('freight_items');
    }
};
