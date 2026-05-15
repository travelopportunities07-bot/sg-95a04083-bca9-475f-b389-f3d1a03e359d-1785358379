---
title: Système de gestion documentaire complet
status: done
priority: urgent
type: feature
tags: [documents, upload, storage]
created_by: agent
created_at: 2026-05-15T14:18:00Z
position: 18
---

## Notes
Système complet de gestion documentaire avec upload, visualisation et téléchargement.
Implémentation de DocumentUpload et DocumentViewer.
Configuration Supabase Storage avec RLS.

## Checklist
- [x] Créer bucket Supabase "documents" avec RLS
- [x] Créer table documents en base de données
- [x] Créer composant DocumentUpload avec barre de progression
- [x] Créer composant DocumentViewer avec zoom et fullscreen
- [x] Intégrer dans page documents.tsx
- [x] Intégrer dans TaskChecklist avec dialog d'upload
- [x] Ajouter permissions sécurisées (worker = ses docs, HR = tous)

## Acceptance
- Bouton "Hochladen" fonctionnel avec upload vers Supabase
- Documents téléchargeables et visualisables
- Permissions sécurisées respectées