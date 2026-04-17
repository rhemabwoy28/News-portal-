import { X, ArrowRight, Newspaper, TrendingUp, Globe, Briefcase, Zap, PlaySquare, GraduationCap, PartyPopper, Palette } from "lucide-react";
import { motion } from "motion/react";
import Logo from "./Logo";

export default function SectionsView({ onClose, onSectionSelect }: { onClose: () => void, onSectionSelect: (category: string) => void }) {
  const sections = [
    { name: "Politics", icon: Globe, count: 12, color: "text-blue-600" },
    { name: "Economy", icon: TrendingUp, count: 8, color: "text-green-600" },
    { name: "Technology", icon: Zap, count: 15, color: "text-amber-500" },
    { name: "Sports", icon: PlaySquare, count: 24, color: "text-red-600" },
    { name: "Business", icon: Briefcase, count: 10, color: "text-indigo-600" },
    { name: "National", icon: Newspaper, count: 32, color: "text-primary" },
    { name: "Opinion", icon: Briefcase, count: 6, color: "text-purple-600" },
    { name: "Education", icon: GraduationCap, count: 9, color: "text-orange-600" },
    { name: "Entertainment", icon: PartyPopper, count: 14, color: "text-secondary" },
    { name: "Lifestyle", icon: Palette, count: 7, color: "text-teal-600" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-surface-bright z-[100] flex flex-col"
    >
      <header className="p-8 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-highest">
        <Logo />
        <button 
          onClick={onClose}
          className="p-3 text-secondary hover:text-primary hover:bg-surface-container transition-all active:scale-95 border border-outline-variant/30"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto max-w-[1440px] mx-auto w-full p-8 md:p-16">
        <div className="mb-8 md:mb-16">
          <h2 className="font-headline font-black text-5xl md:text-8xl uppercase tracking-tighter text-on-surface mb-4">Sections</h2>
          <p className="font-label text-[10px] md:text-sm uppercase tracking-[0.4em] text-on-surface-variant font-bold">Uncompromising Journalism for a Modern Era</p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sections.map((section) => (
            <motion.button
              key={section.name}
              variants={item}
              onClick={() => onSectionSelect(section.name.toUpperCase())}
              className="group bg-surface-container-low p-8 border border-outline-variant/20 hover:border-primary transition-all text-left relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
              <section.icon className={`w-10 h-10 mb-6 ${section.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <h3 className="font-headline font-black text-2xl md:text-4xl uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">
                    {section.name}
                  </h3>
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2 font-bold italic">
                    {section.count} Recent Dispatches
                  </p>
                </div>
                <ArrowRight className="w-8 h-8 text-primary transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        <div className="mt-24 border-t-4 border-surface-container-highest pt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-primary p-12 text-white">
            <h4 className="font-headline font-black text-3xl uppercase tracking-tighter mb-4">GNN Premium Dispatch</h4>
            <p className="font-body text-xl italic mb-8 opacity-80">Access the deep-dive investigations and exclusive terminal analysis.</p>
            <button className="bg-white text-primary px-8 py-4 font-headline font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
              Subscribe Now
            </button>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="font-headline font-black text-2xl uppercase tracking-tighter mb-6 text-on-surface">Archive Search</h4>
            <div className="flex border-b-4 border-on-surface pb-2">
              <input type="text" placeholder="SEARCH THE GRID..." className="bg-transparent flex-1 font-label text-sm uppercase tracking-[0.2em] focus:outline-none" />
              <Search className="w-6 h-6 text-on-surface" />
            </div>
          </div>
        </div>
      </div>
      
      <footer className="p-8 border-t border-outline-variant/30 text-center font-label text-[10px] uppercase tracking-[0.5em] text-on-surface-variant">
        ESTABLISHED 2024 • THE EDITORIAL AUTHORITY
      </footer>
    </motion.div>
  );
}

import { Search } from "lucide-react";
