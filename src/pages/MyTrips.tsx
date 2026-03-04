
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Trip } from "@/types/database";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ItineraryDisplay } from "@/components/travel/ItineraryDisplay";

const MyTrips = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    useEffect(() => {
        if (user) {
            fetchTrips();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchTrips = async () => {
        try {
            const { data, error } = await supabase
                .from("trips")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTrips(data || []);
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-display">My Trips</h1>
                    <Link to="/plan">
                        <Button>Plan New Trip</Button>
                    </Link>
                </div>

                {selectedTrip ? (
                    <div>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedTrip(null)}
                            className="mb-4"
                        >
                            ← Back to Trips
                        </Button>
                        <ItineraryDisplay
                            itinerary={selectedTrip.itinerary || ""}
                            destination={selectedTrip.destination}
                            startDate={selectedTrip.start_date}
                            endDate={selectedTrip.end_date}
                            budget={selectedTrip.budget}
                            interests={selectedTrip.interests?.join(", ") || ""}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                <p>You haven't saved any trips yet.</p>
                                <Link to="/plan" className="text-primary hover:underline mt-2 inline-block">
                                    Start planning now
                                </Link>
                            </div>
                        ) : (
                            trips.map((trip) => (
                                <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            {trip.destination}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                {trip.start_date} - {trip.end_date}
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-semibold">Budget:</span> ₹{trip.budget}
                                            </div>
                                            <Button
                                                className="w-full group"
                                                onClick={() => setSelectedTrip(trip)}
                                            >
                                                View Itinerary
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MyTrips;
