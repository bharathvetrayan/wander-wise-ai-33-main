import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, MapPin, Utensils, DollarSign, Landmark, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import tanjoreTempleBg from "@/assets/tanjore-temple-bg.jpg";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Enhanced AI travel assistant responses with pan-India day-wise itinerary format
const getDemoResponse = (question: string): string => {
  const q = question.toLowerCase();

  // Detect itinerary/trip planning requests
  if (q.includes("itinerary") || q.includes("trip") || q.includes("days") || q.includes("plan") || q.includes("tour")) {
    // Rajasthan specific
    if (q.includes("rajasthan") || q.includes("jaipur") || q.includes("udaipur") || q.includes("jodhpur")) {
      return `## 🏰 Royal Rajasthan Itinerary (5 Days)

### Day 1: Jaipur - Pink City
**Morning (8:00 AM)**
• 🏰 Amber Fort - Elephant/Jeep ride to hilltop palace
• 📸 Sheesh Mahal (Mirror Palace) inside

**Afternoon (1:00 PM)**
• 🍛 Lunch at LMB (Laxmi Mishthan Bhandar) - Dal Baati Churma
• 🏛️ City Palace & Jantar Mantar observatory

**Evening (5:00 PM)**
• 🏰 Hawa Mahal - Palace of Winds
• 🛍️ Johari Bazaar for jewelry & textiles

### Day 2: Jaipur → Jodhpur
**Morning**
• 🚗 Drive to Jodhpur (5 hrs) via Ajmer
• 🕌 Quick stop at Ajmer Dargah

**Afternoon**
• 🏰 Mehrangarh Fort - Majestic blue city views
• 🍛 Mirchi Bada & Pyaaz Kachori

**Evening**
• 🌅 Clock Tower market & spice shopping

### Day 3-4: Udaipur - City of Lakes
**Day 3**
• 🏛️ City Palace - Largest palace complex in Rajasthan
• ⛵ Lake Pichola boat ride
• 🍽️ Rooftop dinner with lake view

**Day 4**
• 🛕 Jagdish Temple & old city walk
• 🎨 Miniature painting workshop
• 🌅 Sunset at Sajjangarh (Monsoon Palace)

### Day 5: Return via Ranakpur
• 🛕 Ranakpur Jain Temple - 1444 marble pillars
• 🚗 Drive to Jodhpur/Udaipur airport

---
💰 **Budget:** ₹4,000-8,000/day
🏨 **Stay:** Heritage havelis ₹3,000-10,000/night
🚗 **Transport:** Private cab recommended ₹15-18/km

🌡️ **Best Season:** October-March (avoid summer)`;
    }

    // Kerala specific
    if (q.includes("kerala") || q.includes("backwater") || q.includes("munnar") || q.includes("alleppey")) {
      return `## 🌴 God's Own Country - Kerala (6 Days)

### Day 1-2: Kochi - Queen of Arabian Sea
**Day 1**
• 🎣 Chinese Fishing Nets at Fort Kochi
• ⛪ Santa Cruz Basilica & St. Francis Church
• 🍛 Fresh seafood at Fort House

**Day 2**
• 🎭 Kathakali performance (evening)
• 🛍️ Jew Town antiques & spices

### Day 3-4: Munnar - Tea Gardens
**Day 3**
• 🚗 Scenic drive to Munnar (4 hrs)
• 🍃 Tata Tea Museum

**Day 4**
• 🌄 Eravikulam National Park (Nilgiri Tahr)
• 🌺 Mattupetty Dam & Echo Point
• ☕ Tea tasting at plantation

### Day 5-6: Alleppey Backwaters
**Day 5**
• 🛶 Houseboat cruise through backwaters
• 🍛 Kerala Sadya (feast) on boat
• 🌅 Sunset over paddy fields

**Day 6**
• 🏖️ Marari Beach
• 🧘 Ayurvedic massage

---
💰 **Budget:** ₹5,000-10,000/day
🏨 **Houseboat:** ₹8,000-25,000/night
🚗 **Transport:** Taxi or self-drive

🌡️ **Best Time:** September-March
🌧️ **Monsoon:** June-August (lush but rainy)`;
    }

    // Golden Triangle
    if (q.includes("golden") || q.includes("triangle") || q.includes("delhi") || q.includes("agra")) {
      return `## 🔺 Golden Triangle - Classic India (7 Days)

### Day 1-2: Delhi - Capital Heritage
**Day 1 - Old Delhi**
• 🕌 Jama Masjid - India's largest mosque
• 🚲 Chandni Chowk rickshaw ride
• 🍛 Paranthe Wali Gali (stuffed parathas)
• 🏛️ Red Fort (UNESCO)

**Day 2 - New Delhi**
• 🏛️ India Gate & Rashtrapati Bhavan
• 🛕 Qutub Minar (UNESCO)
• 🕌 Humayun's Tomb (UNESCO)
• 🛍️ Khan Market or Dilli Haat

### Day 3-4: Agra - City of Taj
**Day 3**
• 🕌 **Taj Mahal** - Sunrise visit (must!)
• 🏰 Agra Fort - Mughal grandeur
• 🍛 Mughlai cuisine at Pinch of Spice

**Day 4**
• 🛕 Fatehpur Sikri (UNESCO) - Abandoned Mughal city
• 🚗 Drive to Jaipur (4 hrs)

### Day 5-7: Jaipur - Pink City
**Day 5**
• 🏰 Amber Fort & Sheesh Mahal
• 🏛️ Jal Mahal (Water Palace) photo stop

**Day 6**
• 🏛️ City Palace & Jantar Mantar
• 🏰 Hawa Mahal
• 🛍️ Bapu Bazaar for textiles

**Day 7**
• 🛕 Galtaji Temple (Monkey Temple)
• Return to Delhi

---
💰 **Total Budget:** ₹35,000-60,000
🏨 **Hotels:** ₹2,500-6,000/night
🚗 **Transport:** Private car ₹12-15/km or trains

🌡️ **Best Season:** October-March`;
    }

    // Default pan-India tour
    return `## 🇮🇳 Incredible India Heritage Tour (10 Days)

### Day 1-2: Delhi - Capital Gateway
• 🏛️ Red Fort, Jama Masjid, Chandni Chowk
• 🕌 Humayun's Tomb, Qutub Minar
• 🍛 Street food tour

### Day 3: Agra
• 🕌 Taj Mahal (sunrise)
• 🏰 Agra Fort

### Day 4-5: Jaipur
• 🏰 Amber Fort, City Palace
• 🏛️ Hawa Mahal, Jantar Mantar

### Day 6-7: Varanasi
• 🛕 Ganga Aarti ceremony
• 🚣 Sunrise boat ride
• 🛕 Kashi Vishwanath Temple

### Day 8-9: South India - Chennai/Madurai
• 🛕 Meenakshi Temple
• 🛕 Brihadeeswara Temple (UNESCO)

### Day 10: Kerala or Goa
• 🌴 Backwaters or beaches

---
💰 **Budget:** ₹50,000-1,00,000 total
🚆 **Transport:** Trains + flights for long distances
🏨 **Accommodation:** ₹2,000-5,000/night

🌡️ **Best Season:** October to March`;
  }
  if (q.includes("temple") || q.includes("temples") || q.includes("heritage") || q.includes("unesco")) {
    return "## 🛕 UNESCO World Heritage Sites in India\n\n**Must-Visit Heritage Sites:**\n• 🕌 **Taj Mahal, Agra** - Symbol of eternal love\n• 🏰 **Red Fort, Delhi** - Mughal grandeur\n• 🛕 **Khajuraho Temples, MP** - Exquisite sculptures\n• 🛕 **Hampi, Karnataka** - Vijayanagara ruins\n• 🛕 **Brihadeeswara Temple, Thanjavur** - Chola masterpiece\n• 🏛️ **Ajanta & Ellora Caves, Maharashtra** - Ancient rock-cut caves\n• 🛕 **Mahabalipuram, Tamil Nadu** - Pallava monuments\n• 🛕 **Konark Sun Temple, Odisha** - Chariot-shaped temple\n\n**By Region:**\n• **North:** Fatehpur Sikri, Humayun's Tomb, Jantar Mantar\n• **South:** Pattadakal, Mahabalipuram, Thanjavur\n• **West:** Elephanta Caves, Champaner-Pavagadh\n• **East:** Sundarbans, Darjeeling Railway\n\n---\n📸 **Photography Tips:** Early morning for best light\n👔 **Dress Code:** Modest attire at religious sites\n\nWant a detailed itinerary for any region?";
  }
  if (q.includes("food") || q.includes("eat") || q.includes("dish") || q.includes("cuisine")) {
    return "## 🍛 Indian Cuisine by Region\n\n**North India:**\n• 🥘 **Dal Makhani** - Creamy black lentils (Punjab)\n• 🍛 **Butter Chicken** - Iconic Delhi dish\n• 🥙 **Chole Bhature** - Chickpea curry with fried bread\n• 🍢 **Kebabs** - Lucknowi Galouti, Seekh\n\n**South India:**\n• 🍳 **Dosa & Idli** - Fermented rice crepes\n• 🍛 **Hyderabadi Biryani** - Aromatic rice dish\n• 🦐 **Kerala Fish Curry** - Coconut-based\n• 🍲 **Chettinad Chicken** - Spicy Tamil specialty\n\n**West India:**\n• 🥘 **Pav Bhaji** - Mumbai street food\n• 🍛 **Gujarati Thali** - Sweet & savory mix\n• 🦀 **Goan Vindaloo** - Portuguese-influenced curry\n\n**East India:**\n• 🍛 **Bengali Fish Curry** - Mustard-based\n• 🍮 **Rasgulla & Sandesh** - Iconic sweets\n• 🍛 **Litti Chokha** - Bihar specialty\n\n---\n💡 **Pro Tip:** Try regional thalis for complete experience!\n\nWhich region's food trail interests you?";
  }
  if (q.includes("budget") || q.includes("cost") || q.includes("cheap") || q.includes("money")) {
    return "## 💰 India Travel Budget Guide\n\n### Daily Budget Breakdown\n\n**🏨 Accommodation:**\n• Budget: ₹500-1,500 (hostels, guesthouses)\n• Mid-range: ₹2,000-5,000 (hotels)\n• Luxury: ₹8,000-30,000+ (heritage hotels, resorts)\n\n**🍛 Food:**\n• Street food: ₹50-150/meal\n• Local restaurants: ₹150-400/meal\n• Fine dining: ₹800-2,000/meal\n\n**🚆 Transport:**\n• Trains: ₹200-2,000 (depending on class)\n• Buses: ₹100-500 per journey\n• Flights: ₹2,000-6,000 domestic\n• Taxi/Cab: ₹12-18/km\n\n**🎫 Entry Fees:**\n• Monuments: ₹40-1,000 (Indians), ₹500-1,500 (Foreigners)\n• Museums: ₹20-200\n\n---\n### Sample Trip Budgets\n• **Backpacker (7 days):** ₹15,000-25,000\n• **Mid-range (7 days):** ₹40,000-60,000\n• **Comfortable (7 days):** ₹80,000-1,50,000\n\n📱 **Money-Saving Tips:**\n• Book trains 60 days in advance\n• Use UPI for payments\n• Travel off-season (April-June, monsoon)\n• Eat at local dhabas";
  }
  if (q.includes("kerala") || q.includes("backwater")) {
    return "## 🌴 Kerala - God's Own Country\n\n### Top Experiences\n• 🛶 **Alleppey Backwaters** - Houseboat overnight stay\n• 🍃 **Munnar** - Tea plantations & misty hills\n• 🏖️ **Kovalam & Varkala** - Cliff-top beaches\n• 🐘 **Periyar** - Wildlife sanctuary\n• 🧘 **Ayurveda** - Traditional wellness treatments\n\n### Sample 5-Day Itinerary\n• Day 1-2: Kochi (Fort Kochi, Kathakali)\n• Day 3: Munnar (tea estates)\n• Day 4-5: Alleppey (backwater cruise)\n\n---\n💰 **Budget:** ₹4,000-8,000/day\n🌡️ **Best Time:** September-March\n🌧️ **Monsoon Magic:** June-August (lush greenery)\n🍛 **Must-Try:** Appam, Kerala Sadya, Fish Curry\n\nWant a detailed Kerala itinerary?";
  }
  return `Namaste! 🙏 Great question about "${question}"!\n\nI'm your **intelligent India travel assistant**, specializing in:\n\n🗓️ **Day-wise Itineraries** - Personalized trip planning across India\n🛕 **Heritage & Temples** - UNESCO sites, palaces, forts\n🍛 **Regional Cuisine** - North, South, East, West Indian food\n💰 **Budget Planning** - Cost breakdowns in INR\n🏔️ **Diverse Landscapes** - Himalayas, beaches, deserts, backwaters\n🎭 **Culture & Festivals** - Diwali, Holi, regional traditions\n\n---\n**Popular Circuits:**\n• 🔺 Golden Triangle (Delhi-Agra-Jaipur)\n• 🏰 Royal Rajasthan\n• 🌴 Kerala Backwaters\n• 🛕 South India Temples\n• 🏔️ Himalayan Adventures\n\n**Tell me:**\n• 📍 Where do you want to explore?\n• 📅 How many days?\n• 💰 Your budget (in ₹)?\n• ❤️ Interests (temples, nature, food, adventure)\n\nI'll create a detailed day-by-day plan!`;
};
const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    role: "assistant",
    content: "Namaste! 🙏 I'm your **intelligent India travel assistant**.\n\nI specialize in creating personalized, day-wise itineraries covering:\n• 🏰 North India - Delhi, Rajasthan, Himalayas\n• 🛕 South India - Tamil Nadu, Kerala, Karnataka\n• 🏔️ East & Northeast - Bengal, Sikkim, Meghalaya\n• 🏖️ West India - Goa, Maharashtra, Gujarat\n\n**Popular Trips:**\n• 🔺 Golden Triangle (Delhi-Agra-Jaipur)\n• 🏰 Royal Rajasthan\n• 🌴 Kerala Backwaters\n• 🛕 South Temple Trail\n\n**Tell me:** Where do you want to explore? How many days? What's your budget?",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Robust scrolling logic targeting the very bottom marker
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    // We use a short timeout and requestAnimationFrame to ensure the DOM 
    // has definitely updated and rendered the newly added elements before scrolling
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("https://n8nproject-b62m.onrender.com/webhook/travel-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Webhook error response:", errorText);
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      console.log("n8n response:", data);

      let reply = "I couldn't get a response from the server.";

      if (typeof data === 'string') {
        reply = data;
      } else if (data.reply) {
        reply = data.reply;
      } else if (data.output) {
        reply = data.output;
      } else if (data.text) {
        reply = data.text;
      } else if (data.message) {
        reply = data.message;
      } else if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        if (firstItem.reply) reply = firstItem.reply;
        else if (firstItem.output) reply = firstItem.output;
        else if (firstItem.text) reply = firstItem.text;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Assistant is currently unavailable. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <Navbar />

      {/* 
        Main content area takes available height.
        pt-16 compensates for fixed Navbar.
      */}
      <main className="flex-1 mt-16 relative flex flex-col overflow-hidden">

        {/* Background Layer with Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.img
            src={tanjoreTempleBg}
            alt="Tanjore Big Temple"
            className="w-full h-full object-cover scale-105 opacity-40 filter saturate-150"
            animate={{
              scale: [1.05, 1.1, 1.05],
              x: [0, -5, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95 backdrop-blur-[6px]" />
        </div>

        {/* Chat Interface Container */}
        <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col relative z-10 px-4 sm:px-6 pb-6 pt-4 h-full">

          <Card className="flex-1 bg-background/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border-white/10 flex flex-col overflow-hidden rounded-3xl relative h-full">

            {/* Header */}
            <CardHeader className="border-b border-white/10 bg-white/5 dark:bg-black/20 py-4 shrink-0 shadow-sm z-20">
              <CardTitle className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-[2px]">
                    <div className="w-full h-full bg-background rounded-full flex items-center justify-center relative overflow-hidden">
                      <Bot className="w-6 h-6 text-primary z-10" />
                      <div className="absolute inset-0 bg-primary/20 animate-pulse mix-blend-overlay"></div>
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background"></span>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                    WanderWise AI
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">Your personal travel expert</p>
                </div>
              </CardTitle>
            </CardHeader>

            {/* Scrollable Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth z-10"
              ref={scrollContainerRef}
            >
              <div className="flex flex-col space-y-6 pb-2 min-h-max">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`flex items-end gap-2.5 max-w-[85%] ${message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"} group`}
                  >

                    {/* Assistant Avatar */}
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mb-1 shadow-sm">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`
                        relative px-5 py-3.5 shadow-sm rounded-2xl
                        ${message.role === "user"
                          ? "bg-gradient-to-br from-primary to-blue-600 text-white rounded-br-sm"
                          : "bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 text-foreground rounded-bl-sm"
                        }
                      `}
                    >
                      <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content.split('\n').map((line, i) => (
                          <span key={i}>
                            {line.startsWith('**') && line.endsWith('**')
                              ? <strong className={message.role === "assistant" ? "text-primary dark:text-primary" : ""}>{line.slice(2, -2)}</strong>
                              : line.includes('**')
                                ? line.split('**').map((part, j) => j % 2 === 1
                                  ? <strong key={j} className={message.role === "assistant" ? "text-primary/90" : "font-semibold"}>{part}</strong>
                                  : part)
                                : line}
                            {i < message.content.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>

                      {/* Timestamp */}
                      <div className={`text-[10px] mt-1.5 flex items-center gap-1 font-medium ${message.role === "user" ? "text-white/80 justify-end" : "text-muted-foreground"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {message.role === "user" && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2.5 mr-auto max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mb-1 shadow-sm">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl rounded-bl-sm px-5 py-4 w-16 shadow-sm">
                      <div className="flex gap-1.5 justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1s" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: "150ms", animationDuration: "1s" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms", animationDuration: "1s" }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Invisible element to absolutely anchor scroll to bottom */}
                <div ref={messagesEndRef} className="h-2 w-full shrink-0" />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 bg-background/80 backdrop-blur-xl border-t border-white/10 shrink-0 z-20">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2 relative max-w-3xl mx-auto"
              >
                <div className="relative flex-1 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-full blur opacity-20 group-focus-within:opacity-40 transition duration-500 pointer-events-none"></div>
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask me anything about India travel..."
                    className="w-full h-14 bg-background border-white/20 pl-6 pr-14 text-[15px] focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 shadow-inner relative z-10 transition-all placeholder:text-muted-foreground/70"
                    style={{ borderRadius: "2rem" }}
                    disabled={isTyping}
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="h-12 w-12 rounded-full absolute right-1 top-1 bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 z-20 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  {isTyping ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <Send className="w-5 h-5 ml-0.5 relative z-10" />}
                </Button>
              </form>
            </div>

          </Card>
        </div>
      </main>
    </div>
  );
};
export default Chatbot;