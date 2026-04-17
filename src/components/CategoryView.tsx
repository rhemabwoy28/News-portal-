import { ArticleData } from "../types";
import { motion } from "motion/react";
import { X, ArrowRight } from "lucide-react";

interface CategoryViewProps {
  category: string;
  articles: ArticleData[];
  onClose: () => void;
  onArticleSelect: (id: string) => void;
}

export default function CategoryView({ category, articles, onClose, onArticleSelect }: CategoryViewProps) {
  const filteredArticles = articles.filter(a => a.category.toUpperCase() === category.toUpperCase());

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-surface-bright z-[120] flex flex-col overflow-y-auto"
    >
      <header className="p-4 md:p-8 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-highest sticky top-0 z-10">
        <h2 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tighter text-primary">{category}</h2>
        <button 
          onClick={onClose}
          className="p-2 md:p-3 text-secondary hover:text-primary hover:bg-surface-container transition-all border border-outline-variant/30"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </header>

      <div className="max-w-[1440px] mx-auto w-full p-6 md:p-12">
        <div className="mb-8 md:mb-12 border-b-4 border-primary pb-6">
            <h1 className="font-headline font-black text-3xl md:text-8xl uppercase tracking-tighter text-on-surface">The {category} Desk</h1>
            <p className="font-label text-xs md:text-sm uppercase tracking-[0.4em] text-on-surface-variant mt-4 font-bold">Comprehensive coverage and deep-dive terminal analysis</p>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredArticles.map((article) => (
              <button 
                key={article.id}
                onClick={() => onArticleSelect(article.id)}
                className="group text-left border-b border-outline-variant/30 pb-12 hover:bg-surface-container-low transition-all"
              >
                <div className="relative overflow-hidden mb-6 aspect-video">
                    <img 
                        src={article.image} 
                        alt={article.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                    />
                </div>
                <h3 className="font-headline font-bold text-2xl md:text-3xl leading-tight mb-4 group-hover:text-primary transition-colors italic">{article.title}</h3>
                <div className="flex justify-between items-center">
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{article.date}</p>
                    <ArrowRight className="w-5 h-5 text-primary transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-4 border-dashed border-outline-variant">
            <h3 className="font-headline font-bold text-2xl text-on-surface-variant/40 uppercase">No active dispatches found for this desk</h3>
            <p className="font-body italic text-on-surface-variant/30 mt-2">Checking secure terminal transmission feeds...</p>
          </div>
        )}
      </div>

      <footer className="p-8 border-t border-outline-variant/30 text-center font-label text-[10px] uppercase tracking-[0.5em] text-on-surface-variant mt-auto">
        ESTABLISHED 2024 • THE EDITORIAL AUTHORITY
      </footer>
    </motion.div>
  );
}
