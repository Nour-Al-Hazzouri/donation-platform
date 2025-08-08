<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreDonationEventRequest;
use App\Http\Requests\UpdateDonationEventRequest;
use App\Models\DonationEvent;
use App\Http\Resources\DonationEventResource;

class DonationEventController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Display a listing of Donation Events.
     */
    public function index()
    {
        $donationEvents=DonationEvent::with('user','location')->latest()->get();
        return response()->json([
            'data' => DonationEventResource::collection($donationEvents),
            'message' => 'Donation events retrieved successfully.',
        ],200);
    }

    /* store donation */
    public function store(StoreDonationEventRequest $request)
    {
        $this->authorize('create', DonationEvent::class);
        $validated=$request->validated();
        $validated['current_amount']=0;
        $validated['possible_amount']=0;
        $validated['user_id']=auth()->user()->id;
        $donationEvent=DonationEvent::create($validated);
        return response()->json([
            'data' => new DonationEventResource($donationEvent),
            'message' => 'Donation event created successfully.',
        ],201  );
    }

    /**
     * Display the specified Donation Event.
     */
    public function show(DonationEvent $donationEvent)
    {
        $this->authorize('view', $donationEvent);
        $donationEvent=DonationEvent::with('user','location')->findOrFail($donationEvent->id);
        return response()->json([
            'data' => new DonationEventResource($donationEvent),
            'message' => 'Donation event retrieved successfully.',
        ],200);
    }

    /* update donation */
    public function update(UpdateDonationEventRequest $request, DonationEvent $donationEvent)
    {
        $this->authorize('update',$donationEvent);
        $donationEvent->update($request->validated());
        return response()->json([
            'message' => 'Donation event updated successfully.',
            'data' => new DonationEventResource($donationEvent)
        ],200);
    }
    /**
     * Remove the specified donation event.
     */
    public function destroy(DonationEvent $donationEvent)
    {
        $this->authorize('delete',$donationEvent);
        $donationEvent->delete();
        return response()->json([
            'message' => 'Donation event deleted successfully.',
        ],200);
    }
}
