<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Interfaces\ImageInterface;

class ImageService
{
    /**
     * Default image quality
     */
    protected const DEFAULT_QUALITY = 80;

    /**
     * Default maximum width for resizing
     */
    protected const DEFAULT_MAX_WIDTH = 1920;

    /**
     * @var ImageManager
     */
    protected $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Upload and process an image
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param bool $isPublic
     * @param int|null $maxWidth
     * @param int|null $quality
     * @return string Path to the stored image
     */
    public function uploadImage(
        UploadedFile $file,
        string $directory = 'images',
        bool $isPublic = true,
        ?int $maxWidth = null,
        ?int $quality = null
    ): string {
        $this->validateImage($file);

        $disk = $isPublic ? 'public' : 'private';
        // remove after development and the private storage is working
        $disk = 'public';
        $extension = $this->getSafeExtension($file);
        $filename = $this->generateFilename($extension);

        // Normalize directory separators
        $directory = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $directory);
        $path = $directory . DIRECTORY_SEPARATOR . $filename;

        $image = $this->processImage($file, $maxWidth, $quality);

        // Ensure the directory exists
        Storage::disk($disk)->makeDirectory(dirname($path));
        Storage::disk($disk)->put($path, $image);

        // Always return forward slashes for storage consistency
        $url = str_replace('\\', '/', $path);
        \Log::info('Image uploaded to: ' . $url);
        return $url;
    }

    /**
     * Process an image (resize and optimize)
     *
     * @param UploadedFile $file
     * @param int|null $maxWidth
     * @param int|null $quality
     * @return string Processed image content
     */
    protected function processImage(
        UploadedFile $file,
        ?int $maxWidth = null,
        ?int $quality = null
    ): string {
        $image = $this->imageManager->read($file->getRealPath());
        $maxWidth ??= self::DEFAULT_MAX_WIDTH;
        $quality ??= self::DEFAULT_QUALITY;

        // Resize if needed while maintaining aspect ratio
        if ($image->width() > $maxWidth) {
            $image->scale(width: $maxWidth);
        }

        // Get original format and encode accordingly
        $originalExtension = strtolower($file->getClientOriginalExtension());

        switch ($originalExtension) {
            case 'png':
                return (string) $image->toPng();
            case 'gif':
                return (string) $image->toGif();
            case 'webp':
                return (string) $image->toWebp($quality);
            default:
                // Default to JPEG for jpg, jpeg, and unknown formats
                return (string) $image->toJpeg($quality);
        }
    }

    /**
     * Generate a safe filename with extension
     *
     * @param string $extension
     * @return string
     */
    protected function generateFilename(string $extension): string
    {
        return uniqid() . '-' . Str::random(10) . '.' . $extension;
    }

    /**
     * Get a safe file extension
     *
     * @param UploadedFile $file
     * @return string
     */
    protected function getSafeExtension(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        // Only allow image extensions
        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            $extension = 'jpg';
        }

        return $extension;
    }

    /**
     * Validate the uploaded file is an image
     *
     * @param UploadedFile $file
     * @throws \InvalidArgumentException
     */
    protected function validateImage(UploadedFile $file): void
    {
        if (!$file->isValid()) {
            throw new \InvalidArgumentException('Invalid file upload');
        }

        $mimeType = $file->getMimeType();

        if (!str_starts_with($mimeType, 'image/')) {
            throw new \InvalidArgumentException('Uploaded file is not an image');
        }
    }

    /**
     * Delete an image
     *
     * @param string $path
     * @param bool $isPublic
     * @return bool
     */
    public function deleteImage(string $path, bool $isPublic = true): bool
    {
        $disk = $isPublic ? 'public' : 'private';
        // remove after development and the private storage is working
        $disk = 'public';

        \Log::info('Deleting image: ' . $path);
        if (Storage::disk($disk)->exists($path)) {
            \Log::info('Image exists, deleting...');
            return Storage::disk($disk)->delete($path);
        }

        \Log::info('Image does not exist at: ' . Storage::disk($disk)->path($path));
        return false;
    }

    /**
     * Get the full URL for an image
     *
     * @param string|null $path
     * @param bool $isPublic
     * @return string|null
     */
    public function getImageUrl(?string $path, bool $isPublic = true): ?string
    {
        if (empty($path)) {
            return null;
        }

        $disk = $isPublic ? 'public' : 'private';
        // remove after development and the private storage is working
        $disk = 'public';
        $storage = Storage::disk($disk);

        // Normalize path for the current OS
        $normalizedPath = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $path);

        if (!$storage->exists($normalizedPath)) {
            \Log::warning('Image not found at path: ' . $normalizedPath);
            return null;
        }

        // Always return the full URL for web display
        // Remove 'public/' prefix if it exists
        $relativePath = ltrim(str_replace('public' . DIRECTORY_SEPARATOR, '', $normalizedPath), DIRECTORY_SEPARATOR);
        // Convert to forward slashes for URLs
        $urlPath = str_replace('\\', '/', $relativePath);

        $fullUrl = asset('storage/' . $urlPath);

        // For cloud storage, use the configured URL when needed
        // return $storage->url($normalizedPath);
        // $fullUrl = $storage->url($urlPath);
        \Log::info('Generated image URL (production): ' . $fullUrl . ' for path: ' . $urlPath);
        return $fullUrl;
    }
}
