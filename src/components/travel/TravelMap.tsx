import { useState } from "react";
import { motion } from "framer-motion";
import { Map, MapPin, Hotel, Utensils, Landmark, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TravelMapProps {
  destination: string;
}

// Pan-India locations
const demoLocations = [
  { id: 1, name: "Taj Mahal, Agra", type: "attraction", lat: 27.1751, lng: 78.0421 },
  { id: 2, name: "Gateway of India, Mumbai", type: "attraction", lat: 18.9220, lng: 72.8347 },
  { id: 3, name: "The Oberoi, Delhi", type: "hotel", lat: 28.5831, lng: 77.2106 },
  { id: 4, name: "Bukhara, ITC Maurya", type: "food", lat: 28.5974, lng: 77.1725 },
  { id: 5, name: "Meenakshi Temple, Madurai", type: "attraction", lat: 9.9195, lng: 78.1193 },
  { id: 6, name: "Hawa Mahal, Jaipur", type: "attraction", lat: 26.9239, lng: 75.8267 },
  { id: 7, name: "Backwaters, Kerala", type: "attraction", lat: 9.4981, lng: 76.3388 },
  { id: 8, name: "Valley of Flowers, Uttarakhand", type: "attraction", lat: 30.7280, lng: 79.6050 },
];

const getLocationIcon = (type: string) => {
  switch (type) {
    case "hotel":
      return Hotel;
    case "food":
      return Utensils;
    case "attraction":
      return Landmark;
    default:
      return MapPin;
  }
};

const getLocationColor = (type: string) => {
  switch (type) {
    case "hotel":
      return "bg-blue-500";
    case "food":
      return "bg-orange-500";
    case "attraction":
      return "bg-green-500";
    default:
      return "bg-primary";
  }
};

export function TravelMap({ destination }: TravelMapProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredLocations = selectedType
    ? demoLocations.filter((loc) => loc.type === selectedType)
    : demoLocations;

  const filters = [
    { type: null, label: "All", icon: Map },
    { type: "attraction", label: "Temples & Sites", icon: Landmark },
    { type: "hotel", label: "Hotels", icon: Hotel },
    { type: "food", label: "Food", icon: Utensils },
  ];

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          Interactive Map - {destination}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.label}
                variant={selectedType === filter.type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(filter.type)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        {/* Map placeholder - would integrate with Google Maps API */}
        <div className="relative rounded-xl overflow-hidden bg-muted h-[400px]">
          {/* Gradient overlay to simulate map */}
          <div className="absolute inset-0 bg-gradient-to-br from-travel-sky/20 via-travel-ocean/10 to-travel-forest/20" />
          
          {/* Grid pattern for map feel */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Location markers */}
          {filteredLocations.map((location, index) => {
            const Icon = getLocationIcon(location.type);
            const colorClass = getLocationColor(location.type);
            
            // Position markers in a nice spread pattern
            const positions = [
              { top: "30%", left: "40%" },
              { top: "25%", left: "60%" },
              { top: "50%", left: "30%" },
              { top: "45%", left: "55%" },
              { top: "20%", left: "75%" },
              { top: "60%", left: "65%" },
            ];
            
            const pos = positions[index % positions.length];
            
            return (
              <motion.div
                key={location.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="absolute group cursor-pointer"
                style={{ top: pos.top, left: pos.left }}
              >
                <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-card px-3 py-1.5 rounded-lg shadow-lg border border-border whitespace-nowrap">
                    <span className="text-sm font-medium">{location.name}</span>
                  </div>
                </div>
                {/* Pulse effect */}
                <div className={`absolute inset-0 ${colorClass} rounded-full animate-ping opacity-20 transform -translate-x-1/2 -translate-y-1/2`} />
              </motion.div>
            );
          })}

          {/* Center destination label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="glass px-6 py-4 rounded-xl">
              <Map className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-lg">{destination}</h3>
              <p className="text-sm text-muted-foreground">Incredible India</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Temples & Sites</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Hotels</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-sm text-muted-foreground">Food & Dining</span>
          </div>
        </div>

        {/* Location list */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLocations.map((location) => {
            const Icon = getLocationIcon(location.type);
            return (
              <div
                key={location.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${getLocationColor(location.type)} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{location.name}</p>
                  <Badge variant="outline" className="text-xs capitalize mt-0.5">
                    {location.type}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
