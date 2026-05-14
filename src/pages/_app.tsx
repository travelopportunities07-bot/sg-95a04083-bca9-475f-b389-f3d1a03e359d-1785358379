import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Determine if we need layout
  const noLayoutPages = ["/auth/login", "/auth/signup"];
  const isHrPage = router.pathname.startsWith("/hr");
  const needsLayout = !noLayoutPages.includes(router.pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          {needsLayout ? (
            <Layout view={isHrPage ? "hr" : "employee"}>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
          <Toaster />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}