<?php

namespace App\Services;

use App\Enums\NotificationTypeEnum;
use App\Models\Notification;
use App\Models\NotificationType;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NotificationService
{
    // Use the NotificationTypeEnum for type safety and maintainability
    // The actual types are now managed in App\Enums\NotificationTypeEnum

    /**
     * Get notification type ID by name
     */
    protected function getTypeId(string $typeName): int
    {
        return cache()->rememberForever("notification_type_{$typeName}", function () use ($typeName) {
            return NotificationType::where('name', $typeName)
                ->value('id') ?? throw new \RuntimeException("Notification type {$typeName} not found");
        });
    }

    /**
     * Compile notification message from template
     */
    protected function compileMessage(string $template, array $data): string
    {
        return Str::of($template)->replaceMatches('/\{([^}]+)\}/', function ($match) use ($data) {
            $key = $match[1];
            return $data[$key] ?? $match[0];
        })->toString();
    }

    /**
     * Get unread notifications count for a user
     */
    public function getUnreadCount(User $user): int
    {
        return $user->unreadNotifications()->count();
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(User $user): int
    {
        $count = $user->unreadNotifications()->count();
        $user->unreadNotifications()->update(['read_at' => now()]);
        return $count;
    }

    /**
     * Create a notification with a specific type ID
     */
    public function createNotification(
        User $user,
        int $typeId,
        string $title,
        ?string $message = null,
        ?array $data = null
    ): ?Notification {
        try {
            return DB::transaction(function () use ($user, $typeId, $title, $message, $data) {
                $notificationType = NotificationType::findOrFail($typeId);

                // If no message is provided, use the template
                $finalMessage = $message ?? $this->compileMessage(
                    $notificationType->template,
                    $data ?? []
                );

                $notification = $user->notifications()->create([
                    'type_id' => $typeId,
                    'title' => $title,
                    'message' => $finalMessage,
                    'data' => $data,
                ]);

                // Dispatch event for real-time notification if needed
                // event(new NotificationCreated($notification));

                return $notification->load('type');
            });
        } catch (\Exception $e) {
            Log::error('Failed to create notification', [
                'user_id' => $user->id,
                'type_id' => $typeId,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Create a notification using type name instead of ID
     */
    public function createNotificationByType(
        string $typeName,
        User $user,
        string $title,
        ?string $message = null,
        ?array $data = null
    ): ?Notification {
        return $this->createNotification(
            user: $user,
            typeId: $this->getTypeId($typeName),
            title: $title,
            message: $message,
            data: $data
        );
    }

    /**
     * Helper method for donation goal reached notification
     */
    public function sendDonationGoalReached(User $user, string $eventTitle, ?array $data = null): ?Notification
    {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::DONATION_GOAL_REACHED,
            user: $user,
            title: 'Donation Goal Reached!',
            data: array_merge($data ?? [], [
                'event_title' => $eventTitle
            ])
        );
    }

    /**
     * Helper method for transaction contribution notification
     */
    public function sendTransactionContribution(
        User $user,
        string $userName,
        float $amount,
        string $eventTitle,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::TRANSACTION_CONTRIBUTION,
            user: $user,
            title: 'New Contribution',
            data: array_merge($data ?? [], [
                'user_name' => $userName,
                'amount' => number_format($amount, 2),
                'event_title' => $eventTitle
            ])
        );
    }

    /**
     * Helper method for transaction claim notification
     */
    public function sendTransactionClaim(
        User $user,
        string $userName,
        float $amount,
        string $eventTitle,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::TRANSACTION_CLAIM,
            user: $user,
            title: 'Funds Claimed',
            data: array_merge($data ?? [], [
                'user_name' => $userName,
                'amount' => number_format($amount, 2),
                'event_title' => $eventTitle
            ])
        );
    }

    /**
     * Helper method for transaction status notification
     */
    public function sendTransactionStatus(
        User $user,
        string $eventTitle,
        bool $isApproved,
        ?string $reason = null,
        ?array $data = null
    ): ?Notification {
        $typeName = $isApproved ?
            NotificationTypeEnum::TRANSACTION_APPROVED :
            NotificationTypeEnum::TRANSACTION_REJECTED;

        $title = $isApproved ? 'Transaction Approved' : 'Transaction Rejected';

        $notificationData = array_merge($data ?? [], [
            'event_title' => $eventTitle
        ]);

        if (!$isApproved && $reason) {
            $notificationData['reason'] = $reason;
        }

        return $this->createNotificationByType(
            typeName: $typeName,
            user: $user,
            title: $title,
            data: $notificationData
        );
    }

    /**
     * Helper method for new post notification
     */
    public function sendNewPost(
        User $user,
        string $userName,
        string $eventTitle,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::NEW_POST,
            user: $user,
            title: 'New Community Post',
            data: array_merge($data ?? [], [
                'user_name' => $userName,
                'event_title' => $eventTitle
            ])
        );
    }

    /**
     * Helper method for post deleted notification
     */
    public function sendPostDeleted(
        User $user,
        string $eventTitle,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::POST_DELETED,
            user: $user,
            title: 'Post Deleted',
            data: array_merge($data ?? [], [
                'event_title' => $eventTitle
            ])
        );
    }

    /**
     * Helper method for new comment notification
     */
    public function sendNewComment(
        User $user,
        string $userName,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::NEW_COMMENT,
            user: $user,
            title: 'New Comment',
            data: array_merge($data ?? [], [
                'user_name' => $userName
            ])
        );
    }

    /**
     * Helper method for post upvoted notification
     */
    public function sendPostUpvoted(
        User $user,
        string $userName,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::POST_UPVOTED,
            user: $user,
            title: 'New Upvote',
            data: array_merge($data ?? [], [
                'user_name' => $userName
            ])
        );
    }

    /**
     * Helper method for post downvoted notification
     */
    public function sendPostDownvoted(
        User $user,
        string $userName,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::POST_DOWNVOTED,
            user: $user,
            title: 'New Downvote',
            data: array_merge($data ?? [], [
                'user_name' => $userName
            ])
        );
    }

    /**
     * Helper method for verification request sent notification
     */
    public function sendVerificationRequestSent(
        User $user,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::VERIFICATION_REQUEST_SENT,
            user: $user,
            title: 'Verification Request Sent',
            data: $data
        );
    }

    /**
     * Helper method for verification status notification
     */
    public function sendVerificationStatus(
        User $user,
        bool $isApproved,
        ?string $reason = null,
        ?array $data = null
    ): ?Notification {
        $typeName = $isApproved ?
            NotificationTypeEnum::VERIFICATION_APPROVED :
            NotificationTypeEnum::VERIFICATION_REJECTED;

        $title = $isApproved ? 'Verification Approved' : 'Verification Rejected';

        $notificationData = $data ?? [];
        if (!$isApproved && $reason) {
            $notificationData['reason'] = $reason;
        }

        return $this->createNotificationByType(
            typeName: $typeName,
            user: $user,
            title: $title,
            data: $notificationData
        );
    }

    /**
     * Create a custom notification with a message that doesn't fit other types
     */
    public function sendCustomNotification(
        User $user,
        string $title,
        string $message,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::OTHER,
            user: $user,
            title: $title,
            message: $message,
            data: $data
        );
    }

    public function broadcastCustomNotification(
        ?Collection $users,
        string $title,
        string $message,
        ?array $data = null
    ) {
        if (!$users) {
            $users = User::all();
        }
        foreach ($users as $user) {
            $this->sendCustomNotification($user, $title, $message, $data);
        }
    }

    /**
     * Helper method for event created status notification
     */
    public function sendEventCreatedStatus(
        User $user,
        string $eventTitle,
        bool $isSuccess,
        ?string $reason = null,
        ?array $data = null
    ): ?Notification {
        $typeName = $isSuccess ?
        NotificationTypeEnum::EVENT_CREATED_SUCCESS :
        NotificationTypeEnum::EVENT_CREATED_FAILED;

        $title = $isSuccess ? 'Event Created Successfully' : 'Event Creation Failed';

        $notificationData = array_merge($data ?? [], [
            'event_title' => $eventTitle
        ]);

        if (!$isSuccess && $reason) {
            $notificationData['reason'] = $reason;
        }

        return $this->createNotificationByType(
            typeName: $typeName,
            user: $user,
            title: $title,
            data: $notificationData
        );
    }

    /**
     * Helper method for new announcement notification
     */
    public function sendNewAnnouncement(
        User $user,
        string $announcementTitle,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::NEW_ANNOUNCEMENT,
            user: $user,
            title: 'New Announcement',
            data: array_merge($data ?? [], [
                'announcement_title' => $announcementTitle
            ])
        );
    }

    public function broadcastNewAnnouncement(
        string $announcementTitle,
        ?array $data = null
    ) {
        $users = User::all();

        foreach ($users as $user) {
            $this->sendNewAnnouncement($user, $announcementTitle, $data);
        }
    }

    /**
     * Helper method for announcement updated notification
     */
    public function sendAnnouncementUpdated(
        User $user,
        string $announcementTitle,
        ?array $data = null
    ): ?Notification {
        return $this->createNotificationByType(
            typeName: NotificationTypeEnum::ANNOUNCEMENT_UPDATED,
            user: $user,
            title: 'Announcement Updated',
            data: array_merge($data ?? [], [
                'announcement_title' => $announcementTitle
            ])
        );
    }

    /**
     * Get paginated notifications for a user with optional filters
     */
    public function getUserNotifications(
        User $user,
        ?string $type = null,
        bool $unreadOnly = false,
        int $perPage = 15
    ) {
        $query = $user->notifications()
            ->with(['type', 'user', 'relatedUser'])
            ->latest();

        if ($type) {
            $query->whereHas('type', function ($q) use ($type) {
                $q->where('name', $type);
            });
        }

        if ($unreadOnly) {
            $query->whereNull('read_at');
        }

        return $query;
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(Notification $notification): Notification
    {
        if ($notification->read_at === null) {
            $notification->update(['read_at' => now()]);
            $notification->refresh();
        }

        return $notification;
    }

    /**
     * Delete a specific notification
     */
    public function deleteNotification(Notification $notification): bool
    {
        return (bool) $notification->delete();
    }

    /**
     * Delete all notifications for a user
     */
    public function deleteAllNotifications(User $user): int
    {
        $count = $user->notifications()->count();
        $user->notifications()->delete();
        return $count;
    }

    /**
     * Delete all unread notifications for a user
     */
    public function deleteUnreadNotifications(User $user): int
    {
        $count = $user->unreadNotifications()->count();
        $user->unreadNotifications()->delete();
        return $count;
    }

    /**
     * Delete all read notifications for a user
     */
    public function deleteReadNotifications(User $user): int
    {
        $count = $user->readNotifications()->count();
        $user->readNotifications()->delete();
        return $count;
    }

    /**
     * Get all notification types
     */
    public function getAllNotificationTypes()
    {
        return NotificationType::all();
    }
}
