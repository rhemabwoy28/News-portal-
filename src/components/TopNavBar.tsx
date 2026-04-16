import { Search, Menu, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function TopNavBar() {
  const [isDark, setIsDark] = useState(false);
  const navItems = ["NEWS", "OPINION", "VIDEOS", "PHOTOS", "DOCUMENTS"];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <nav className="bg-surface-bright sticky top-0 z-50 transition-all duration-200">
      <div className="flex flex-col items-center w-full px-6 py-6 max-w-[1440px] mx-auto bg-surface-container-highest shadow-[0_4px_40px_rgba(174,19,26,0.05)]">
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex-1 flex gap-2">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-secondary hover:text-primary hover:bg-surface-container transition-all active:scale-95"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <a href="/" className="hover:opacity-90 transition-opacity">
            <Logo />
          </a>
          <div className="flex-1 flex justify-end gap-2">
            <button className="p-2 text-secondary hover:text-primary hover:bg-surface-container transition-all active:scale-95">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-secondary hover:text-primary hover:bg-surface-container transition-all active:scale-95">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
        <ul className="flex gap-8 overflow-x-auto w-full justify-center scrollbar-hide pb-1">
          {navItems.map((item) => (
            <li key={item}>
              <a
                href="#"
                className={`text-[11px] font-label font-medium uppercase tracking-widest block whitespace-nowrap transition-all active:scale-95 px-1 pb-1 ${
                  item === "NEWS"
                    ? "text-primary border-b-4 border-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
