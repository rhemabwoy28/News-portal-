import { TrendingUp, Mail, CheckSquare } from "lucide-react";

export default function Sidebar() {
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
          <TrendingItem category="Economy" title="Central Bank Announces Unexpected Interest Rate Hike" time="2 Hours Ago" />
          <TrendingItem category="Sports" title="National Team Secures Qualification for Continental Cup" time="4 Hours Ago" isLast={false} />
          <TrendingItem category="Technology" title="Local Tech Hub Secures Major International Investment" time="6 Hours Ago" isLast />
        </div>
      </section>

      {/* Latest Dispatches */}
      <section>
        <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface mb-6 border-b-4 border-surface-container-highest pb-2">
          Latest Dispatches
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <DispatchCard 
            category="Business" 
            title="Agricultural Exports See Record High This Quarter" 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAOkdR0d2A_vBk6N2l-q4oXY36afK_lSV-yZ05_ty54uasYyyhCT-Y9k_Q5cjJp_0AtDgXgiEaYqEbGfgCHo-xOLSFzI40Fdjqp7Fko1IVweyvlj8UAAop3ZbVCqSs0hos-rSE8oTxRwsLjMmD6nNumyBqxbBY69SMUGLFhhQNadRSImxJZrc6YRgvLNPLAhya69wdz96avCBa5EptcFFESDgqim1eT1qDYg-xXYjVq0sG7bnI4jFBTO6sc4ntvH2VXLpfGGe7bGZoI"
          />
          <DispatchCard 
            category="National" 
            title="New Cyber Security Taskforce Initiated by Ministry" 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwLIBo7aQUE5s8rA-MNFuEpWE3wtZkAgAX0BtNB_Xy3DWaK_BjIYXOXn2457x6xNYtQoYFQ_4SSWpOO-R0grlVp1VGVk69E4Jmf2_nyApfxlQ-ACYlb0Ncvn2MdiOU3MQONMjQZGZGJNGm3aJOF-19F7PdOVNvxNMX4jLFM3_QvgR9Df21KOLRkT3yefP1F-6ytPvsK2vPIQNLzxrbbBg0BQRfJODraEm47S6fLCxSTbGGx54MI0hXxjMZKdG81EFg1bbMIOBPM8E"
          />
        </div>
      </section>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-primary to-primary-container p-8 text-on-primary shadow-[0_20px_40px_rgba(174,19,26,0.2)]">
        <Mail className="w-10 h-10 mb-4 text-on-primary fill-none" />
        <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-2">The Daily Briefing</h3>
        <p className="font-body text-lg text-on-primary-container mb-6 italic">
          Get the uncompromising facts delivered directly to your inbox every morning.
        </p>
        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="YOUR EMAIL ADDRESS" 
            className="bg-white/10 border border-outline-variant/30 text-white placeholder:text-white/50 p-3 font-label text-sm tracking-wider uppercase focus:outline-none focus:border-white focus:bg-white/20 transition-all"
          />
          <button className="bg-white text-primary font-headline font-bold uppercase tracking-widest py-3 hover:bg-surface-container-highest transition-colors active:scale-95">
            Subscribe
          </button>
        </form>
      </div>
    </aside>
  );
}

function TrendingItem({ category, title, time, isLast = false }: { category: string, title: string, time: string, isLast?: boolean }) {
  return (
    <a href="#" className={`group block cursor-pointer ${!isLast ? 'border-b border-surface-container-highest pb-6' : ''}`}>
      <article>
        <div className="font-label text-xs text-primary font-bold uppercase tracking-widest mb-1">{category}</div>
        <h4 className="font-headline font-bold text-lg leading-tight group-hover:text-primary transition-colors">{title}</h4>
        <div className="font-label text-xs text-on-surface-variant mt-2 tracking-wider uppercase">{time}</div>
      </article>
    </a>
  );
}

function DispatchCard({ category, title, image }: { category: string, title: string, image: string }) {
  return (
    <a href="#" className="bg-surface-container-lowest flex gap-4 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(174,19,26,0.08)] transition-all group cursor-pointer block">
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
    </a>
  );
}
