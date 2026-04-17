import { Share2, Bookmark, Printer, Quote, CheckSquare } from "lucide-react";
import type { ReactNode } from "react";
import { ArticleData } from "../types";

export default function Article({ data }: { data: ArticleData }) {
  return (
    <article className="lg:col-span-8">
      {/* Article Header */}
      <header className="mb-10 border-b-8 border-surface-container-highest pb-8">
        <div className="inline-block bg-tertiary-container text-on-tertiary-container px-3 py-1 mb-6 font-label text-sm tracking-widest uppercase font-bold">
          {data.category}
        </div>
        <h1 className="text-4xl md:text-6xl font-headline font-black leading-none tracking-tighter text-on-surface mb-6 uppercase">
          {data.title}
        </h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8 pt-6 bg-surface-container-low px-6 py-4">
          <div className="flex items-center gap-4">
            <img 
              alt={data.author} 
              className="w-12 h-12 object-cover border-2 border-primary" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByyHfvSXYnDSQ0Kll2iZUdEiqelDp7-n6l3Z-lt1PUX_AvzcXp5GNjdm7-Yn8aGSyFzs-VMcvnEhk5VUxXoYibjor80jM3JBrGQg5g48Yvt5LkNktRcNJ38T1RNBf5eeFYGQv0nHB_cuho4g8PccdEfWpQzhqvBmEQGImmYZgnaG-GunPVotvC7wV4VdntuHPLdsfkk6ZC7Qg5QoqSKS-um5pcjVURSVaNJLwfP17s7KC05uzMZBqZsSS5XmrTJxqSpu_Plpcq0fYg"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-headline font-bold text-lg text-primary uppercase">By {data.author}</p>
              <p className="font-label text-xs text-on-surface-variant tracking-widest uppercase mt-1">{data.date} • {data.readTime}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <ShareButton icon={<Share2 className="w-5 h-5" />} />
            <ShareButton icon={<Bookmark className="w-5 h-5 fill-current" />} />
            <ShareButton icon={<Printer className="w-5 h-5" />} />
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <figure className="mb-12 relative group overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 pointer-events-none transition-opacity group-hover:opacity-0 animate-pulse duration-[3000ms]"></div>
        <img 
          alt={data.title} 
          className="w-full h-auto aspect-video object-cover grayscale-[20%] contrast-125 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
          src={data.image || null}
          referrerPolicy="no-referrer"
        />
        <figcaption className="mt-4 font-label text-xs text-on-surface-variant tracking-wider uppercase border-l-4 border-primary pl-4 py-1 bg-surface-container-low">
          {data.caption}
        </figcaption>
      </figure>

      {/* Article Body */}
      <div className="font-body text-xl leading-relaxed text-on-surface">
        {data.content.map((para, i) => (
          <p key={i} className={`mt-8 ${i === 0 ? 'drop-cap first-line:uppercase first-line:tracking-widest' : ''}`}>
            {para}
          </p>
        ))}

        {/* Pull Quote */}
        {data.pullQuote && (
          <blockquote className="my-16 pl-8 border-l-8 border-primary bg-surface-container-low py-8 pr-8 relative">
            <Quote className="absolute top-4 left-4 w-12 h-12 text-primary/10 rotate-180" />
            <p className="text-3xl font-headline font-bold text-on-surface leading-tight z-10 relative italic">
              "{data.pullQuote.text}"
            </p>
            <footer className="mt-4 font-label text-sm tracking-widest uppercase text-primary font-bold">
              — {data.pullQuote.author}
            </footer>
          </blockquote>
        )}

        {/* Key Provisions List */}
        {data.keyProvisions && (
          <div className="my-12 p-8 bg-surface-container-highest border-t-4 border-primary">
            <h3 className="font-headline font-bold text-xl uppercase tracking-wider mb-6">Key Provisions:</h3>
            <ul className="space-y-6">
              {data.keyProvisions.map((provision, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckSquare className="w-6 h-6 text-primary mt-0.5 fill-primary/10 shrink-0" />
                  <span className="font-body text-lg leading-snug">{provision}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Article Tags */}
      <div className="mt-16 border-t-8 border-surface-container-highest pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-label text-xs tracking-widest uppercase text-on-surface-variant font-black mr-2">Filed Under:</span>
          {data.tags.map((tag) => (
            <a 
              key={tag} 
              href="#" 
              className="bg-surface-container-high px-4 py-2 font-label text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all font-bold"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function ShareButton({ icon }: { icon: ReactNode }) {
  return (
    <button className="bg-surface-container-lowest hover:bg-primary text-on-surface hover:text-white p-2.5 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 active:scale-90">
      {icon}
    </button>
  );
}
