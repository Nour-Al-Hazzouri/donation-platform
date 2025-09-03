# Use PHP 8.3 with Apache as base image
FROM php:8.3-apache

# Set environment variables
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV APP_KEY=
ENV APP_URL=http://localhost
ENV LOG_CHANNEL=stderr

# Set working directory
WORKDIR /var/www/html

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libonig-dev \
    default-mysql-client \
    git \
    zip \
    unzip \
    curl \
    supervisor \
    nginx \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        zip \
        exif \
        pcntl \
        gd \
        mbstring \
        bcmath \
        opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure PHP for production
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.revalidate_freq=60'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.validate_timestamps=1'; \
    echo 'opcache.save_comments=1'; \
    echo 'opcache.fast_shutdown=1'; \
} > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Configure error logging
RUN { \
    echo 'error_log = /dev/stderr'; \
    echo 'log_errors = On'; \
    echo 'error_reporting = E_ALL'; \
    echo 'display_errors = Off'; \
    echo 'display_startup_errors = Off'; \
} > /usr/local/etc/php/conf.d/error-logging.ini

# Enable Apache modules
RUN a2enmod rewrite headers expires

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application files in stages for better layer caching
COPY --chown=www-data:www-data . .

# Install PHP dependencies
RUN composer install --no-dev --no-scripts --optimize-autoloader --no-interaction \
    && composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create necessary directories
RUN mkdir -p /var/log/supervisor \
    && mkdir -p /var/log/nginx \
    && touch /var/log/nginx/access.log \
    && touch /var/log/nginx/error.log \
    && chown -R www-data:www-data /var/log/nginx \
    && chmod -R 775 /var/log/nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/up || exit 1

# Expose port 80 for web traffic
EXPOSE 80

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Default command
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
# CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
