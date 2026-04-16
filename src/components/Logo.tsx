export default function Logo({ light = false }: { light?: boolean }) {
  const textColor = light ? "text-white" : "text-primary";
  const lineColor = light ? "bg-white/30" : "bg-primary/20";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-base md:text-lg font-body font-bold tracking-tight leading-none ${textColor}`}>
        Ghana Network News
      </span>
      <div className="flex items-center w-full gap-3">
        <div className={`h-[1px] flex-1 ${lineColor}`}></div>
        <span className={`text-3xl md:text-4xl font-body font-black italic tracking-tighter leading-none ${textColor}`}>
          GNN
        </span>
        <div className={`h-[1px] flex-1 ${lineColor}`}></div>
      </div>
      <span className={`text-[10px] md:text-xs font-body italic tracking-wider opacity-80 ${textColor}`}>
        Global Perspective, Ghanaian Insight
      </span>
    </div>
  );
}
