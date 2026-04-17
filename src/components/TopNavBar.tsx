import { Search, Menu, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function TopNavBar({ onHome, onMenuClick, onSearchClick, onSectionSelect }: { onHome: () => void, onMenuClick: () => void, onSearchClick: () => void, onSectionSelect: (category: string) => void }) {
  const [isDark, setIsDark] = useState(false);
  const navItems = ["NEWS", "POLITICS", "ECONOMY", "TECHNOLOGY", "SPORTS", "BUSINESS", "EDUCATION", "ENTERTAINMENT", "LIFESTYLE"];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <nav className="bg-surface-bright sticky top-0 z-50 transition-all duration-200">
      <div className="flex flex-col items-center w-full px-4 md:px-6 py-4 md:py-6 max-w-[1440px] mx-auto bg-surface-container-highest shadow-[0_4px_40px_rgba(174,19,26,0.05)]">
        <div className="flex items-center justify-between w-full mb-4 md:mb-6">
          <div className="flex-1 flex gap-1 md:gap-2">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 md:p-2 text-secondary hover:text-primary hover:bg-surface-container transition-all active:scale-95"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <button onClick={onHome} className="hover:opacity-90 transition-opacity cursor-pointer">
            <Logo />
          </button>
          <div className="flex-1 flex justify-end gap-1 md:gap-2">
            <button 
              onClick={onSearchClick}
              className="p-1.5 md:p-2 text-secondary hover:text-primary hover:bg-surface-container transition-all active:scale-95"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={onMenuClick}
              className="p-1.5 md:p-2 text-secondary hover:text-primary hover:bg-surface-container transition-all active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
        <ul className="flex gap-4 md:gap-8 overflow-x-auto w-full justify-start md:justify-center scrollbar-hide pb-2 px-2">
          {navItems.map((item) => (
            <li key={item} className="shrink-0">
              <button
                onClick={() => item === "NEWS" ? onHome() : onSectionSelect(item)}
                className={`text-[10px] md:text-[11px] font-label font-bold uppercase tracking-widest block whitespace-nowrap transition-all active:scale-95 px-1 pb-1 cursor-pointer ${
                  item === "NEWS"
                    ? "text-primary border-b-4 border-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
