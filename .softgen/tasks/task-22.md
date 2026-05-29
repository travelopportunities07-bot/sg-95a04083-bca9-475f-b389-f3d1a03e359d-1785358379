---
title: Système de réinitialisation de mot de passe
status: done
priority: high
type: feature
tags: [auth, security]
created_by: agent
created_at: 2026-05-29
position: 22
---

## Notes
Implémenter un flux complet de réinitialisation de mot de passe pour les utilisateurs qui ont oublié leurs identifiants.

## Checklist
- [x] Créer page /auth/forgot-password (formulaire email)
- [x] Créer page /auth/reset-password (nouveau mot de passe)
- [x] Configurer Supabase Auth pour les emails de réinitialisation
- [x] Ajouter lien "Mot de passe oublié ?" sur page login
- [x] Ajouter messages de succès/erreur avec i18n
- [x] Tester le flux complet

## Acceptance
- L'utilisateur peut demander une réinitialisation depuis /auth/login
- Un email avec lien de réinitialisation est reçu
- Le nouveau mot de passe est sauvegardé et fonctionnel