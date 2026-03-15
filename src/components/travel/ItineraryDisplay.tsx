import { useRef } from "react";
import { motion } from "framer-motion";
import { 
  Printer, Download, MapPin, Calendar, Wallet, Utensils, 
  Mountain, Landmark, Clock, Star, Bed, Navigation, Sun,
  ShoppingBag, ShieldCheck, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";

interface ItineraryDisplayProps {
  itinerary: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  interests: string;
}

const interestIcons: Record<string, React.ReactNode> = {
  temple: <Landmark className="w-3.5 h-3.5" />,
  culture: <Star className="w-3.5 h-3.5" />,
  food: <Utensils className="w-3.5 h-3.5" />,
  nature: <Mountain className="w-3.5 h-3.5" />,
  adventure: <Mountain className="w-3.5 h-3.5" />,
};

// --- Parsers ---

const cleanText = (t: string) => t.replace(/[*_]/g, "").trim();

const extractActivityDetails = (text: string) => {
  const lines = text.split("\n");
  const details = {
    place: "",
    location: "",
    description: "",
    distance: "",
    travelTime: "",
    transport: "",
    mapUrl: "",
    raw: text,
  };

  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.includes("place:")) details.place = cleanText(line.split(/place:/i)[1]);
    else if (l.includes("location:")) details.location = cleanText(line.split(/location:/i)[1]);
    else if (l.includes("description:")) details.description = cleanText(line.split(/description:/i)[1]);
    else if (l.includes("distance from")) details.distance = cleanText(line.split(/:/)[1] || "");
    else if (l.includes("distance") && !details.distance) details.distance = cleanText(line.split(/:/)[1] || "");
    else if (l.includes("travel time")) details.travelTime = cleanText(line.split(/:/)[1] || "");
    else if (l.includes("transport")) details.transport = cleanText(line.split(/:/)[1] || "");
    else if (l.includes("map:")) details.mapUrl = line.split(/map:/i)[1]?.trim().split(" ")[0] || "";
    else if (line.includes("http")) details.mapUrl = line.match(/(https?:\/\/[^\s]+)/)?.[1] || "";
  }
  return details;
};

const extractHotelDetails = (text: string) => {
  const details = { name: "", location: "", price: "", mapUrl: "", raw: text };
  const lines = text.split("\n");
  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.includes("hotel name:")) details.name = cleanText(line.split(/hotel name:/i)[1]);
    else if (!details.name && l.includes("hotel:")) details.name = cleanText(line.split(/hotel:/i)[1]);
    else if (l.includes("location:")) details.location = cleanText(line.split(/location:/i)[1]);
    else if (l.includes("price:")) details.price = cleanText(line.split(/price:/i)[1]);
    else if (line.includes("http")) details.mapUrl = line.match(/(https?:\/\/[^\s\)]+)/)?.[1] || "";
    else if (l.includes("map:")) details.mapUrl = line.split(/map:/i)[1]?.trim() || "";
  }
  return details;
};

const extractFoodDetails = (text: string) => {
  const details = { name: "", location: "", dish: "", mapUrl: "", raw: text };
  const lines = text.split("\n");
  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.includes("restaurant name:")) details.name = cleanText(line.split(/restaurant name:/i)[1]);
    else if (l.includes("restaurant:")) details.name = cleanText(line.split(/restaurant:/i)[1]);
    else if (l.includes("place:")) details.name = cleanText(line.split(/place:/i)[1]);
    else if (l.includes("location:")) details.location = cleanText(line.split(/location:/i)[1]);
    else if (l.includes("popular dish") || l.includes("dish")) details.dish = cleanText(line.split(/:/)[1] || "");
    else if (line.includes("http")) details.mapUrl = line.match(/(https?:\/\/[^\s\)]+)/)?.[1] || "";
    else if (l.includes("map:")) details.mapUrl = line.split(/map:/i)[1]?.trim() || "";
  }
  return details;
};

const parseItineraryText = (text: string) => {
  const lines = text.split("\n");
  const parsed = {
    overview: "",
    days: [] as any[],
    hotels: [] as string[],
    foods: [] as string[],
    summary: {
      weather: "",
      budget: "",
      packing: "",
      safety: "",
    },
  };

  let currentSection = "overview";
  let activeDay: any = null;
  let activePart: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.trim();
    if (!cleanLine) continue;

    const lower = cleanLine.toLowerCase();

    // Section headers transitions
    if (lower.match(/^(?:#|\*)*\s*hotel recommendations?\s*(?:#|\*)*$/) || (lower.includes("hotel recommendation") &&!lower.includes("day"))) {
      currentSection = "hotels";
      continue;
    }
    if (lower.match(/^(?:#|\*)*\s*food recommendations?\s*(?:#|\*)*$/) || lower.match(/^(?:#|\*)*\s*local food to try\s*(?:#|\*)*$/) || (lower.includes("food recommendation") && !lower.includes("day"))) {
      currentSection = "foods";
      continue;
    }
    if (lower.match(/^(?:#|\*)*\s*weather summary\s*(?:#|\*)*$/) || (lower.includes("weather summary") && !lower.includes("day"))) {
      currentSection = "weather";
      continue;
    }
    if (lower.match(/^(?:#|\*)*\s*budget summary\s*(?:#|\*)*$/) || (lower.includes("budget summary") && !lower.includes("day"))) {
      currentSection = "budget";
      continue;
    }
    if (lower.match(/^(?:#|\*)*\s*packing suggestions?\s*(?:#|\*)*$/) || (lower.includes("packing suggestion") && !lower.includes("day"))) {
      currentSection = "packing";
      continue;
    }
    if (lower.match(/^(?:#|\*)*\s*safety tips?\s*(?:#|\*)*$/) || (lower.includes("safety tip") && !lower.includes("day"))) {
      currentSection = "safety";
      continue;
    }

    const dayMatch = cleanLine.match(/^(?:#+\s*)?(?:\*\*)?(Day\s*\d+(?:\s*[–\-:]\s*.*)?)(?:\*\*)?/i);
    if (dayMatch && !lower.includes("summary")) {
      activeDay = { title: dayMatch[1].replace(/[*#]/g, "").trim(), parts: [], raw: "" };
      parsed.days.push(activeDay);
      currentSection = "day";
      activePart = null;
      continue;
    }

    if (currentSection === "day" && activeDay) {
      if (
        lower.match(/^(?:#|\*)*\s*morning(?: section)?\s*(?:#|\*)*$/) ||
        lower.match(/^(?:#|\*)*\s*afternoon(?: section)?\s*(?:#|\*)*$/) ||
        lower.match(/^(?:#|\*)*\s*evening(?: section)?\s*(?:#|\*)*$/)
      ) {
        activePart = { title: cleanLine.replace(/[*#:]/g, "").trim(), lines: [] };
        activeDay.parts.push(activePart);
      } else {
        if (activePart) {
          activePart.lines.push(cleanLine);
        } else {
          activeDay.raw += cleanLine + "\n";
        }
      }
    } else if (currentSection === "hotels") {
      parsed.hotels.push(cleanLine);
    } else if (currentSection === "foods") {
      parsed.foods.push(cleanLine);
    } else if (currentSection === "weather") {
      parsed.summary.weather += cleanLine + "\n";
    } else if (currentSection === "budget") {
      parsed.summary.budget += cleanLine + "\n";
    } else if (currentSection === "packing") {
      parsed.summary.packing += cleanLine + "\n";
    } else if (currentSection === "safety") {
      parsed.summary.safety += cleanLine + "\n";
    } else if (currentSection === "overview") {
      parsed.overview += cleanLine + "\n";
    }
  }

  const parseBlocks = (linesArray: string[], startMatches: string[]) => {
    const blocks: string[] = [];
    let currentBlock: string[] = [];
    for (const line of linesArray) {
      if (startMatches.some((m) => line.toLowerCase().includes(m)) || line.match(/^(?:-|\*|•)\s*\*\*/)) {
        if (currentBlock.length > 0) blocks.push(currentBlock.join("\n"));
        currentBlock = [line];
      } else {
        if (currentBlock.length > 0) currentBlock.push(line);
      }
    }
    if (currentBlock.length > 0) blocks.push(currentBlock.join("\n"));
    if (blocks.length === 0 && linesArray.join("\n").trim()) return [linesArray.join("\n")];
    return blocks;
  };

  const hotelsRaw = parseBlocks(parsed.hotels, ["hotel name:", "hotel:"]);
  const foodsRaw = parseBlocks(parsed.foods, ["restaurant name:", "restaurant:", "🍜"]);

  const daysStruct = parsed.days.map((d) => ({
    title: d.title,
    raw: d.raw,
    parts: d.parts.map((p: any) => ({
      title: p.title,
      details: extractActivityDetails(p.lines.join("\n")),
    })),
  }));

  const hotelsStruct = hotelsRaw.map(extractHotelDetails);
  const foodsStruct = foodsRaw.map(extractFoodDetails);

  return { ...parsed, daysStruct, hotelsStruct, foodsStruct };
};

// --- Components ---

export function ItineraryDisplay({
  itinerary,
  destination,
  startDate,
  endDate,
  budget,
  interests,
}: ItineraryDisplayProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const parsed = parseItineraryText(itinerary);
  const hasParsedDays = parsed.daysStruct.length > 0;

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const blob = new Blob(
      [`Trip to ${destination}\n${startDate} - ${endDate}\nBudget: ₹${budget}\n\n${itinerary}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${destination.replace(/\s+/g, "-").toLowerCase()}-itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={printRef} className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border/50 overflow-hidden shadow-md">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-primary" />
                  {destination} Itinerary
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full shadow-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    {startDate} → {endDate}
                  </span>
                  <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full shadow-sm">
                    <Wallet className="w-4 h-4 text-primary" />
                    ₹{budget}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 print:hidden">
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 shadow-sm">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button variant="default" size="sm" onClick={handleDownload} className="gap-2 shadow-sm">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {interests.split(",").map((interest) => {
                const key = interest.trim().toLowerCase();
                return (
                  <Badge key={key} variant="secondary" className="capitalize gap-1.5 px-3 py-1 shadow-sm">
                    {interestIcons[key] || <Star className="w-3.5 h-3.5" />}
                    {interest.trim()}
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content Layout */}
      {!hasParsedDays ? (
        <Card className="border-border/50 shadow-md">
          <CardContent className="pt-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{itinerary}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Days & Activities */}
          <div className="lg:col-span-2 space-y-8">
            {parsed.daysStruct.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
              >
                <Card className="border-border/50 overflow-hidden shadow-md">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold shadow-sm">
                        {index + 1}
                      </div>
                      <span className="font-display tracking-tight hover:text-primary transition-colors">{day.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-0">
                    {day.parts.length > 0 ? (
                      <div className="divide-y divide-border/50">
                        {day.parts.map((part: any, pIdx: number) => {
                          const { place, location, description, distance, travelTime, transport, mapUrl, raw } = part.details;
                          
                          // If parsing failed (no place), just render raw text
                          if (!place) {
                            return (
                              <div key={pIdx} className="p-6">
                                <h4 className="text-lg font-semibold text-primary/90 mb-3">{part.title}</h4>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                  <ReactMarkdown>{raw}</ReactMarkdown>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={pIdx} className="p-6 hover:bg-muted/30 transition-colors">
                              <h4 className="text-sm font-bold text-primary/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> {part.title}
                              </h4>
                              
                              <div className="flex flex-col sm:flex-row gap-5">
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h5 className="text-lg font-bold text-foreground">{place}</h5>
                                    {location && (
                                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                        <MapPin className="w-4 h-4" /> {location}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {description && (
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {description}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap gap-3 pt-2">
                                    {distance && (
                                      <Badge variant="outline" className="bg-background text-xs font-normal">
                                        <Navigation className="w-3 h-3 mr-1 text-primary" /> {distance}
                                      </Badge>
                                    )}
                                    {travelTime && (
                                      <Badge variant="outline" className="bg-background text-xs font-normal">
                                        <Clock className="w-3 h-3 mr-1 text-primary" /> {travelTime}
                                      </Badge>
                                    )}
                                    {transport && (
                                      <Badge variant="outline" className="bg-background text-xs font-normal capitalize">
                                        Transport: {transport}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {mapUrl && (
                                  <div className="sm:w-auto w-full pt-2 sm:pt-0">
                                    <Button asChild size="sm" variant="secondary" className="w-full sm:w-auto">
                                      <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                                        <Map className="w-4 h-4 mr-2" />
                                        Map
                                      </a>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{day.raw}</ReactMarkdown>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Recommendations & Summary */}
          <div className="space-y-8">
            {/* Hotels */}
            {parsed.hotelsStruct.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-border/50 shadow-md">
                  <CardHeader className="bg-muted/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bed className="w-5 h-5 text-primary" /> Recommended Hotels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 divide-y divide-border/50">
                    {parsed.hotelsStruct.map((hotel, idx) => (
                      <div key={idx} className="p-4 hover:bg-muted/30 transition-colors">
                        {hotel.name ? (
                          <div className="space-y-2">
                            <h5 className="font-semibold">{hotel.name}</h5>
                            {hotel.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" /> {hotel.location}
                              </p>
                            )}
                            <div className="flex items-center justify-between pt-1">
                              {hotel.price && (
                                <Badge variant="secondary" className="font-medium text-xs">
                                  {hotel.price}
                                </Badge>
                              )}
                              {hotel.mapUrl && (
                                <a href={hotel.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                  <Map className="w-3 h-3" /> Map
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert"><ReactMarkdown>{hotel.raw}</ReactMarkdown></div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Food */}
            {parsed.foodsStruct.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="border-border/50 shadow-md">
                  <CardHeader className="bg-muted/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-primary" /> Local Food to Try
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 divide-y divide-border/50">
                    {parsed.foodsStruct.map((food, idx) => (
                      <div key={idx} className="p-4 hover:bg-muted/30 transition-colors">
                        {food.name ? (
                          <div className="space-y-2">
                            <h5 className="font-semibold">{food.name}</h5>
                            {food.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" /> {food.location}
                              </p>
                            )}
                            <div className="flex items-start justify-between pt-1 gap-2">
                              {food.dish && (
                                <p className="text-sm font-medium text-primary">
                                  Must try: <span className="text-foreground font-normal">{food.dish}</span>
                                </p>
                              )}
                              {food.mapUrl && (
                                <a href={food.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0">
                                  <Map className="w-3 h-3" /> Map
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert"><ReactMarkdown>{food.raw}</ReactMarkdown></div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Travel Summary Blocks */}
            <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              
              {parsed.summary.weather && (
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" /> Weather
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{parsed.summary.weather}</ReactMarkdown>
                  </CardContent>
                </Card>
              )}

              {parsed.summary.budget && (
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-500" /> Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{parsed.summary.budget}</ReactMarkdown>
                  </CardContent>
                </Card>
              )}

              {parsed.summary.packing && (
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-blue-500" /> Packing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{parsed.summary.packing}</ReactMarkdown>
                  </CardContent>
                </Card>
              )}

              {parsed.summary.safety && (
                <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-primary">
                      <ShieldCheck className="w-4 h-4" /> Safety Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{parsed.summary.safety}</ReactMarkdown>
                  </CardContent>
                </Card>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
