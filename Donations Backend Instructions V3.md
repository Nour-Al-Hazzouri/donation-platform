# Lebanon Donation Platform API (Laravel 12)

## Overview

This document defines the complete backend implementation plan for the **Lebanon Donation Platform API**, using **Laravel 12**, **PHP 8.3+**, and **MySQL**. It ensures:

- Full alignment with frontend TypeScript contracts.
- Clean, modular architecture.
- Feature-complete implementation with robust testing.
- Full compatibility with the updated ERD and schema.

---

## ✅ Tech Stack & Packages

- **Laravel** 12
- **PHP** 8.3+
- **Database**: MySQL
- **Auth**: Laravel Sanctum
- **Permissions**: Spatie Laravel Permission
- **Search**: Laravel Scout + MeiliSearch
- **File Upload**: Laravel Filesystem + Intervention Image
- **Activity Logging**: Spatie Laravel Activity Log
- **Real-Time**: Laravel Echo + Pusher
- **Notifications**: Laravel Notification + Scheduler
- **Validation**: Form Requests + Custom Rules
- **Testing**: PHPUnit

---

## 📁 Folder Structure (Under `app/`)

```bash
app/
├─ Http/
│  ├─ Controllers/
│  │  ├─ Api/
│  │  │  ├─ AuthController.php
│  │  │  ├─ UserController.php
│  │  │  ├─ LocationController.php
│  │  │  ├─ DonationEventController.php
│  │  │  ├─ TransactionController.php
│  │  │  ├─ CommunityPostController.php
│  │  │  ├─ CommentController.php
│  │  │  ├─ VoteController.php
│  │  │  ├─ VerificationController.php
│  │  │  ├─ ModerationController.php
│  │  │  ├─ NotificationController.php
│  │  │  └─ AnnouncementController.php
│  │  └─ Admin/
│  ├─ Middleware/
│  ├─ Requests/
│  │  ├─ Auth/
│  │  ├─ DonationEvent/
│  │  ├─ Transaction/
│  │  ├─ CommunityPost/
│  │  ├─ Comment/
│  │  ├─ Verification/
│  │  ├─ Moderation/
│  │  └─ Announcement/
│  ├─ Resources/
│  │  ├─ UserResource.php
│  │  ├─ LocationResource.php
│  │  ├─ DonationEventResource.php
│  │  ├─ TransactionResource.php
│  │  ├─ CommunityPostResource.php
│  │  ├─ CommentResource.php
│  │  ├─ VerificationResource.php
│  │  ├─ NotificationResource.php
│  │  └─ AnnouncementResource.php
├─ Models/
│  ├─ User.php
│  ├─ Location.php
│  ├─ DonationEvent.php
│  ├─ DonationTransaction.php
│  ├─ CommunityPost.php
│  ├─ Comment.php
│  ├─ Vote.php
│  ├─ Verification.php
│  ├─ ModerationReport.php
│  ├─ Notification.php
│  └─ Announcement.php
├─ Services/
├─ Repositories/
├─ Policies/
├─ Enums/
│  ├─ UserRole.php
│  ├─ DonationEventType.php
│  ├─ DonationEventStatus.php
│  ├─ TransactionType.php
│  ├─ TransactionStatus.php
│  ├─ VoteType.php
│  ├─ VerificationStatus.php
│  └─ ModerationStatus.php
└─ Notifications/
```

---

## 📌 API Endpoints (Expanded per Schema)

### Authentication & Users

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Authenticate a user and get token
- `POST /api/auth/logout` – Invalidate current token
- `GET /api/user/profile` – Retrieve authenticated user's profile
- `PUT /api/user/profile` – Update authenticated user's profile
- `POST /api/user/verification` – Submit verification request with images

### Locations

- `GET /api/locations` – List all governorates/districts
- `GET /api/locations/{id}/events` – Get donation events by location

### Donation Events

- `GET /api/donation-events` – List donation events (filters: type, status, location)
- `POST /api/donation-events` – Create a donation event (request/offer)
- `GET /api/donation-events/{id}` – View specific donation event
- `PUT /api/donation-events/{id}` – Update donation event (owner or admin only)
- `DELETE /api/donation-events/{id}` – Delete donation event

### Transactions

- `POST /api/transactions` – Create contribution or claim
- `GET /api/transactions` – List authenticated user's transactions
- `PUT /api/transactions/{id}/approve` – Admin/moderator approves transaction

### Community Posts

- `GET /api/community-posts` – List all community posts (paginated, searchable)
- `POST /api/community-posts` – Create a post linked to a donation event
- `GET /api/community-posts/{id}` – View post details
- `PUT /api/community-posts/{id}` – Update post (owner only)
- `DELETE /api/community-posts/{id}` – Delete post (owner or moderator)

### Comments & Votes

- `POST /api/posts/{id}/comments` – Add comment to a post
- `GET /api/posts/{id}/comments` – Fetch comments for a post
- `PUT /api/comments/{id}` – Edit a comment (owner only)
- `DELETE /api/comments/{id}` – Delete comment (owner or moderator)
- `POST /api/posts/{id}/vote` – Upvote/downvote a post
- `DELETE /api/posts/{id}/vote` – Remove vote

### Moderation

- `POST /api/moderation/report` – Submit content report (user/event/comment/post)
- `GET /api/moderation/reports` – List all reports (admin/moderator only)
- `PUT /api/moderation/reports/{id}/resolve` – Resolve moderation report

### Notifications

- `GET /api/notifications` – Retrieve all notifications for user
- `PUT /api/notifications/{id}/read` – Mark one as read
- `PUT /api/notifications/mark-all-read` – Mark all as read

### Admin

- `GET /api/admin/users` – List all users
- `PUT /api/admin/users/{id}/role` – Change user role (admin only)
- `POST /api/admin/announcements` – Create announcement
- `GET /api/admin/analytics` – Get platform-level stats

### Announcements

- `GET /api/announcements` – Public list of admin announcements
- `GET /api/announcements/{id}` – View announcement detail

---

## 🔄 Updated Relationships (Based on New Schema)

```php
User hasMany DonationEvents
User hasMany DonationTransactions
User hasMany CommunityPosts
User hasMany Comments
User hasMany Votes
User hasMany Notifications
User hasMany Verifications
User hasMany ModerationReports
User hasMany Announcements

Location hasMany Users
Location hasMany DonationEvents

DonationEvent hasMany DonationTransactions
DonationEvent hasMany CommunityPosts

CommunityPost hasMany Comments
CommunityPost hasMany Votes

Comment belongsTo CommunityPost
Vote belongsTo CommunityPost

Verification belongsTo User
Verification belongsTo Moderator (User)

ModerationReport belongsTo Reporter (User)
ModerationReport belongsTo Resolver (User)
```

---

## 🧪 Testing Blueprint

- One Feature Test per entity group:
  - Auth
  - Donation Events
  - Transactions
  - Community Posts
  - Verifications
  - Moderation
- Example usage:
  - `User::factory()->has(CommunityPosts::factory()->count(3))->create();`
- Assertions:
  - `assertStatus(200)`
  - `assertJsonStructure([...])`

---

## 📝 Notes on Schema Integration

- Use **morphMap** to simplify polymorphic relationships
- Use **Enums** for all `enum` fields to ensure type safety
- Store `string[]` and `json` using casts (`array`, `json`)
- Utilize **policies** for:
  - Moderation
  - Verifications
  - Admin Role Assignments

---

## 🔍 Donation Search (MeiliSearch + Laravel Scout)

```php
public function index(Request $request)
{
    $query = $request->query('q');
    $events = DonationEvent::search($query)->paginate(10);
    return DonationEventResource::collection($events);
}
```

---

## 🖼️ Image Upload & Storage Example

```php
public function upload(Request $request, $eventId)
{
    $request->validate(['image' => 'required|image|max:2048']);

    $image = Intervention::make($request->file('image'))->resize(1200, null, function ($constraint) {
        $constraint->aspectRatio();
        $constraint->upsize();
    });

    $path = "donation-events/{$eventId}/" . Str::uuid() . '.jpg';
    Storage::disk('public')->put($path, (string) $image->encode());

    return response()->json(['path' => Storage::url($path)], 201);
}
```

---

## 📝 Activity Logging (Spatie Activity Log)

```php
activity()
    ->causedBy(auth()->user())
    ->performedOn($donationEvent)
    ->withProperties(['title' => $donationEvent->title])
    ->log('Created a donation event');
```

---

## 📡 Real-Time Broadcasting (Laravel Echo + Pusher)

**Broadcast event example:**

```php
broadcast(new CommentAdded($comment))->toOthers();
```

**Frontend (Echo):**

```js
Echo.channel(`posts.${postId}`)
    .listen('CommentAdded', (e) => {
        console.log('New comment:', e.comment);
    });
```

---

## 🚀 Sprint Plan (3 Weeks)

### 🗓 Week 1 – Setup & Auth

- ✅ Laravel 12 project initialization
- ✅ Sanctum auth setup (register/login/logout)
- ✅ User profile endpoints
- ✅ Locations CRUD
- ✅ Roles & permissions with Spatie
- ✅ Begin writing unit and feature tests

### 🗓 Week 2 – Donation Flows & Community

- ✅ Donation Events CRUD
- ✅ File upload: Donation images
- ✅ Scout + MeiliSearch integration
- ✅ Community posts, votes, comments
- ✅ Verification module (with image upload)
- ✅ Activity logging

### 🗓 Week 3 – Admin & Realtime

- ✅ Moderation workflows
- ✅ Admin analytics and announcement tools
- ✅ Notifications system (broadcast + DB)
- ✅ Laravel Echo & Pusher
- ✅ Final testing & cleanup

---

## 📚 Reference Documentation

- **Laravel**: [https://laravel.com/docs/12.x](https://laravel.com/docs/12.x)
- **Sanctum Auth**: [https://laravel.com/docs/12.x/sanctum](https://laravel.com/docs/12.x/sanctum)
- **Spatie Permission**: [https://spatie.be/docs/laravel-permission](https://spatie.be/docs/laravel-permission)
- **Laravel Scout**: [https://laravel.com/docs/12.x/scout](https://laravel.com/docs/12.x/scout)
- **MeiliSearch**: [https://www.meilisearch.com/docs](https://www.meilisearch.com/docs)
- **Intervention Image**: [https://image.intervention.io](https://image.intervention.io)
- **Spatie Activity Log**: [https://spatie.be/docs/laravel-activitylog](https://spatie.be/docs/laravel-activitylog)
- **Laravel Broadcasting**: [https://laravel.com/docs/12.x/broadcasting](https://laravel.com/docs/12.x/broadcasting)
- **Laravel Notifications**: [https://laravel.com/docs/12.x/notifications](https://laravel.com/docs/12.x/notifications)

