# GiveLeb - Donation Platform Backend

<p align="center">
  <img src="https://via.placeholder.com/400x200?text=GiveLeb+Logo" alt="GiveLeb Logo" width="400">
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel" alt="Laravel 12"></a>
  <a href="#"><img src="https://img.shields.io/badge/PHP-8.3-777BB4?style=flat&logo=php" alt="PHP 8.3+"></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status"></a>
</p>

## 📝 Overview

GiveLeb is a comprehensive donation and community support platform built with Laravel 12, designed to connect donors, volunteers, and organizations. This repository contains the backend API that powers the GiveLeb platform, providing a robust foundation for managing donations, community engagement, and user interactions.

### 🌟 Key Features

- **User Authentication & Authorization** with Laravel Sanctum
- **Role-Based Access Control** using Spatie Laravel-Permission
- **Donation Management** for both monetary and in-kind contributions
- **Community Engagement** with posts, comments, and reactions
- **Real-time Notifications** for platform activities
- **Comprehensive API** with detailed documentation
- **Image Processing** with Intervention Image
- **Automated Testing** with PHPUnit

## 🚀 Tech Stack

- **Framework**: Laravel 12
- **PHP**: 8.3+
- **Database**: MySQL/SQLite (development)
- **Authentication**: Laravel Sanctum
- **Authorization**: Spatie Laravel-Permission
- **Image Processing**: Intervention Image
- **API Documentation**: OpenAPI (Swagger)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- PHP 8.3 or higher
- Composer 2.0 or higher
- Node.js & NPM (for frontend assets if needed)
- MySQL 8.0+ or SQLite
- Git

## 🏗️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/donation-platform.git
   cd donation-platform/backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install NPM dependencies** (if needed, no need if u want just the backend API)
   ```bash
   npm install
   ```

4. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

5. **Generate application key**
   ```bash
   php artisan key:generate
   ```

6. **Configure database**
   - For SQLite (development):
     ```bash
     touch database/database.sqlite
     ```
     Then update `.env` with:
     ```
     DB_CONNECTION=sqlite
     DB_DATABASE=/absolute/path/to/your/database.sqlite
     ```
   - For MySQL:
     Update `.env` with your database credentials:
     ```
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=giveleb
     DB_USERNAME=root
     DB_PASSWORD=
     ```

7. **Run database migrations and seeders**
   ```bash
   php artisan migrate --seed
   ```

8. **Generate Passport keys** (for API authentication)
   ```bash
   php artisan passport:keys
   ```

9. **Link storage**
   ```bash
   php artisan storage:link
   ```

## 🚀 Running the Application

### Development

Start the development server:
```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

### Queue Workers

For processing jobs in the background (emails, notifications, etc.):
```bash
php artisan queue:work
```

### Running Tests

```bash
php artisan test
```

## 🔐 Authentication

The API uses Laravel Sanctum for authentication. Include the following in your requests:

```
Authorization: Bearer {your_auth_token}
Accept: application/json
```

## 📚 API Documentation

Detailed API documentation is available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## 📦 Dependencies

- [Laravel 12](https://laravel.com/docs/12.x)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Spatie Laravel-Permission](https://spatie.be/docs/laravel-permission/v5/introduction)
- [Intervention Image](https://image.intervention.io/v2)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - The PHP Framework For Web Artisans
- [Spatie](https://spatie.be/) - For their amazing Laravel packages
- All contributors who have helped shape this project

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
