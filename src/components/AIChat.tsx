import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Trash2, Cpu, Zap, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize AI - We use the environment variable
  const ai = new GoogleGenAI({ apiKey: process.env.GNN_BOT_KEY || process.env.GEMINI_API_KEY || "" });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!process.env.GEMINI_API_KEY && !process.env.GNN_BOT_KEY) {
      alert("Please set your API Key (GEMINI_API_KEY or GNN_BOT_KEY) in the platform secrets first.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
            systemInstruction: "You are the GNN Neural Core, a highly advanced AI research assistant for Ghana Network News. You are authoritative, intelligent, and helpful. You speak with a tech-forward, journalistic tone. You help editors research stories, write dispatches, and generate creative ideas."
        }
      });

      // Prepare context for Gemini (simple history)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const modelResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            ...history,
            { role: "user", parts: [{ text: input }] }
        ]
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: modelResponse.text || "I processed that, but have no text output. My apologies.",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: `CORE ERROR: ${error.message || "Unknown transmission failure."}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Purge Neural History?")) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-surface-bright border border-outline-variant/30 shadow-2xl relative overflow-hidden">
      {/* Brutalist Header */}
      <div className="p-6 border-b border-outline-variant/30 bg-surface-container-high flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-none border border-on-surface">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline font-black text-lg uppercase tracking-wider">GNN Neural Core</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant">System Online // v3.1 Flash</p>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-on-surface-variant hover:text-red-600 transition-colors"
          title="Clear History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 bg-primary/5 border border-primary/20 flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-primary opacity-40" />
              </div>
              <h4 className="font-headline font-black text-xl uppercase mb-2">Neural Link Initialized</h4>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                Connect with the GNN Core for story research, editorial rewrites, or creative brainstorming. 
                <span className="block mt-4 italic">"Ask me to write a dispatch about Ghana's digital economy."</span>
              </p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-none border ${msg.role === "user" ? "bg-on-surface text-surface border-on-surface" : "bg-primary text-white border-on-surface"}`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[85%] md:max-w-[70%] space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
                   <p className="font-label text-[10px] uppercase font-black opacity-40 tracking-widest">
                    {msg.role === "user" ? "EDITOR" : "NEURAL_CORE"} // {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className={`p-4 font-body text-sm leading-relaxed ${msg.role === "user" ? "bg-primary/10 border-r-4 border-primary" : "bg-surface-container border-l-4 border-secondary"}`}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex gap-4 items-center"
          >
            <div className="w-8 h-8 border border-on-surface/20 flex items-center justify-center bg-surface-container animate-pulse">
               <Zap className="w-4 h-4 text-primary animate-bounce" />
            </div>
            <p className="font-label text-[10px] uppercase tracking-widest font-black animate-pulse">Processing Transmission...</p>
          </motion.div>
        )}
      </div>

      {/* Input UI */}
      <div className="p-6 bg-surface-container-high border-t border-outline-variant/30">
        <div className="flex gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="TYPE TRANSMISSION..."
            className="flex-1 bg-surface-bright border border-outline-variant/30 p-4 font-body text-sm focus:outline-none focus:border-primary transition-colors resize-none h-[64px]"
          />
          <div className="flex flex-col gap-2">
             <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-on-surface text-surface px-6 h-full flex items-center justify-center hover:bg-primary transition-all active:scale-95 group"
              >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
          </div>
        </div>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {["Suggest news headlines", "Write a Sports recap", "Summarize Economy feed", "Generate AI Art Prompt"].map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="whitespace-nowrap font-label text-[9px] uppercase tracking-widest font-black opacity-40 hover:opacity-100 hover:text-primary transition-all border border-transparent hover:border-primary/20 px-2 py-1"
                >
                    + {prompt}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
  );
}
