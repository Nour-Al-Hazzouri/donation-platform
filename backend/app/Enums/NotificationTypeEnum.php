<?php

namespace App\Enums;

class NotificationTypeEnum
{
    // Donation related
    public const DONATION_GOAL_REACHED = 'donation_goal_reached';
    public const TRANSACTION_CONTRIBUTION = 'transaction_contribution';
    public const TRANSACTION_CLAIM = 'transaction_claim';
    public const TRANSACTION_APPROVED = 'transaction_approved';
    public const TRANSACTION_REJECTED = 'transaction_rejected';
    
    // Post related
    public const NEW_POST = 'new_post';
    public const POST_DELETED = 'post_deleted';
    
    // Comment related
    public const NEW_COMMENT = 'new_comment';
    
    // Vote/Reaction related
    public const POST_UPVOTED = 'post_upvoted';
    public const POST_DOWNVOTED = 'post_downvoted';
    
    // Verification related
    public const VERIFICATION_REQUEST_SENT = 'verification_request_sent';
    public const VERIFICATION_APPROVED = 'verification_approved';
    public const VERIFICATION_REJECTED = 'verification_rejected';
    
    // Event related
    public const EVENT_CREATED_SUCCESS = 'event_created_success';
    public const EVENT_CREATED_FAILED = 'event_created_failed';
    
    // Announcement related
    public const NEW_ANNOUNCEMENT = 'new_announcement';
    public const ANNOUNCEMENT_UPDATED = 'announcement_updated';
    
    // Other
    public const OTHER = 'other';

    /**
     * Get all notification types
     */
    public static function all(): array
    {
        return [
            // Donation related
            self::DONATION_GOAL_REACHED,
            self::TRANSACTION_CONTRIBUTION,
            self::TRANSACTION_CLAIM,
            self::TRANSACTION_APPROVED,
            self::TRANSACTION_REJECTED,
            
            // Post related
            self::NEW_POST,
            self::POST_DELETED,
            
            // Comment related
            self::NEW_COMMENT,
            
            // Vote/Reaction related
            self::POST_UPVOTED,
            self::POST_DOWNVOTED,
            
            // Verification related
            self::VERIFICATION_REQUEST_SENT,
            self::VERIFICATION_APPROVED,
            self::VERIFICATION_REJECTED,
            
            // Event related
            self::EVENT_CREATED_SUCCESS,
            self::EVENT_CREATED_FAILED,
            
            // Announcement related
            self::NEW_ANNOUNCEMENT,
            self::ANNOUNCEMENT_UPDATED,
            
            // Other
            self::OTHER,
        ];
    }

    /**
     * Check if a notification type exists
     */
    public static function exists(string $type): bool
    {
        return in_array($type, self::all(), true);
    }
}
