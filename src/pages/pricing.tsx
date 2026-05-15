import { useState } from "react";
import { Check, Shield, Server, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfekt für kleine Teams",
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        "Bis zu 10 Mitarbeiter",
        "Basis-Checklisten",
        "Dokumenten-Upload",
        "E-Mail-Support",
        "Erinnerungen",
        "Mobile App"
      ],
      cta: "Kostenlos testen",
      highlighted: false
    },
    {
      name: "Professional",
      description: "Am beliebtesten für wachsende Teams",
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        "Bis zu 50 Mitarbeiter",
        "Alle Starter-Features",
        "KI-Assistent",
        "Automatische Workflows",
        "Prioritäts-Support",
        "Erweiterte Analytics",
        "Custom Branding",
        "API-Zugang"
      ],
      cta: "Professional wählen",
      highlighted: true
    },
    {
      name: "Business",
      description: "Für etablierte Unternehmen",
      monthlyPrice: 149,
      annualPrice: 1490,
      features: [
        "Bis zu 200 Mitarbeiter",
        "Alle Professional-Features",
        "Dedizierter Success Manager",
        "Erweiterte Integrationen",
        "White-Label Option",
        "SSO & SAML",
        "SLA 99,9%",
        "Audit Logs"
      ],
      cta: "Business wählen",
      highlighted: false
    },
    {
      name: "Enterprise",
      description: "Maßgeschneiderte Lösung",
      monthlyPrice: null,
      annualPrice: null,
      features: [
        "Unbegrenzte Mitarbeiter",
        "Alle Business-Features",
        "On-Premise Option",
        "24/7 Premium Support",
        "Individuelle Anpassungen",
        "Schulungen & Workshops",
        "Rechtliche Beratung",
        "Persönlicher Account Manager"
      ],
      cta: "Kontakt aufnehmen",
      highlighted: false
    }
  ];

  const comparisonFeatures = [
    {
      category: "Grundfunktionen",
      features: [
        { name: "Mitarbeiter-Checklisten", starter: true, professional: true, business: true, enterprise: true },
        { name: "Dokumenten-Management", starter: true, professional: true, business: true, enterprise: true },
        { name: "E-Mail-Erinnerungen", starter: true, professional: true, business: true, enterprise: true },
        { name: "Mobile App", starter: true, professional: true, business: true, enterprise: true }
      ]
    },
    {
      category: "Erweiterte Features",
      features: [
        { name: "KI-Assistent", starter: false, professional: true, business: true, enterprise: true },
        { name: "Automatische Workflows", starter: false, professional: true, business: true, enterprise: true },
        { name: "Advanced Analytics", starter: false, professional: true, business: true, enterprise: true },
        { name: "API-Zugang", starter: false, professional: true, business: true, enterprise: true }
      ]
    },
    {
      category: "Enterprise Features",
      features: [
        { name: "SSO & SAML", starter: false, professional: false, business: true, enterprise: true },
        { name: "White-Label", starter: false, professional: false, business: true, enterprise: true },
        { name: "Dedizierter Manager", starter: false, professional: false, business: true, enterprise: true },
        { name: "On-Premise Option", starter: false, professional: false, business: false, enterprise: true }
      ]
    }
  ];

  return (
    <Layout>
      <SEO
        title="Preise & Pläne - WorkBridgeDe"
        description="Transparente Preise für jede Teamgröße. Starten Sie kostenlos und skalieren Sie mit Ihrem Team."
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-background to-secondary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            Transparente Preise
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Wählen Sie Ihren Plan
          </h1>
          <p className="text-lg text-muted mb-8">
            Transparente Preise für jede Teamgröße. Keine versteckten Kosten.
          </p>

          {/* Annual Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted"}`}>
              Monatlich
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted"}`}>
              Jährlich
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2 bg-success/10 text-success">
                2 Monate gratis
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative p-6 flex flex-col transition-all duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? "border-primary shadow-lg scale-105 md:scale-110"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Beliebt
                </Badge>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.monthlyPrice ? (
                  <>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-primary">
                        €{isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                      </span>
                      <span className="text-muted ml-2">/Monat</span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-muted mt-1">
                        €{plan.annualPrice} jährlich abgerechnet
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-3xl font-bold text-foreground">Individuell</div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-secondary hover:bg-secondary/90"
                }`}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-secondary/5 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Detaillierter Funktionsvergleich
            </h2>

            <div className="bg-background rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/10">
                      <th className="text-left p-4 font-semibold text-foreground">Features</th>
                      <th className="text-center p-4 font-semibold text-foreground">Starter</th>
                      <th className="text-center p-4 font-semibold text-primary bg-primary/5">Professional</th>
                      <th className="text-center p-4 font-semibold text-foreground">Business</th>
                      <th className="text-center p-4 font-semibold text-foreground">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((category) => (
                      <>
                        <tr key={category.category} className="bg-muted/5">
                          <td colSpan={5} className="p-3 font-semibold text-sm text-muted">
                            {category.category}
                          </td>
                        </tr>
                        {category.features.map((feature) => (
                          <tr key={feature.name} className="border-b border-border hover:bg-muted/5 transition-colors">
                            <td className="p-4 text-sm text-foreground">{feature.name}</td>
                            <td className="p-4 text-center">
                              {feature.starter ? (
                                <Check className="w-5 h-5 text-success mx-auto" />
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td className="p-4 text-center bg-primary/5">
                              {feature.professional ? (
                                <Check className="w-5 h-5 text-primary mx-auto" />
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {feature.business ? (
                                <Check className="w-5 h-5 text-success mx-auto" />
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {feature.enterprise ? (
                                <Check className="w-5 h-5 text-success mx-auto" />
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Sicherheit & Vertrauen
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">DSGVO-Konform</h3>
                <p className="text-sm text-muted">
                  100% DSGVO-konform. Alle Daten werden nach deutschen Datenschutzstandards verarbeitet.
                </p>
              </Card>

              <Card className="p-6 text-center border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">EU-Hosting</h3>
                <p className="text-sm text-muted">
                  Hosting ausschließlich in deutschen und europäischen Rechenzentren für maximale Datensicherheit.
                </p>
              </Card>

              <Card className="p-6 text-center border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Bank-Level Sicherheit</h3>
                <p className="text-sm text-muted">
                  End-to-End-Verschlüsselung und regelmäßige Sicherheitsaudits durch unabhängige Experten.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-primary to-secondary py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bereit, loszulegen?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Starten Sie noch heute mit einer 14-tägigen kostenlosen Testphase. Keine Kreditkarte erforderlich.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Kostenlos testen
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                Demo buchen
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-6">
              Alle Pläne beinhalten eine 30-Tage-Geld-zurück-Garantie
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}