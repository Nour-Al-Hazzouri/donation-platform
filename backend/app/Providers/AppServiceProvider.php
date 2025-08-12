<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\DonationTransaction;
use App\Models\DonationEvent;
use App\Observers\DonationTransactionObserver;
use App\Observers\DonationEventObserver;
use App\Services\NotificationService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(NotificationService::class, function () {
            return new NotificationService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        DonationTransaction::observe(DonationTransactionObserver::class);
        DonationEvent::observe(DonationEventObserver::class);
    }
}
