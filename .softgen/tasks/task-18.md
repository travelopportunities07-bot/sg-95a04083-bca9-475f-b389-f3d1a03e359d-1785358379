---
title: Système de gestion documentaire complet
status: in_progress
priority: urgent
type: feature
tags: [documents, upload, download, storage]
created_by: agent
created_at: 2026-05-15T14:12:44Z
position: 18
---

## Notes
Activer toutes les fonctionnalités de gestion documentaire : upload, téléchargement, visualisation avec Supabase Storage.

## Checklist
- [ ] Configurer Supabase Storage bucket "documents"
- [ ] Créer service documentService.ts avec upload/download/delete
- [ ] Activer boutons "Hochladen" avec barre de progression
- [ ] Activer téléchargement sécurisé des documents
- [ ] Créer modal de visualisation PDF/images avec zoom
- [ ] Ajouter permissions (worker = ses docs, HR = tous docs assignés)
- [ ] Afficher métadonnées (nom, date, taille)
- [ ] Tests upload PDF, JPG, PNG

## Acceptance
- Boutons "Hochladen" fonctionnels avec upload réel vers Supabase
- Documents téléchargeables et visualisables
- Permissions sécurisées respectées