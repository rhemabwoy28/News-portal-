import { motion } from "motion/react";

export default function BreakingNews() {
  const news = [
    "PARLIAMENT APPROVES INFRASTRUCTURE BILL BY NARROW MARGIN",
    "CENTRAL BANK SIGNALS POTENTIAL INTEREST RATE HIKE IN Q3",
    "NEW HYDROELECTRIC INITIATIVE ANNOUNCED FOR NORTHERN REGIONS",
    "COASTAL HIGHWAY EXPANSION TO BEGIN CONSTRUCTION NEXT MONTH"
  ];

  return (
    <div className="bg-primary text-white overflow-hidden py-2 border-y border-white/10 relative z-40">
      <div className="flex items-center">
        <div className="bg-white text-primary font-headline font-black text-[10px] tracking-tighter px-3 py-1 mr-4 shrink-0 italic z-10 shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
          BREAKING
        </div>
        <div className="flex whitespace-nowrap overflow-hidden group">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-12 items-center"
          >
            {/* Double the news for continuous loop */}
            {[...news, ...news].map((item, index) => (
              <span 
                key={index} 
                className="font-body text-sm font-bold tracking-wide italic uppercase inline-flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
