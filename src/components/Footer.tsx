import { Share2, Mail } from "lucide-react";
import Logo from "./Logo";

export default function Footer({ onHome, onAdminClick, onSectionSelect }: { onHome: () => void, onAdminClick: () => void, onSectionSelect: (category: string) => void }) {
  return (
    <footer className="bg-zinc-900 text-white mt-12 px-6 md:px-12 py-16 w-full relative z-40">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-start gap-6">
          <button onClick={onHome} className="hover:opacity-90 transition-opacity cursor-pointer">
            <Logo light />
          </button>
          <p className="font-label text-xs uppercase tracking-widest text-zinc-400 leading-relaxed max-w-xs">
            The Editorial Authority.<br />
            Uncompromising journalism for a modern era.
          </p>
          <button 
            onClick={onAdminClick}
            className="font-label text-[10px] uppercase tracking-[0.3em] text-zinc-600 hover:text-primary transition-colors font-bold mt-4"
          >
            Terminal Access
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-label text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Sections</h4>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {["Politics", "Economy", "Technology", "Sports", "Business", "National", "Opinion", "Education", "Entertainment", "Lifestyle"].map((item) => (
              <button 
                key={item} 
                onClick={() => onSectionSelect(item.toUpperCase())}
                className="font-label text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors text-left"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-label text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Corporate</h4>
          <ul className="flex flex-col gap-2">
            {["About Us", "Contact", "Privacy Policy", "Terms of Service", "Advertise"].map((item) => (
              <li key={item}>
                <a href="#" className="font-label text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto border-t border-zinc-800 pt-8 mt-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-label text-[10px] uppercase tracking-widest text-zinc-500">
          © 2024 GNN GHANA NETWORK NEWS. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-zinc-500 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </a>
          <a href="#" className="text-zinc-500 hover:text-white transition-colors">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
