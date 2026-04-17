import { TrendingUp, Mail, CheckSquare } from "lucide-react";
import React, { useState } from "react";
import { ArticleData } from "../types";
import { subscribeToNewsletter } from "../services/storageService";

export default function Sidebar({ onArticleSelect, articles }: { onArticleSelect: (id: string) => void, articles: ArticleData[] }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const trendingArticles = articles.slice(0, 3);
  const latestArticles = articles.slice(3, 5);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await subscribeToNewsletter(email);
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <aside className="lg:col-span-4 space-y-12">
      {/* Advertisement Block */}
      <div className="bg-surface-container-low w-full h-[250px] flex items-center justify-center relative overflow-hidden border border-outline-variant/30">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-dim opacity-50"></div>
        <div className="relative z-10 text-center">
          <span className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-2 block">Advertisement</span>
          <p className="font-headline font-bold text-xl text-on-surface/30 uppercase tracking-widest">Space Available</p>
        </div>
      </div>

      {/* Trending Now */}
      <section className="bg-surface-container-low p-6 border-t-4 border-primary shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-primary mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 fill-primary" />
          Trending Now
        </h3>
        <div className="space-y-6">
          {trendingArticles.map((article, i) => (
            <TrendingItem 
              key={article.id}
              id={article.id}
              category={article.category} 
              title={article.title} 
              time={article.date || "Just In"} 
              onClick={onArticleSelect}
              isLast={i === trendingArticles.length - 1} 
            />
          ))}
        </div>
      </section>

      {/* Latest Dispatches */}
      <section>
        <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface mb-6 border-b-4 border-surface-container-highest pb-2">
          Latest Dispatches
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {latestArticles.map((article) => (
            <DispatchCard 
              key={article.id}
              id={article.id}
              category={article.category} 
              title={article.title} 
              image={article.image || "https://picsum.photos/seed/news/200/200"}
              onClick={onArticleSelect}
            />
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-primary to-primary-container p-8 text-on-primary shadow-[0_20px_40px_rgba(174,19,26,0.2)]">
        <Mail className="w-10 h-10 mb-4 text-on-primary fill-none" />
        <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-2">The Daily Briefing</h3>
        {isSubscribed ? (
          <div className="bg-white/10 p-4 border border-white/20">
            <p className="font-body italic text-white leading-snug">
                Transmission received. You are now on the GNN secure distribution list.
            </p>
          </div>
        ) : (
          <>
            <p className="font-body text-lg text-on-primary-container mb-6 italic">
              Get the uncompromising facts delivered directly to your inbox every morning.
            </p>
            <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL ADDRESS" 
                className="bg-white/10 border border-outline-variant/30 text-white placeholder:text-white/50 p-3 font-label text-sm tracking-wider uppercase focus:outline-none focus:border-white focus:bg-white/20 transition-all"
              />
              <button type="submit" className="bg-white text-primary font-headline font-bold uppercase tracking-widest py-3 hover:bg-surface-container-highest transition-colors active:scale-95">
                Subscribe
              </button>
            </form>
          </>
        )}
      </div>
    </aside>
  );
}

const TrendingItem = ({ id, category, title, time, onClick, isLast = false }: { key?: React.Key, id: string, category: string, title: string, time: string, onClick: (id: string) => void, isLast?: boolean }) => {
  return (
    <button 
      onClick={() => onClick(id)} 
      className={`group block text-left w-full cursor-pointer hover:bg-surface-container transition-all p-2 -mx-2 ${!isLast ? 'border-b border-surface-container-highest pb-6' : ''}`}
    >
      <article>
        <div className="font-label text-xs text-primary font-bold uppercase tracking-widest mb-1">{category}</div>
        <h4 className="font-headline font-bold text-lg leading-tight group-hover:text-primary transition-colors">{title}</h4>
        <div className="font-label text-xs text-on-surface-variant mt-2 tracking-wider uppercase">{time}</div>
      </article>
    </button>
  );
}

const DispatchCard = ({ id, category, title, image, onClick }: { key?: React.Key, id: string, category: string, title: string, image: string, onClick: (id: string) => void }) => {
  return (
    <button 
      onClick={() => onClick(id)} 
      className="bg-surface-container-lowest flex gap-4 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(174,19,26,0.08)] transition-all group cursor-pointer block text-left w-full"
    >
      <article className="flex gap-4 w-full">
        <img 
          src={image} 
          alt={title} 
          referrerPolicy="no-referrer"
          className="w-24 h-24 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shrink-0" 
        />
        <div className="flex flex-col justify-between">
          <h4 className="font-headline font-bold text-sm leading-snug group-hover:text-primary transition-colors">{title}</h4>
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{category}</span>
        </div>
      </article>
    </button>
  );
}
