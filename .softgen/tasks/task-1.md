---
title: "Créer le Dashboard HR Manager"
status: "done"
priority: "high"
type: "feature"
tags: ["hr", "dashboard", "kpis"]
created_by: "agent"
created_at: "2026-04-17T20:30:00Z"
position: 1
---

## Notes
Implémentation de l'écran principal pour le rôle HR Manager, conformément à la section 5.1 du document de spécifications.
Il permet de suivre plusieurs travailleurs, d'avoir des alertes urgentes et de voir la progression de l'équipe.

## Checklist
- [x] Créer le composant `HRDashboard.tsx`
- [x] Implémenter le Header ("HR Dashboard" avec stat de suivi)
- [x] Créer les 4 KPI cards (Ø Integration, Überfällige Aufgaben, Fehlende Dokumente, Dringende Warnungen) avec couleurs d'alerte (fond rouge/orange si urgent)
- [x] Ajouter la section Alertes Urgentes (employés nécessitant une action)
- [x] Ajouter la section Liste Employés (aperçu avec cards de progression)
- [x] Lier ce dashboard dans `pages/index.tsx` quand le rôle HR est sélectionné