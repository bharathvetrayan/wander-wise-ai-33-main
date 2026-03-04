
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Auth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Signup successful! Please check your email for verification.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Logged in successfully!");
                navigate("/");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-slate-950 z-0" />

            {/* Animated background gradents */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <motion.div
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]"
                    animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]"
                    animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="relative z-10 flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <Card className="w-full bg-background/40 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden">
                            {/* Card inner subtle glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                            <CardHeader className="text-center pb-2">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                        <div className="w-8 h-8 bg-primary rounded-full blur-sm absolute opacity-50" />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary relative z-10"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                                    </div>
                                    <CardTitle className="text-2xl font-bold tracking-tight">
                                        {isSignUp ? "Create an Account" : "Welcome Back"}
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground mt-2">
                                        {isSignUp
                                            ? "Sign up to start planning your perfect trip"
                                            : "Sign in to access your saved itineraries"}
                                    </CardDescription>
                                </motion.div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleAuth} className="space-y-5">
                                    <div className="space-y-2 group">
                                        <Label htmlFor="email" className="text-sm font-medium text-foreground/80 group-focus-within:text-primary transition-colors">Email Address</Label>
                                        <div className="relative">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-3 text-muted-foreground"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="pl-10 bg-background/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-medium text-foreground/80 group-focus-within:text-primary transition-colors">Password</Label>
                                            {!isSignUp && (
                                                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-3 text-muted-foreground"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="pl-10 bg-background/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full relative overflow-hidden group py-6 mt-2"
                                        disabled={loading}
                                    >
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                                        <span className="relative flex items-center justify-center gap-2 text-white font-medium text-base">
                                            {loading ? (
                                                "Processing..."
                                            ) : isSignUp ? (
                                                <>Sign Up <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></>
                                            ) : (
                                                <>Sign In <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg></>
                                            )}
                                        </span>
                                    </Button>

                                    <div className="relative pt-4 text-center text-sm">
                                        <div className="absolute inset-0 flex items-center top-4">
                                            <div className="w-full border-t border-border/50"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background/80 px-2 text-muted-foreground backdrop-blur-sm rounded-full">Or continue with</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 justify-center pt-2">
                                        <Button type="button" variant="outline" className="w-full bg-background/40 hover:bg-background/60 border-white/10">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg>
                                            Google
                                        </Button>
                                    </div>

                                    <div className="text-center pt-2 mt-4 text-sm mt-4 text-muted-foreground">
                                        {isSignUp
                                            ? "Already have an account? "
                                            : "Don't have an account? "}
                                        <button
                                            type="button"
                                            onClick={() => setIsSignUp(!isSignUp)}
                                            className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                                        >
                                            {isSignUp ? "Sign In" : "Sign Up"}
                                        </button>
                                    </div>

                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Auth;
