
export interface Trip {
    id: string;
    user_id: string;
    destination: string;
    from_location: string;
    start_date: string;
    end_date: string;
    budget: string;
    travel_mode: "Solo" | "Family" | "Friends";
    interests: string[];
    itinerary: string;
    created_at: string;
}
