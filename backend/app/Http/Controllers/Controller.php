<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="ClinicFlow API Documentation",
 *     description="Comprehensive API documentation for ClinicFlow Backend",
 *     @OA\Contact(
 *         email="admin@clinicflow.com"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Development Server"
 * )
 * 
 * @OA\Server(
 *     url="https://api.clinicflow.com/api",
 *     description="Production Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
abstract class Controller
{
    //
}
