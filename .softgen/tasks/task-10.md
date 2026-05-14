---
title: "Implémenter le mode sombre/clair"
status: "done"
priority: "medium"
type: "feature"
tags: ["theme", "dark-mode"]
created_by: "agent"
created_at: "2026-04-17T21:30:00Z"
position: 10
---

## Notes
Toggle pour basculer entre mode clair et mode sombre avec persistance localStorage.

## Checklist
- [x] Créer le ThemeContext pour gérer le thème global
- [x] Créer le composant ThemeSwitch (toggle Sun/Moon)
- [x] Appliquer la classe .dark au <html> quand mode sombre activé
- [x] Vérifier que toutes les couleurs CSS utilisent les tokens HSL (déjà définis dans globals.css)
- [x] Ajouter le toggle dans les paramètres/profil
- [x] Persister la préférence dans localStorage
- [x] Tester tous les écrans en mode sombre