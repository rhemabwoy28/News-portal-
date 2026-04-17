import { Lock, Mail, ChevronRight } from "lucide-react";
import Logo from "./Logo";

export default function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-surface-bright flex items-center justify-center p-6 relative overflow-hidden">
      {/* Brutalist geometric background accents */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/5 rotate-12 -z-10"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-primary/5 -rotate-12 -z-10"></div>
      
      <div className="w-full max-w-md">
        <div className="bg-surface-container-highest p-12 border border-outline-variant/30 shadow-[0_40px_80px_rgba(174,19,26,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
          
          <div className="mb-12 text-center">
            <div className="scale-125 mb-8 inline-block">
                <Logo />
            </div>
            <h2 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface">Secure Authentication</h2>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2 font-bold italic">Verification Required for Dispatch Access</p>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-container-low border border-outline-variant/20 p-6 text-center italic font-body text-on-surface-variant text-sm">
                "Journalism is printing what someone else does not want printed; everything else is public relations."
            </div>

            <button 
              onClick={onLogin}
              className="w-full bg-primary text-white p-5 font-headline font-bold uppercase tracking-[0.1em] flex items-center justify-between hover:bg-primary-container transition-all group/btn active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 group-hover/btn:bg-white/20 transition-colors">
                    <Lock className="w-5 h-5" />
                </div>
                Continue with GNN Account
              </div>
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <div className="text-center pt-8">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-black">Internal Network Authorized Users Only</p>
                <div className="mt-4 flex justify-center gap-4 text-xs font-label uppercase tracking-widest text-secondary opacity-50">
                    <a href="#" className="hover:text-primary transition-colors">Security Audit</a>
                    <span>•</span>
                    <a href="#" className="hover:text-primary transition-colors">Grid Status</a>
                </div>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 font-label text-[9px] uppercase tracking-[0.4em] text-on-surface-variant opacity-40">
            © 2024 GNN GLOBAL TERMINAL. ENCRYPTED ACCESS NODE 44-X.
        </p>
      </div>
    </div>
  );
}
