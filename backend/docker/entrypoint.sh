#!/bin/bash
set -e

# Function to check if database is ready with detailed error output
check_db_connection() {
    echo "Attempting to connect to database..."
    echo "DB_HOST: $DB_HOST"
    echo "DB_PORT: $DB_PORT"
    echo "DB_DATABASE: $DB_DATABASE"
    echo "DB_USERNAME: $DB_USERNAME"

    # First try to connect using DB_URL if it exists
    if [ -n "$DB_URL" ]; then
        echo "Testing connection using DB_URL..."
        if ! mysql "$DB_URL" -e "SELECT 1" 2>/tmp/mysql_error; then
            echo "DB_URL connection failed with error:"
            cat /tmp/mysql_error
            echo "Falling back to individual connection parameters..."
            
            # Fall back to individual parameters if DB_URL fails
            if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ] && [ -n "$DB_USERNAME" ] && [ -n "$DB_PASSWORD" ] && [ -n "$DB_DATABASE" ]; then
                echo "Testing connection with individual parameters..."
                if ! mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -e "SELECT 1" 2>/tmp/mysql_error; then
                    echo "Individual parameter connection also failed with error:"
                    cat /tmp/mysql_error
                    return 1
                fi
            else
                echo "Missing required database connection parameters"
                return 1
            fi
        fi
    else
        # If no DB_URL, use individual parameters
        if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ] && [ -n "$DB_USERNAME" ] && [ -n "$DB_PASSWORD" ] && [ -n "$DB_DATABASE" ]; then
            echo "Testing connection with individual parameters..."
            if ! mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -e "SELECT 1" 2>/tmp/mysql_error; then
                echo "Database connection failed with error:"
                cat /tmp/mysql_error
                return 1
            fi
        else
            echo "No valid database connection parameters found"
            return 1
        fi
    fi

    # Then try Laravel's database check
    echo "Testing connection using Laravel..."
    if ! php artisan db:show --no-ansi >> /tmp/laravel_db_check.log 2>&1; then
        echo "Laravel database check failed with error:"
        cat /tmp/laravel_db_check.log
        return 1
    fi

    echo "Database connection successful!"
    return 0
}

# Wait for database to be ready with timeout
echo "Checking database connection..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if check_db_connection; then
        echo "Database is ready!"
        break
    fi

    echo "Attempt $attempt of $max_attempts - Waiting for database to be ready..."
    sleep 5
    attempt=$((attempt + 1))

    if [ $attempt -gt $max_attempts ]; then
        echo "Error: Could not connect to database after $max_attempts attempts. Exiting."
        exit 1
    fi
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
