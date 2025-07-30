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
        Schema::create('donation_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('location_id')->constrained('locations');
            $table->string('title');
            $table->text('description');
            $table->decimal('goal_amount', 10, 2);
            $table->decimal('current_amount', 10, 2)->default(0);
            $table->decimal('possible_amount', 10, 2)->default(0);
            $table->enum('type', ['request', 'offer']);
            $table->enum('status', ['active', 'completed', 'cancelled', 'suspended'])->default('active');
            $table->timestamps();

            // Add index for faster lookups
            $table->index(['type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_events');
    }
};
