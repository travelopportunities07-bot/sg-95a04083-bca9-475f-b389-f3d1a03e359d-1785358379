# WorkBridgeDe

## Vision
Application web mobile-first pour accompagner les travailleurs étrangers (Fachkraft/Azubi) dans leurs démarches administratives en Allemagne, avec suivi à distance par HR Managers.

## Design
Inspiré de Notion (clarté), Duolingo (gamification), N26 (confiance allemande moderne).

**Couleurs** (Palette verte distinctive):
- `--primary: 158 65% 30%` (deep green #1F7A63) — CTAs, accents, header
- `--secondary: 156 55% 48%` (lighter green #2E8B6C) — hover, backgrounds
- `--background: 140 25% 97%` (off-white #F5F7F6) — fond principal
- `--foreground: 215 25% 17%` (dark slate #1E293B) — textes
- `--muted: 215 16% 47%` (gray #64748B) — textes secondaires
- `--accent: 217 91% 60%` (blue #3B82F6) — liens, icônes actives
- `--success: 142 71% 45%` (green #22C55E) — validations
- `--destructive: 0 84% 60%` (red #EF4444) — erreurs, urgent
- `--warning: 38 92% 50%` (orange #F59E0B) — alertes

**Typographie**:
- Headings: Inter Bold 28-32px (#1E293B)
- Sections: Inter SemiBold 18-20px (#1F7A63)
- Body: Inter Regular 14-16px (#1E293B)
- Secondary: Inter Regular 12-13px (#64748B)
- Font fallback: system-ui, sans-serif

**Style**: Minimaliste, professionnel, mobile-first. Espaces généreux (16px padding cards), radius 16px, ombres subtiles.

## Features
1. **Dual Dashboards**: Worker (checklist gamifiée) + HR Manager (suivi équipe)
2. **Smart Checklist**: 6 catégories (Gesundheit, Integration, Anmeldung, Finanzen, Steuern, Arbeit), progression XP
3. **Document Management**: Upload, validation/rejet par HR, statuts colorés
4. **Automated Reminders**: Push + email, manuel/automatique
5. **AI Assistant**: OpenAI GPT-4 pour questions administratives (DE/EN)
6. **Timeline Auto**: Tâches déclenchées selon date d'arrivée
7. **Gamification**: Badges, XP, animations confetti
8. **i18n**: Allemand/Anglais