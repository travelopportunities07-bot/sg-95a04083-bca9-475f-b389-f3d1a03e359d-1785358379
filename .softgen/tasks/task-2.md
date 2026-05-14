---
title: "Créer la vue Checklist Interactive (Aufgaben)"
status: "done"
priority: "high"
type: "feature"
tags: ["worker", "checklist", "tasks"]
created_by: "agent"
created_at: "2026-04-17T20:30:00Z"
position: 2
---

## Notes
Implémentation de l'écran Checklist (Aufgaben) pour le rôle Worker, selon la section 4.2.
Permet d'afficher les tâches groupées par catégories avec un système d'accordéons.

## Checklist
- [x] Mettre à jour `index.tsx` ou `WorkerDashboard.tsx` pour gérer la navigation interne (onglets: Home, Aufgaben, Dokumente, etc.)
- [x] Créer un composant `TaskChecklist.tsx`
- [x] Implémenter le système d'accordéons par catégorie (Gesundheit, Finanzen, etc.)
- [x] Afficher chaque tâche avec sa checkbox, son titre, badge XP, badge urgence
- [x] Implémenter un état local mocké pour simuler la complétion de tâche avec animation