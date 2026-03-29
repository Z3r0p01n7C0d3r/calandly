<?php

use App\Http\Middleware\JsonResponseMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api([
            JsonResponseMiddleware::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {


        //handel if route not found
        $exceptions->render(function (NotFoundHttpException $e, $request) {

            if ($request->is('api/*')) {

                Log::info("Route not found",$e->getTrace());

                return response()->json([
                    'success' => false,
                    'message' => 'Route not found',
                ], 404);
            }

        });

        // handel validation exception
        $exceptions->render(function (ValidationException $e, $request) {
            if ($request->is('api/*')) {

                Log::warning("Validation failed",$e->errors());

                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        });

        // handel throwable error globaly
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*')) {

                if ($e instanceof ValidationException) {
                    return null;
                }

                Log::error("Something went wrong",$e->getTrace());

                return response()->json([
                    'success' => false,
                    'message' => app()->environment('production')
                        ? 'Something went wrong'
                        : $e->getMessage(),
                ], 500);
            }
        });
    })->create();
