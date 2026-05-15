---
title: Workflow d'invitation et liaison automatique HR-Employé
status: done
priority: high
type: feature
tags:
- onboarding
- invitation
- hr
created_by: agent
created_at: 2026-05-15 14:12:44+00:00
position: 20
---

## Notes
Créer système d'invitation : HR Manager invite employé → lien unique généré → employé s'inscrit automatiquement lié à l'entreprise et au RH.

## Checklist
- [x] Créer table "invitations" avec lien unique et code temporaire
- [x] Page "/hr/invite" - formulaire ajout employé
- [x] Génération lien unique + code (validité 7 jours)
- [x] Envoi email automatique avec lien
- [x] Page "/auth/signup-invite" - inscription via lien
- [x] Association automatique employé ↔ RH ↔ entreprise
- [x] Statuts invitation (envoyé, inscrit, actif, expiré)
- [x] Génération QR code pour inscription rapide
- [x] Dashboard RH : liste invitations avec statuts

## Acceptance
- HR peut inviter employé avec email automatique ✓
- Employé s'inscrit via lien et est automatiquement lié ✓
- Statuts d'invitation visibles dans dashboard RH ✓
