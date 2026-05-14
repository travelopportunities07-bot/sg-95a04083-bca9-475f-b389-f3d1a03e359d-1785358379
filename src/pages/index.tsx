import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Trophy, Star, Calendar, CheckCircle, Heart, CreditCard, Globe } from "lucide-react";

export default function Home() {
  return (
    <>
      <Topbar title="Dashboard" />
      
      <div className="p-7">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2d22] via-[#0a1f17] to-[#071812] border border-[rgba(16,185,129,0.3)] p-8 mb-6">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_70%)]" />
          <div className="absolute bottom-[-60px] right-[120px] w-[160px] h-[160px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.06),transparent_70%)]" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#34d399] tracking-wider uppercase mb-1.5">Willkommen zurück</div>
              <h2 className="font-display text-[26px] font-bold text-[#f0f4f8] mb-1">Jean D. 🇨🇲</h2>
              <p className="text-[13px] text-[#8fa3b3] mb-4">Dein Guide durch die deutsche Bürokratie</p>
              <div className="inline-flex items-center gap-1.5 bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] rounded-full px-3.5 py-1 text-xs font-medium text-[#34d399]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                Fortgeschritten · Level 3
              </div>
            </div>
            <div className="w-[120px] h-[100px] flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)]" style={{width: 76, height: 76, left: 22, top: 12}} />
                <div className="absolute rounded-full bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)]" style={{width: 52, height: 52, left: 34, top: 24}} />
                <Trophy className="relative z-10 text-[#10b981]" size={60} style={{left: 30, top: 20}} />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="bg-[#161c21] border-white/[0.06] p-6 mb-6">
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-medium text-[15px] text-[#f0f4f8]">Gesamtfortschritt</span>
            <span className="font-display text-xl font-bold text-[#10b981]">62%</span>
          </div>
          <div className="h-2 bg-[#222c35] rounded overflow-hidden mb-2">
            <div className="relative h-full w-[62%] bg-gradient-to-r from-[#059669] to-[#34d399] rounded">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399]" />
            </div>
          </div>
          <p className="text-xs text-[#566878]">5 von 8 Aufgaben erledigt</p>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-[#161c21] border-white/[0.06] p-5 hover:border-white/[0.10] hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center mb-3">
              <CheckCircle className="text-[#10b981]" size={16} />
            </div>
            <div className="font-display text-[28px] font-bold text-[#f0f4f8] leading-none mb-1">3</div>
            <div className="text-xs text-[#566878]">Aufgaben</div>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1200] to-[#201700] border-[rgba(245,158,11,0.3)] p-5 hover:border-[rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-[rgba(245,158,11,0.12)] flex items-center justify-center mb-3">
              <Star className="text-[#f59e0b]" size={16} />
            </div>
            <div className="font-display text-[28px] font-bold text-[#f59e0b] leading-none mb-1">340</div>
            <div className="text-xs text-[#566878]">XP</div>
          </Card>

          <Card className="bg-gradient-to-br from-[#0d1a2e] to-[#0f2040] border-[rgba(59,130,246,0.25)] p-5 hover:border-[rgba(59,130,246,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-[rgba(59,130,246,0.10)] flex items-center justify-center mb-3">
              <Calendar className="text-[#3b82f6]" size={16} />
            </div>
            <div className="font-display text-[28px] font-bold text-[#3b82f6] leading-none mb-1">12</div>
            <div className="text-xs text-[#566878]">Tage aktiv</div>
          </Card>
        </div>

        {/* Tasks Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="font-display text-[22px] font-semibold text-[#f0f4f8]">Nächste Aufgaben</div>
            <Link href="/tasks" className="text-[13px] text-[#10b981] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Alle anzeigen →
            </Link>
          </div>

          <div className="space-y-2">
            <Card className="bg-[#161c21] border-white/[0.06] border-l-[3px] border-l-[#f59e0b] p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a0a0a] to-[#2a1010] flex items-center justify-center flex-shrink-0">
                <Heart className="text-[#f87171]" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">Krankenversicherung abschließen</h3>
                <p className="text-xs text-[#566878]">Gesundheit</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-[#566878] flex items-center gap-1">
                    <Calendar size={10} /> 3 Tage
                  </span>
                  <Badge className="bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border-[rgba(245,158,11,0.3)] text-[10px] px-2 py-0.5">URGENT</Badge>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#10b981] bg-[rgba(16,185,129,0.15)] rounded-full px-2 py-1">+40 XP</span>
              <Button size="sm" className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-8 px-4 text-xs">Starten</Button>
            </Card>

            <Card className="bg-[#161c21] border-white/[0.06] p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0a1a10] to-[#0f2418] flex items-center justify-center flex-shrink-0">
                <CreditCard className="text-[#10b981]" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">Bankkonto eröffnen</h3>
                <p className="text-xs text-[#566878]">Finanzen</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-[#566878] flex items-center gap-1">
                    <Calendar size={10} /> 7 Tage
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#10b981] bg-[rgba(16,185,129,0.15)] rounded-full px-2 py-1">+30 XP</span>
              <Button size="sm" className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-8 px-4 text-xs">Starten</Button>
            </Card>

            <Card className="bg-[#161c21] border-white/[0.06] p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0a0f1a] to-[#101828] flex items-center justify-center flex-shrink-0">
                <Globe className="text-[#3b82f6]" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">Deutschkurs buchen</h3>
                <p className="text-xs text-[#566878]">Integration</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-[#566878] flex items-center gap-1">
                    <Calendar size={10} /> 14 Tage
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#10b981] bg-[rgba(16,185,129,0.15)] rounded-full px-2 py-1">+30 XP</span>
              <Button size="sm" className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-8 px-4 text-xs">Starten</Button>
            </Card>
          </div>
        </div>

        {/* Badges Section */}
        <div>
          <div className="font-display text-[22px] font-semibold text-[#f0f4f8] mb-5">🏅 Deine Abzeichen</div>
          <div className="flex gap-3 flex-wrap">
            <Card className="bg-gradient-to-br from-[#1a1200] to-[#201700] border-[rgba(245,158,11,0.3)] p-3.5 text-center w-[90px] hover:border-[rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="text-[28px] mb-1.5">🏁</div>
              <div className="text-[10px] text-[#566878] font-medium">Starter</div>
            </Card>
            <Card className="bg-gradient-to-br from-[#1a1200] to-[#201700] border-[rgba(245,158,11,0.3)] p-3.5 text-center w-[90px] hover:border-[rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="text-[28px] mb-1.5">📋</div>
              <div className="text-[10px] text-[#566878] font-medium">Task Hunter</div>
            </Card>
            <Card className="bg-[#161c21] border-white/[0.06] p-3.5 text-center w-[90px] opacity-45 hover:opacity-60 transition-opacity cursor-not-allowed">
              <div className="text-[28px] mb-1.5">📄</div>
              <div className="text-[10px] text-[#566878] font-medium">Doc Master</div>
            </Card>
            <Card className="bg-[#161c21] border-white/[0.06] p-3.5 text-center w-[90px] opacity-45 hover:opacity-60 transition-opacity cursor-not-allowed">
              <div className="text-[28px] mb-1.5">🏠</div>
              <div className="text-[10px] text-[#566878] font-medium">Angemeldet</div>
            </Card>
            <Card className="bg-gradient-to-br from-[#1a1200] to-[#201700] border-[rgba(245,158,11,0.3)] p-3.5 text-center w-[90px] hover:border-[rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="text-[28px] mb-1.5">💪</div>
              <div className="text-[10px] text-[#566878] font-medium">On the Way</div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}