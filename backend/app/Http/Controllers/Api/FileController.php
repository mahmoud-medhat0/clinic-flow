<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class FileController extends Controller
{
    /**
     * @OA\Post(
     *     path="/files/upload",
     *     tags={"Files"},
     *     summary="Upload file",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"file","type"},
     *                 @OA\Property(property="file", type="string", format="binary"),
     *                 @OA\Property(property="type", type="string", enum={"image","document","avatar"})
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="File uploaded")
     * )
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // 10MB max
            'type' => 'required|in:image,document,avatar',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $file = $request->file('file');
        $type = $request->type;

        // Validate based on type
        if ($type === 'image' || $type === 'avatar') {
            $fileValidator = Validator::make($request->all(), [
                'file' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB for images
            ]);

            if ($fileValidator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $fileValidator->errors()
                ], 422);
            }

            $path = $this->uploadImage($file, $type);
        } else {
            $fileValidator = Validator::make($request->all(), [
                'file' => 'mimes:pdf,doc,docx,txt|max:10240',
            ]);

            if ($fileValidator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $fileValidator->errors()
                ], 422);
            }

            $path = $this->uploadDocument($file);
        }

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully',
            'data' => [
                'path' => $path,
                'url' => Storage::url($path),
                'full_url' => asset('storage/' . $path)
            ]
        ]);
    }

    /**
     * Upload and process image
     */
    private function uploadImage($file, $type = 'image')
    {
        $folder = $type === 'avatar' ? 'avatars' : 'images';
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $folder . '/' . $filename;

        // Resize image if it's too large
        $image = Image::read($file);
        
        if ($type === 'avatar') {
            // Resize and crop avatar to 300x300
            $image->cover(300, 300);
        } else {
            // Resize image if width > 1920
            if ($image->width() > 1920) {
                $image->scale(width: 1920);
            }
        }

        // Save to storage
        Storage::disk('public')->put($path, $image->encode());

        return $path;
    }

    /**
     * Upload document
     */
    private function uploadDocument($file)
    {
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = 'documents/' . $filename;

        Storage::disk('public')->put($path, file_get_contents($file));

        return $path;
    }

    /**
     * @OA\Post(
     *     path="/files/delete",
     *     tags={"Files"},
     *     summary="Delete file",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"path"},
     *             @OA\Property(property="path", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="File deleted")
     * )
     */
    public function delete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $path = $request->path;

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);

            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'File not found'
        ], 404);
    }

    /**
     * @OA\Post(
     *     path="/files/url",
     *     tags={"Files"},
     *     summary="Get file URL",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"path"},
     *             @OA\Property(property="path", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="File URL")
     * )
     */
    public function getUrl(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $path = $request->path;

        if (Storage::disk('public')->exists($path)) {
            return response()->json([
                'success' => true,
                'data' => [
                    'path' => $path,
                    'url' => Storage::url($path),
                    'full_url' => asset('storage/' . $path)
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'File not found'
        ], 404);
    }
}
