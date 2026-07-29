import { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  Home, 
  CheckCircle, 
  FileText, 
  HelpCircle, 
  Bell, 
  User, 
  LayoutDashboard, 
  Users, 
  Clock, 
  Settings, 
  LucideIcon, 
  DollarSign, 
  Activity,
  FileBarChart,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  view?: "employee" | "hr";
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  tooltip: string;
  badge?: number;
}

export function Layout({ children, view = "employee" }: LayoutProps) {
  const router = useRouter();
  const [notificationCount] = useState(2);

  const isActive = (path: string) => router.pathname === path;

  const employeeNav: NavItem[] = [
    { icon: Home, label: "Home", path: "/", tooltip: "Home" },
    { icon: CheckCircle, label: "Aufgaben", path: "/tasks", tooltip: "Aufgaben" },
    { icon: FileText, label: "Dokumente", path: "/documents", tooltip: "Dokumente" },
    { icon: Activity, label: "Aktivität", path: "/activity", tooltip: "Aktivitätsverlauf" },
    { icon: HelpCircle, label: "FAQ", path: "/faq", tooltip: "FAQ" },
    { icon: DollarSign, label: "Pricing", path: "/pricing", tooltip: "Pricing" },
  ];

  const hrNav: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/hr", tooltip: "Dashboard" },
    { icon: Users, label: "Mitarbeiter", path: "/hr/employees", tooltip: "Mitarbeiter" },
    { icon: FileBarChart, label: "Reports", path: "/hr/reports", tooltip: "Berichte" },
    { icon: AlertTriangle, label: "Alerts", path: "/hr/alerts", tooltip: "Warnungen", badge: 3 },
    { icon: Calendar, label: "Abwesenheit", path: "/hr/absences", tooltip: "Abwesenheiten" },
    { icon: Clock, label: "Erinnerungen", path: "/hr/reminders", tooltip: "Erinnerungen" },
    { icon: Activity, label: "Aktivität", path: "/hr/activity", tooltip: "Aktivitätsverlauf" },
    { icon: Settings, label: "Einstellungen", path: "/hr/settings", tooltip: "Einstellungen" },
  ];

  const navItems = view === "hr" ? hrNav : employeeNav;

  return (
    <div className="flex min-h-screen bg-[#0a0d0f]">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-16 bg-[#0f1417] border-r border-white/[0.06] flex flex-col items-center py-5 gap-2 z-100">
        {/* Logo */}
        <Link 
          href="/"
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform overflow-hidden"
        >
          <img 
            src="/workbridge_Logo.png" 
            alt="WorkBridge" 
            className="w-full h-full object-contain"
          />
        </Link>

        {/* Nav Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                active
                  ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]"
                  : "text-[#566878] hover:bg-[#1c242b] hover:text-[#8fa3b3]"
              }`}
              title={item.tooltip}
            >
              <Icon size={18} />
              {active && (
                <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#10b981] rounded-r-sm" />
              )}
              {item.badge && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#ef4444] text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <Link
            href="/notifications"
            className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              isActive("/notifications")
                ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]"
                : "text-[#566878] hover:bg-[#1c242b] hover:text-[#8fa3b3]"
            }`}
            title="Benachrichtigungen"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#ef4444] text-white text-[9px] font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-xs font-semibold text-white cursor-pointer hover:scale-105 transition-transform"
            title="Profil"
          >
            JD
          </Link>
        </div>
      </nav>

      {/* Main Content with top padding for navbar */}
      <div className="ml-16 flex-1 flex flex-col pt-16">
        {children}
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f1417] border-t border-white/[0.06] flex items-center justify-around z-100">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                active ? "text-[#10b981]" : "text-[#566878]"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            isActive("/profile") ? "text-[#10b981]" : "text-[#566878]"
          }`}
        >
          <User size={20} />
          <span className="text-[10px] font-medium">Profil</span>
        </Link>
      </nav>
    </div>
  );
}