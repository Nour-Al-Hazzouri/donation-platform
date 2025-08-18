#!/bin/bash
set -e

# Check if maintenance mode is enabled
if [ "$MAINTENANCE_MODE" = "true" ]; then
    echo "Maintenance mode is enabled"
    touch /var/www/html/storage/framework/down
else
    echo "Application is in normal mode"
    if [ -f "/var/www/html/storage/framework/down" ]; then
        php artisan up
    fi
fi

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating new APP_KEY"
    php artisan key:generate --force
fi

# Set directory permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache

# Run database migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force
    
    # Run database seeders if needed
    if [ "$RUN_SEEDERS" = "true" ]; then
        echo "Running database seeders..."
        php artisan db:seed --force
    fi
fi

# Clear all caches
echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Cache configuration for production
if [ "$APP_ENV" = "production" ]; then
    echo "Caching configuration..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Execute the CMD from the Dockerfile
exec "$@"
