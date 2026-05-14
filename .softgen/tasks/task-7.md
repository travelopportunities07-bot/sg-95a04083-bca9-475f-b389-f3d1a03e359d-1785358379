---
title: "Intégrer OpenAI pour l'Assistant IA"
status: "done"
priority: "high"
type: "feature"
tags: ["ai", "openai", "chat"]
created_by: "agent"
created_at: "2026-04-17T21:00:00Z"
position: 7
---

## Notes
Assistant IA avec OpenAI GPT-4o-mini, prompt système spécialisé pour l'administration allemande.

## Checklist
- [x] Créer l'API route /api/chat pour communiquer avec OpenAI
- [x] Implémenter le prompt système spécialisé (administration DE, langue simple A2-B1)
- [x] Créer le composant AIAssistant avec interface chat
- [x] Ajouter les questions suggérées (Anmeldung, Krankenversicherung, etc.)
- [x] Implémenter l'historique de conversation avec timestamps
- [x] Gérer les erreurs API (fallback si OpenAI indisponible)
- [x] Ajouter l'onglet Assistant dans la navigation Worker