import { Share2, Bookmark, Printer, Quote, CheckSquare } from "lucide-react";
import type { ReactNode } from "react";

export default function Article() {
  return (
    <article className="lg:col-span-8">
      {/* Article Header */}
      <header className="mb-10 border-b-8 border-surface-container-highest pb-8">
        <div className="inline-block bg-tertiary-container text-on-tertiary-container px-3 py-1 mb-6 font-label text-sm tracking-widest uppercase font-bold">
          POLITICS
        </div>
        <h1 className="text-5xl md:text-6xl font-headline font-black leading-none tracking-tighter text-on-surface mb-6 uppercase">
          Parliament Approves New Infrastructure Bill Amidst Heavy Debate
        </h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8 pt-6 bg-surface-container-low px-6 py-4">
          <div className="flex items-center gap-4">
            <img 
              alt="Author" 
              className="w-12 h-12 object-cover border-2 border-primary" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByyHfvSXYnDSQ0Kll2iZUdEiqelDp7-n6l3Z-lt1PUX_AvzcXp5GNjdm7-Yn8aGSyFzs-VMcvnEhk5VUxXoYibjor80jM3JBrGQg5g48Yvt5LkNktRcNJ38T1RNBf5eeFYGQv0nHB_cuho4g8PccdEfWpQzhqvBmEQGImmYZgnaG-GunPVotvC7wV4VdntuHPLdsfkk6ZC7Qg5QoqSKS-um5pcjVURSVaNJLwfP17s7KC05uzMZBqZsSS5XmrTJxqSpu_Plpcq0fYg"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-headline font-bold text-lg text-primary uppercase">By GNN Staff Reporter</p>
              <p className="font-label text-xs text-on-surface-variant tracking-widest uppercase mt-1">October 24, 2024 • 4 Min Read</p>
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
          alt="Parliament building" 
          className="w-full h-auto aspect-video object-cover grayscale-[20%] contrast-125 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCQTsfJsPwOENEjpAZYDYRwpLCrvgKDuApHBycXjYuRbdGqGOv6aebgmEL_LTSqbSLEeyN_X_-ffNmbGyKkkJDjdH565YN3QymXmmh7gESFBEWmp-L4j2ilg1gJWEMbya-R50aw7ibPYnRydG3F-dCs5iwx_zhppgtkiTMjxOw9zQPcqvpoUo3bmBEJAs-g0jmKF2wPggrcYfjg5GgHzq26hzksYBl20ZTZewneneQY-bkkXfjOkFlXSzWcawTCxMckhiupSgWaPwq"
          referrerPolicy="no-referrer"
        />
        <figcaption className="mt-4 font-label text-xs text-on-surface-variant tracking-wider uppercase border-l-4 border-primary pl-4 py-1 bg-surface-container-low">
          Members of Parliament arriving for the emergency session earlier today. (Photo: GNN Images)
        </figcaption>
      </figure>

      {/* Article Body */}
      <div className="font-body text-xl leading-relaxed text-on-surface">
        <p className="drop-cap first-line:uppercase first-line:tracking-widest">
          In a session that stretched late into the evening, Parliament has formally approved the controversial National Infrastructure Development Bill. The legislation, which promises to reshape the nation's transportation networks and energy grids over the next decade, passed by a narrow margin following intense debate from opposition benches.
        </p>
        
        <p className="mt-8">
          The bill authorizes the immediate release of funds for several major projects, including the long-delayed coastal highway expansion and a new hydroelectric initiative in the northern regions. Supporters argue these investments are critical for modernizing the economy and creating jobs.
        </p>

        {/* Pull Quote */}
        <blockquote className="my-16 pl-8 border-l-8 border-primary bg-surface-container-low py-8 pr-8 relative">
          <Quote className="absolute top-4 left-4 w-12 h-12 text-primary/10 rotate-180" />
          <p className="text-3xl font-headline font-bold text-on-surface leading-tight z-10 relative italic">
            "This is not merely a bill about concrete and steel; it is a blueprint for our economic survival in the next century."
          </p>
          <footer className="mt-4 font-label text-sm tracking-widest uppercase text-primary font-bold">
            — Hon. Minister of Finance
          </footer>
        </blockquote>

        <p className="mt-8">
          However, critics raised significant concerns regarding the financing structure of the proposed projects. The opposition shadow minister for finance warned that the debt mechanisms outlined in the bill could burden future generations. "We are mortgaging our future for immediate political gains," she stated during the heated floor debate.
        </p>

        <h2 className="text-3xl font-headline font-black uppercase tracking-tight mt-12 mb-6 text-on-surface bg-surface-container-highest inline-block px-4 py-2">
          Economic Implications
        </h2>

        <p className="mt-6">
          Independent analysts suggest the immediate impact on the construction sector will be profound. The initial phase of funding is expected to create over 10,000 direct jobs within the first eighteen months. Yet, concerns remain about the capacity of local contractors to handle the scale of the proposed works without significant foreign intervention.
        </p>

        {/* Key Provisions List */}
        <div className="my-12 p-8 bg-surface-container-highest border-t-4 border-primary">
          <h3 className="font-headline font-bold text-xl uppercase tracking-wider mb-6">Key Provisions of the Bill:</h3>
          <ul className="space-y-6">
            <ProvisionItem text="Allocation of $2.5 billion for coastal highway expansion." />
            <ProvisionItem text="Establishment of the National Energy Modernization Fund." />
            <ProvisionItem text="Mandatory 40% local content requirement for all primary contracts." />
          </ul>
        </div>

        <p className="mt-8">
          The President is expected to sign the bill into law later this week, paving the way for the immediate formation of the oversight committee mandated by the legislation.
        </p>
      </div>

      {/* Article Tags */}
      <div className="mt-16 border-t-8 border-surface-container-highest pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-label text-xs tracking-widest uppercase text-on-surface-variant font-black mr-2">Filed Under:</span>
          {["Politics", "Infrastructure", "Economy", "Parliament"].map((tag) => (
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

function ProvisionItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-4">
      <CheckSquare className="w-6 h-6 text-primary mt-0.5 fill-primary/10 shrink-0" />
      <span className="font-body text-lg leading-snug">{text}</span>
    </li>
  );
}
