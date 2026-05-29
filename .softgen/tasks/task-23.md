---
title: Journal d'activité HR
status: todo
priority: medium
type: feature
tags: [hr, tracking, audit]
created_by: agent
created_at: 2026-05-29
position: 23
---

## Notes
Créer un système de journal d'activité pour tracer toutes les actions importantes des HR Managers (invitations, validations documents, rappels envoyés, modifications profils).

## Checklist
- [ ] Créer table activity_logs (user_id, action_type, target_user, details, timestamp)
- [ ] Créer service activityService.ts pour logger les actions
- [ ] Intégrer le logging dans invitationService, documentService
- [ ] Créer page /hr/activity avec liste filtrée/paginée
- [ ] Ajouter filtres par type d'action et date
- [ ] Ajouter i18n pour types d'actions

## Acceptance
- Toutes les actions HR sont tracées dans activity_logs
- La page /hr/activity affiche l'historique complet
- Les filtres fonctionnent correctement