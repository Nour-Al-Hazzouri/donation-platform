#!/bin/bash
set -e

# Function to check if database is ready
check_db_connection() {
    php artisan db:show > /dev/null 2>&1
    return $?
}

# Wait for database to be ready
echo "Checking database connection..."
until check_db_connection; do
    echo "Waiting for database to be ready..."
    sleep 5
done

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

# Clear configuration cache first (doesn't require DB)
echo "Clearing configuration cache..."
php artisan config:clear || true
php artisan view:clear || true
php artisan route:clear || true

# Run database migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force
    
    # Run database seeders if needed
    if [ "$RUN_SEEDERS" = "true" ]; then
        echo "Running database seeders..."
        php artisan db:seed --force
    fi

    # Only try to clear cache tables if they exist
    echo "Clearing caches..."
    php artisan cache:clear 2>/dev/null || echo "Cache table might not exist yet, skipping..."
fi

# Cache configuration for production
if [ "$APP_ENV" = "production" ]; then
    echo "Caching configuration..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Execute the CMD from the Dockerfile
exec "$@"
