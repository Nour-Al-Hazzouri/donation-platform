<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\DonationTransaction;
use App\Observers\DonationTransactionObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        DonationTransaction::observe(DonationTransactionObserver::class);
    }
}
