import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, MapPin, DollarSign, Heart, Mail, Loader2, Check, Plane, AlertCircle, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import lakshadweepBeachBg from "@/assets/lakshadweep-beach-bg.jpg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ItineraryDisplay } from "@/components/travel/ItineraryDisplay";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

// ============================================
// WEBHOOK CONFIGURATION
// Replace this URL with your n8n webhook endpoint
// ============================================
const WEBHOOK_URL = "https://n8nproject-b62m.onrender.com/webhook/travel-plan";

// Available travel interest options

const tripFormSchema = z.object({
  destination: z.string().min(2, "Please enter a valid destination"),
  fromLocation: z.string().min(2, "Please enter a valid starting location"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z.string().min(1, "Budget is required"),
  travelMode: z.enum(["Solo", "Family", "Friends"], {
    required_error: "Please select a travel mode",
  }),
  email: z.string().email("Please enter a valid email"),
  interests: z.string().trim().min(1, "Please enter at least one interest"),
});

type TripFormData = z.infer<typeof tripFormSchema>;

const PlanTrip = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      destination: "",
      fromLocation: "",
      startDate: "",
      endDate: "",
      budget: "",
      travelMode: "Solo",
      email: "",
      interests: "",
    },
  });

  const onSubmit = async (data: TripFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        destination: data.destination,
        fromLocation: data.fromLocation,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        travelMode: data.travelMode,
        interests: data.interests.split(",").map(s => s.trim()).filter(Boolean),
        email: data.email,
        timestamp: new Date().toISOString(),
        source: "travel-ai-platform",
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && result.itinerary) {
        setItinerary(result.itinerary);
        setFormData(data);
        setIsSubmitted(true);

        if (user) {
          const { error: dbError } = await supabase.from("trips").insert({
            user_id: user.id,
            destination: data.destination,
            from_location: data.fromLocation,
            start_date: data.startDate,
            end_date: data.endDate,
            budget: data.budget,
            travel_mode: data.travelMode,
            interests: data.interests.split(",").map(s => s.trim()).filter(Boolean), // Plan needed text[], so passing array
            itinerary: result.itinerary,
          });

          if (dbError) {
            console.error("Error saving trip:", dbError);
            toast.error("Itinerary generated, but failed to save to your account.");
          } else {
            toast.success("Itinerary generated and saved to your account!");
          }
        } else {
          toast.success("Your AI-generated travel itinerary is ready!");
        }
      } else if (result.itinerary) {
        // Handle case where itinerary exists but no explicit status field
        setItinerary(result.itinerary);
        setFormData(data);
        setIsSubmitted(true);
        toast.success("Your AI-generated travel itinerary is ready!");
      } else {
        throw new Error(result.message || "No itinerary was returned. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Webhook error:", err);
      if (err instanceof Error) {
        setError(err.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 relative">
        {/* Plan Trip Background - Lakshadweep Beach */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={lakshadweepBeachBg}
            alt="Lakshadweep Beach"
            className="absolute inset-0 w-full h-full object-cover scale-110"
            animate={{
              scale: [1.1, 1.15, 1.1],
              x: [0, 10, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/90" />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Plan Your Perfect Trip
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fill in your travel details and let our AI create a personalized itinerary just for you.
            </p>
          </motion.div>

          {!isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="max-w-3xl mx-auto border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    Trip Details
                  </CardTitle>
                  <CardDescription>
                    Tell us about your dream vacation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* From Location */}
                    <div className="space-y-2">
                      <Label htmlFor="fromLocation" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        From Location
                      </Label>
                      <Input
                        id="fromLocation"
                        placeholder="e.g., Bangalore, Mumbai"
                        {...form.register("fromLocation")}
                        className="h-12"
                      />
                      {form.formState.errors.fromLocation && (
                        <p className="text-sm text-destructive">{form.formState.errors.fromLocation.message}</p>
                      )}
                    </div>

                    {/* Destination */}
                    <div className="space-y-2">
                      <Label htmlFor="destination" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Destination
                      </Label>
                      <Input
                        id="destination"
                        placeholder="e.g., Tamil Nadu, Kerala"
                        {...form.register("destination")}
                        className="h-12"
                      />
                      {form.formState.errors.destination && (
                        <p className="text-sm text-destructive">{form.formState.errors.destination.message}</p>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Start Date
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          {...form.register("startDate")}
                          min={new Date().toISOString().split("T")[0]}
                          className="h-12"
                        />
                        {form.formState.errors.startDate && (
                          <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          End Date
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          {...form.register("endDate")}
                          min={new Date().toISOString().split("T")[0]}
                          className="h-12"
                        />
                        {form.formState.errors.endDate && (
                          <p className="text-sm text-destructive">{form.formState.errors.endDate.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Budget (INR)
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="e.g., 3000"
                        {...form.register("budget")}
                        className="h-12"
                      />
                      {form.formState.errors.budget && (
                        <p className="text-sm text-destructive">{form.formState.errors.budget.message}</p>
                      )}
                    </div>



                    {/* Travel Mode */}
                    <div className="space-y-2">
                      <Label htmlFor="travelMode" className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Travel Mode
                      </Label>
                      <Controller
                        control={form.control}
                        name="travelMode"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select travel mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Solo">Solo</SelectItem>
                              <SelectItem value="Family">Family</SelectItem>
                              <SelectItem value="Friends">Friends</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.travelMode && (
                        <p className="text-sm text-destructive">{form.formState.errors.travelMode.message}</p>
                      )}
                    </div>

                    {/* Interests - Text Input */}
                    <div className="space-y-2">
                      <Label htmlFor="interests" className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" />
                        Travel Interests
                      </Label>
                      <Input
                        id="interests"
                        placeholder="e.g., temple, culture, falls, beach, adventure"
                        {...form.register("interests")}
                        className="h-12"
                      />
                      {form.formState.errors.interests && (
                        <p className="text-sm text-destructive">{form.formState.errors.interests.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...form.register("email")}
                        className="h-12"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full gradient-accent text-accent-foreground font-semibold h-14 text-lg rounded-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Generating your travel plan…
                        </>
                      ) : (
                        <>
                          <Plane className="mr-2 w-5 h-5" />
                          Plan My Trip
                        </>
                      )}
                    </Button>

                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Success Message */}
              <Card className="max-w-3xl mx-auto border-primary/50 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Trip Planned Successfully!</h3>
                      <p className="text-muted-foreground">
                        Here's your AI-generated itinerary for {formData?.destination}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setItinerary(null);
                        setFormData(null);
                        setError(null);
                        form.reset();
                      }}
                      className="ml-auto"
                    >
                      Plan Another Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary Display */}
              {formData && itinerary && (
                <ItineraryDisplay
                  itinerary={itinerary}
                  destination={formData.destination}
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  budget={formData.budget}
                  interests={formData.interests}
                />
              )}
            </motion.div>
          )}
        </div>
      </main >
      <Footer />
    </div >
  );
};

export default PlanTrip;
