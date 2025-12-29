<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class FileHelper
{
    /**
     * Upload avatar and return path
     */
    public static function uploadAvatar($file)
    {
        if (!$file) {
            return null;
        }

        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = 'avatars/' . $filename;

        // Resize and crop to 300x300
        $image = Image::read($file);
        $image->cover(300, 300);

        Storage::disk('public')->put($path, $image->encode());

        return $path;
    }

    /**
     * Upload clinic/service image
     */
    public static function uploadImage($file, $folder = 'images')
    {
        if (!$file) {
            return null;
        }

        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $folder . '/' . $filename;

        // Resize if too large
        $image = Image::read($file);
        if ($image->width() > 1920) {
            $image->scale(width: 1920);
        }

        Storage::disk('public')->put($path, $image->encode());

        return $path;
    }

    /**
     * Delete file by path
     */
    public static function deleteFile($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return true;
        }

        return false;
    }

    /**
     * Get full URL for file path
     */
    public static function getFileUrl($path)
    {
        if (!$path) {
            return null;
        }

        return asset('storage/' . $path);
    }

    /**
     * Check if file exists
     */
    public static function fileExists($path)
    {
        return $path && Storage::disk('public')->exists($path);
    }
}
