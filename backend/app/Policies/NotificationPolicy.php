<?php

namespace App\Policies;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NotificationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the notification.
     */
    public function view(User $user, Notification $notification): bool
    {
        // Users can only view their own notifications
        return $user->id === $notification->user_id;
    }

    /**
     * Determine whether the user can update the notification.
     */
    public function update(User $user, Notification $notification): bool
    {
        // Users can only update (mark as read) their own notifications
        return $user->id === $notification->user_id;
    }

    /**
     * Determine whether the user can delete the notification.
     */
    public function delete(User $user, Notification $notification): bool
    {
        // Users can only delete their own notifications
        return $user->id === $notification->user_id;
    }

    /**
     * Determine whether the user can mark all notifications as read.
     */
    public function markAllAsRead(User $user): bool
    {
        // Any authenticated user can mark their own notifications as read
        return true;
    }

    /**
     * Determine whether the user can delete all notifications.
     */
    public function deleteAll(User $user): bool
    {
        // Any authenticated user can delete their own notifications
        return true;
    }

    /**
     * Determine whether the user can delete all unread notifications.
     */
    public function deleteUnread(User $user): bool
    {
        // Any authenticated user can delete their own unread notifications
        return true;
    }
}
