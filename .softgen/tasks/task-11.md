---
title: "Ajouter l'export PDF des documents"
status: "done"
priority: "medium"
type: "feature"
tags: ["pdf", "export", "documents"]
created_by: "agent"
created_at: "2026-04-17T21:30:00Z"
position: 11
---

## Notes
Fonctionnalité d'export PDF pour générer un fichier PDF contenant tous les documents validés de l'utilisateur.

## Checklist
- [x] Installer la librairie jsPDF
- [x] Créer l'API route /api/export-pdf
- [x] Implémenter la génération PDF avec logo WorkBridgeDe, liste des documents validés, dates de validation
- [x] Ajouter le bouton "Export PDF" dans DocumentManager
- [x] Afficher un loader pendant la génération
- [x] Télécharger automatiquement le PDF généré
- [x] Tester avec plusieurs documents