import { useRef } from "react";
import { motion } from "framer-motion";
import { Printer, Download, MapPin, Calendar, Wallet, Utensils, Mountain, Landmark, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function ItineraryDisplay({
  itinerary,
  destination,
  startDate,
  endDate,
  budget,
  interests,
}: ItineraryDisplayProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

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

  // Parse itinerary into day sections
  const parseDays = (text: string) => {
    const lines = text.split("\n");
    const days: { title: string; content: string }[] = [];
    let currentDay: { title: string; content: string } | null = null;

    for (const line of lines) {
      const dayMatch = line.match(/^#{1,3}\s*(Day\s*\d+.*)/i) || line.match(/^\*\*\s*(Day\s*\d+.*?)\*\*/i);
      if (dayMatch) {
        if (currentDay) days.push(currentDay);
        currentDay = { title: dayMatch[1].replace(/\*\*/g, "").trim(), content: "" };
      } else if (currentDay) {
        currentDay.content += line + "\n";
      } else {
        // Content before any day heading
        if (!days.length && line.trim()) {
          if (!currentDay) {
            currentDay = { title: "Overview", content: "" };
          }
          currentDay.content += line + "\n";
        }
      }
    }
    if (currentDay) days.push(currentDay);
    return days;
  };

  const days = parseDays(itinerary);
  const hasDays = days.length > 0 && days[0].title !== "Overview";

  return (
    <div ref={printRef} className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border/50 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  {destination} Itinerary
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {startDate} → {endDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    ₹{budget}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 print:hidden">
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button variant="default" size="sm" onClick={handleDownload} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {interests.split(",").map((interest) => {
                const key = interest.trim().toLowerCase();
                return (
                  <Badge key={key} variant="secondary" className="capitalize gap-1.5 px-3 py-1">
                    {interestIcons[key] || <Star className="w-3.5 h-3.5" />}
                    {interest.trim()}
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Day-wise Cards */}
      {hasDays ? (
        <div className="space-y-4">
          {days.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
            >
              <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold">
                      {index + 1}
                    </div>
                    <span>{day.title}</span>
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-ul:space-y-1 prose-h3:text-base prose-h3:text-primary prose-h4:text-sm prose-h4:text-primary/80">
                    <ReactMarkdown>{day.content.trim()}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Fallback: render full markdown if no day structure detected */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-h2:text-xl prose-h2:font-bold prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2 prose-h2:mt-6 prose-h3:text-lg prose-h3:text-primary prose-ul:space-y-1">
                <ReactMarkdown>{itinerary}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
