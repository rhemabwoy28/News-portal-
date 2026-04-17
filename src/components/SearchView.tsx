import { X, Search as SearchIcon, TrendingUp, History } from "lucide-react";
import { motion } from "motion/react";

export default function SearchView({ onClose }: { onClose: () => void }) {
  const trending = ["Global Markets", "Energy Policy", "Continental Cup", "Tech Investment", "Agritech"];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-surface-bright/95 backdrop-blur-md z-[120] flex flex-col items-center pt-20 md:pt-32 px-6 overflow-y-auto"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 text-secondary hover:text-primary transition-all active:scale-95"
      >
        <X className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div className="w-full max-w-3xl">
        <div className="flex border-b-4 md:border-b-8 border-primary pb-2 md:pb-4 mb-8 md:mb-12">
          <input 
            autoFocus
            type="text" 
            placeholder="SEARCH THE GNN GRID..." 
            className="bg-transparent flex-1 font-headline font-black text-2xl md:text-6xl uppercase tracking-tighter focus:outline-none placeholder:text-on-surface-variant/20" 
          />
          <SearchIcon className="w-8 h-8 md:w-12 md:h-12 text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h4 className="font-label text-xs uppercase tracking-[0.3em] text-primary font-black mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Searches
            </h4>
            <div className="flex flex-wrap gap-3">
              {trending.map(t => (
                <button key={t} className="bg-surface-container-highest px-4 py-2 font-label text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all">
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant font-black mb-6 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Dispatches
            </h4>
            <div className="space-y-4">
              <p className="font-body text-sm italic text-on-surface-variant/60">No recent history found in this session terminal.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
