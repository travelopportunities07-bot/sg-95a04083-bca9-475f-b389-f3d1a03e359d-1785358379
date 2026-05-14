import { Search } from "lucide-react";
import { useRouter } from "next/router";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title = "Dashboard", subtitle, actions }: TopbarProps) {
  const router = useRouter();

  return (
    <div className="h-[60px] flex items-center px-7 gap-4 border-b border-white/[0.06] bg-[#0f1417] sticky top-0 z-50">
      <div className="flex-1">
        <h1 className="font-display text-base font-semibold text-[#f0f4f8]">{title}</h1>
        {subtitle && <p className="text-xs text-[#8fa3b3] mt-0.5">{subtitle}</p>}
      </div>
      
      <button className="flex items-center gap-2 bg-[#1c242b] border border-white/[0.06] rounded-full px-4 py-1.5 text-[13px] text-[#566878] hover:border-white/[0.10] transition-colors w-[220px]">
        <Search size={14} className="opacity-50" />
        <span>Suchen…</span>
      </button>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}