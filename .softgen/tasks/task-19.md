---
title: Bouton "Erledigt" et système de statuts
status: todo
priority: high
type: feature
tags: [tasks, status, completion]
created_by: agent
created_at: 2026-05-15T14:12:44Z
position: 19
---

## Notes
Ajouter bouton "Erledigt" à côté de "Starten" pour marquer les tâches comme terminées avec confirmation et mise à jour visuelle.

## Checklist
- [ ] Ajouter colonne "completed_at" à table tasks
- [ ] Créer bouton "Erledigt" avec confirmation modal
- [ ] Implémenter logique de changement de statut
- [ ] Désactiver "Starten" quand "Erledigt" actif
- [ ] Animations et changements visuels (vert = erledigt)
- [ ] Synchroniser statuts avec dashboard RH
- [ ] Afficher progression globale par employé

## Acceptance
- Bouton "Erledigt" fonctionnel avec confirmation
- Statuts synchronisés entre worker et HR dashboards
- Interface mise à jour avec animations fluides