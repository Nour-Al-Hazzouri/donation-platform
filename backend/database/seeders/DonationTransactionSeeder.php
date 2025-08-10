<?php

namespace Database\Seeders;

use App\Models\DonationEvent;
use App\Models\DonationTransaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DonationTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have some users and events
        $users = User::all();
        $events = DonationEvent::all();
        
        if ($users->isEmpty() || $events->isEmpty()) {
            $this->command->warn('No users or donation events found. Please run UserSeeder and DonationEventSeeder first.');
            return;
        }
        
        // Create some contribution transactions
        DonationTransaction::factory()
            ->count(20)
            ->create([
                'transaction_type' => 'contribution',
                'status' => 'approved',
            ]);
        
        // Create some claim transactions (only for offer events with available amount)
        $offerEvents = DonationEvent::where('type', 'offer')
            ->where('current_amount', '>', 0)
            ->get();
            
        foreach ($offerEvents as $event) {
            $maxClaims = min(5, (int)($event->current_amount / 10)); // Don't create too many claims
            
            DonationTransaction::factory()
                ->count(rand(1, $maxClaims))
                ->create([
                    'event_id' => $event->id,
                    'transaction_type' => 'claim',
                    'amount' => fn() => rand(1, min(100, $event->current_amount)),
                    'status' => 'approved',
                ]);
        }
        
        // Create some pending transactions
        DonationTransaction::factory()
            ->count(10)
            ->status('pending')
            ->create();
            
        // Create some declined transactions
        DonationTransaction::factory()
            ->count(5)
            ->status('declined')
            ->create();
            
        // Update event amounts based on approved transactions
        $this->updateEventAmounts();
    }
    
    /**
     * Update event amounts based on approved transactions.
     */
    protected function updateEventAmounts(): void
    {
        // Update current_amount for all events with transactions
        $events = DonationEvent::has('transactions')->get();
        
        foreach ($events as $event) {
            $contributions = $event->transactions()
                ->where('transaction_type', 'contribution')
                ->where('status', 'approved')
                ->sum('amount');
                
            $claims = $event->transactions()
                ->where('transaction_type', 'claim')
                ->where('status', 'approved')
                ->sum('amount');
            
            $event->current_amount = $contributions - $claims;
            $event->save();
        }
    }
}
