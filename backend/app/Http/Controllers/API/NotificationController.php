<?php

namespace App\Http\Controllers\API;

use App\Enums\NotificationTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class NotificationController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * @var NotificationService
     */
    protected $notificationService;

    /**
     * @param NotificationService $notificationService
     */
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the notifications for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'per_page' => 'sometimes|integer|min:1|max:100',
            'type' => ['sometimes', 'string', Rule::in(NotificationTypeEnum::all())],
            'unread_only' => 'sometimes|boolean',
        ]);

        $notification_query = $this->notificationService->getUserNotifications(
            user: Auth::user(),
            type: $validated['type'] ?? null,
            unreadOnly: $validated['unread_only'] ?? false,
            perPage: $validated['per_page'] ?? 15
        );

        return NotificationResource::collection($notification_query->paginate($validated['per_page'] ?? 15));
    }

    /**
     * Mark a notification as read.
     *
     * @param  Notification  $notification
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $this->authorize('update', $notification);

        if ($notification->read_at === null) {
            $notification = $this->notificationService->markAsRead($notification);
            return response()->json([
                'message' => 'Notification marked as read',
                'data' => new NotificationResource($notification->load('type')),
            ]);
        }

        return response()->json([
            'message' => 'Notification was already marked as read',
            'data' => new NotificationResource($notification->load('type')),
        ]);
    }

    /**
     * Mark all notifications as read for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAllAsRead(): JsonResponse
    {
        $count = $this->notificationService->markAllAsRead(Auth::user());

        return response()->json([
            'message' => "{$count} notifications marked as read",
        ]);
    }

    /**
     * Get the count of unread notifications for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function unreadCount(): JsonResponse
    {
        $count = Auth::user()->unreadNotifications()->count();

        return response()->json([
            'unread_count' => $count,
        ]);
    }

    /**
     * Remove the specified notification.
     *
     * @param  Notification  $notification
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Notification $notification): JsonResponse
    {
        $this->authorize('delete', $notification);

        try {
            $this->notificationService->deleteNotification($notification);
            return response()->json([
                'message' => 'Notification deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting notification: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete notification',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove all notifications for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyAll(): JsonResponse
    {
        try {
            $count = $this->notificationService->deleteAllNotifications(Auth::user());
            return response()->json([
                'message' => "{$count} notifications deleted successfully",
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting notifications: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete notifications',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove all unread notifications for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyUnread(): JsonResponse
    {
        try {
            $count = $this->notificationService->deleteUnreadNotifications(Auth::user());
            return response()->json([
                'message' => "{$count} unread notifications deleted successfully",
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting unread notifications: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete unread notifications',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove all read notifications for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyRead(): JsonResponse
    {
        try {
            $count = $this->notificationService->deleteReadNotifications(Auth::user());
            return response()->json([
                'message' => "{$count} read notifications deleted successfully",
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting read notifications: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete read notifications',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all available notification types.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function types(): JsonResponse
    {
        $types = $this->notificationService->getAllNotificationTypes();
        
        return response()->json([
            'data' => $types,
            'message' => 'Notification types retrieved successfully',
        ]);
    }
}
