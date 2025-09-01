<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\DonationTransaction;
use App\Models\DonationEvent;
use App\Observers\DonationTransactionObserver;
use App\Observers\DonationEventObserver;
use App\Services\NotificationService;
use App\Services\ImageService;

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
        $this->app->singleton(ImageService::class, function () {
            return new ImageService();
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
