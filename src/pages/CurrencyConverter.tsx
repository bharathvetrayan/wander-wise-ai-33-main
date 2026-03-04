import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ArrowRightLeft, TrendingUp, DollarSign, Euro, PoundSterling } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import himalayasBg from "@/assets/himalayas-bg.jpg";

// Source currencies that can be converted to INR
const sourceCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$", icon: DollarSign },
  { code: "EUR", name: "Euro", symbol: "€", icon: Euro },
  { code: "GBP", name: "British Pound", symbol: "£", icon: PoundSterling },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", icon: DollarSign },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", icon: DollarSign },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", icon: DollarSign },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", icon: DollarSign },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", icon: DollarSign },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", icon: DollarSign },
  { code: "THB", name: "Thai Baht", symbol: "฿", icon: DollarSign },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", icon: DollarSign },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", icon: DollarSign },
];

// Exchange rates to INR (how many INR per 1 unit of source currency)
const exchangeRatesToINR: Record<string, number> = {
  USD: 83.12,
  EUR: 90.35,
  GBP: 105.22,
  JPY: 0.56,
  AUD: 54.32,
  CAD: 61.12,
  CHF: 94.45,
  CNY: 11.48,
  SGD: 62.03,
  THB: 2.34,
  AED: 22.63,
  SAR: 22.16,
};

const popularConversions = [
  { from: "USD", rate: 83.12 },
  { from: "EUR", rate: 90.35 },
  { from: "GBP", rate: 105.22 },
  { from: "AED", rate: 22.63 },
];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [result, setResult] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const convert = () => {
    const numAmount = parseFloat(amount) || 0;
    const rate = exchangeRatesToINR[fromCurrency] || 1;
    const converted = numAmount * rate;
    setResult(converted);
  };

  useEffect(() => {
    convert();
  }, [amount, fromCurrency]);

  const getCurrencySymbol = (code: string) => {
    return sourceCurrencies.find((c) => c.code === code)?.symbol || code;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 relative">
        {/* Currency Converter Background - Himalayas */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img 
            src={himalayasBg} 
            alt="Himalayas" 
            className="absolute inset-0 w-full h-full object-cover scale-110"
            animate={{
              scale: [1.1, 1.15, 1.1],
              x: [0, 5, 0],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 22,
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
              Currency Converter
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Convert currencies instantly for your travel budget planning
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Exchange Rate Calculator
                  </CardTitle>
                  <CardDescription>
                    Last updated: {lastUpdated.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-14 text-2xl font-semibold text-center"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Currency Selection */}
                  <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
                    <div className="space-y-2">
                      <Label>From</Label>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="h-14">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceCurrencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <span className="flex items-center gap-2">
                                <span className="font-bold">{currency.code}</span>
                                <span className="text-muted-foreground">{currency.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <ArrowRightLeft className="w-5 h-5 text-primary" />
                    </div>

                    <div className="space-y-2">
                      <Label>To</Label>
                      <div className="h-14 flex items-center justify-center bg-muted/50 border border-border rounded-md px-4">
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-primary">INR</span>
                          <span className="text-muted-foreground">Indian Rupee</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Result */}
                  <motion.div
                    key={result}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center"
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      {getCurrencySymbol(fromCurrency)}{parseFloat(amount) || 0} {fromCurrency} =
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      ₹{result.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Indian Rupee (INR)</p>
                  </motion.div>

                  {/* Exchange Rate Info */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      1 {fromCurrency} = ₹{exchangeRatesToINR[fromCurrency]?.toFixed(2)} INR
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setLastUpdated(new Date())}
                    className="w-full gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Rates
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Popular Conversions to INR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <h3 className="text-lg font-semibold mb-4">Popular Conversions to INR</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {popularConversions.map((conv, i) => (
                  <Card
                    key={i}
                    className="border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setFromCurrency(conv.from)}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        1 {conv.from} → INR
                      </p>
                      <p className="text-lg font-semibold mt-1 text-primary">
                        ₹{conv.rate.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Travel Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Travel Currency Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Notify your bank before traveling to avoid card blocks</li>
                    <li>• Use local ATMs for better exchange rates</li>
                    <li>• Carry some cash in local currency for emergencies</li>
                    <li>• Consider travel-friendly credit cards with no foreign fees</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CurrencyConverter;
