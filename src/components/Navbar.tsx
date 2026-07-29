import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeSwitch } from "./ThemeSwitch";

export function Navbar() {
  const { user, userProfile, signOut, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase();
    }
    if (userProfile?.email) {
      return userProfile.email[0].toUpperCase();
    }
    return "U";
  };

  // Avatar URL depuis Google ou profil
  const avatarUrl = user?.user_metadata?.avatar_url || 
                   user?.user_metadata?.picture || 
                   userProfile?.avatar_url;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    const handleRouteChange = () => setMobileMenuOpen(false);
    router.events?.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <nav className="fixed top-0 left-16 right-0 h-16 bg-[#0f1417]/95 backdrop-blur-sm border-b border-white/[0.06] z-50 flex items-center px-6">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo & App Name */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img 
              src="/workbridge_Logo.png" 
              alt="WorkBridge" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-bold text-[#f0f4f8] hidden sm:block">
            WorkBridge<span className="text-[#10b981]">De</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm text-[#8fa3b3] hover:text-[#f0f4f8] transition-colors"
          >
            Accueil
          </Link>
          <Link 
            href="/faq" 
            className="text-sm text-[#8fa3b3] hover:text-[#f0f4f8] transition-colors"
          >
            FAQ
          </Link>
          <Link 
            href="/pricing" 
            className="text-sm text-[#8fa3b3] hover:text-[#f0f4f8] transition-colors"
          >
            Tarifs
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Language & Theme Switches */}
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitch />
            <ThemeSwitch />
          </div>

          {/* Auth Buttons or User Menu */}
          {loading ? (
            // Loading state - skeleton
            <div className="flex items-center gap-2">
              <div className="w-24 h-9 bg-[#1c242b] rounded-lg animate-pulse"></div>
              <div className="w-24 h-9 bg-[#1c242b] rounded-lg animate-pulse"></div>
            </div>
          ) : user && userProfile ? (
            // Authenticated - Show Avatar with Dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                  <Avatar className="w-9 h-9 border-2 border-[#10b981]/30">
                    <AvatarImage src={avatarUrl} alt={userProfile.email} />
                    <AvatarFallback className="bg-gradient-to-br from-[#10b981] to-[#059669] text-white text-sm font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex items-center gap-2">
                    <span className="text-sm text-[#f0f4f8] max-w-[120px] truncate">
                      {userProfile.first_name || userProfile.email}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                      <span className="text-xs text-[#10b981] font-medium">En ligne</span>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1c242b] border-[rgba(255,255,255,0.06)]">
                <div className="px-3 py-2 border-b border-white/[0.06]">
                  <p className="text-sm font-medium text-[#f0f4f8]">
                    {userProfile.first_name} {userProfile.last_name}
                  </p>
                  <p className="text-xs text-[#8fa3b3] truncate">{userProfile.email}</p>
                  <p className="text-xs text-[#10b981] mt-1 capitalize">
                    {userProfile.role === "worker" ? "Travailleur" : "Gestionnaire RH"}
                  </p>
                </div>
                <DropdownMenuItem 
                  onClick={() => handleNavigation("/profile")}
                  className="text-[#f0f4f8] hover:bg-[#161c21] cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation(userProfile.role === "hr_manager" ? "/hr" : "/")}
                  className="text-[#f0f4f8] hover:bg-[#161c21] cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Tableau de bord
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation("/settings")}
                  className="text-[#f0f4f8] hover:bg-[#161c21] cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-[#ef4444] hover:bg-[#161c21] cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Not authenticated - Show Login & Sign Up buttons
            <>
              <Button
                onClick={() => router.push("/auth/login")}
                variant="outline"
                className="hidden sm:flex border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10 hover:text-[#10b981] rounded-lg h-9 px-4"
              >
                Se connecter
              </Button>
              <Button
                onClick={() => router.push("/auth/signup")}
                className="hidden sm:flex bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white rounded-lg h-9 px-4 shadow-lg shadow-[rgba(16,185,129,0.3)]"
              >
                S'inscrire
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#8fa3b3] hover:text-[#f0f4f8] transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0f1417] border-b border-white/[0.06] shadow-lg">
          <div className="flex flex-col p-4 space-y-3">
            {/* Navigation Links */}
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-[#8fa3b3] hover:text-[#f0f4f8] py-2 transition-colors"
            >
              Accueil
            </Link>
            <Link 
              href="/faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-[#8fa3b3] hover:text-[#f0f4f8] py-2 transition-colors"
            >
              FAQ
            </Link>
            <Link 
              href="/pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-[#8fa3b3] hover:text-[#f0f4f8] py-2 transition-colors"
            >
              Tarifs
            </Link>

            {/* Language & Theme */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
              <LanguageSwitch />
              <ThemeSwitch />
            </div>

            {/* Auth Buttons for Mobile */}
            {!loading && !user && (
              <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                <Button
                  onClick={() => {
                    router.push("/auth/login");
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10 hover:text-[#10b981] rounded-lg h-10"
                >
                  Se connecter
                </Button>
                <Button
                  onClick={() => {
                    router.push("/auth/signup");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white rounded-lg h-10 shadow-lg shadow-[rgba(16,185,129,0.3)]"
                >
                  S'inscrire
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}