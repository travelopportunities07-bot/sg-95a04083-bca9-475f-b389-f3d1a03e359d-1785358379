---
title: "Implémenter le système de notifications"
status: "done"
priority: "medium"
type: "feature"
tags: ["notifications", "email", "toast"]
created_by: "agent"
created_at: "2026-04-17T21:00:00Z"
position: 8
---

## Notes
Système de notifications avec toast UI (shadcn) + API email mock (prêt pour Resend/SendGrid).

## Checklist
- [x] Créer le module notifications.ts avec fonctions helper (success, error, warning, etc.)
- [x] Intégrer les toast notifications dans TaskChecklist (complétion de tâche)
- [x] Créer l'API route /api/send-reminder pour l'envoi d'emails
- [x] Ajouter les notifications spécifiques (taskCompleted, documentValidated, etc.)
- [x] Créer l'interface HR pour envoyer des rappels manuels
- [x] Tester l'envoi d'emails de rappel