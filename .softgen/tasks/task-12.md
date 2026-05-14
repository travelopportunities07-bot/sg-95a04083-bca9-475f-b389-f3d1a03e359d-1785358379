---
title: Interactive Workflows for Home Actions
status: done
priority: urgent
type: feature
tags: [home, workflows, insurance, banking, courses]
created_by: agent
created_at: 2026-05-13T23:38:42Z
position: 12
---

## Notes
Create complete interactive workflows for the three main "Starten" buttons on Home:
1. Krankenversicherung abschließen - Health insurance application flow
2. Bankkonto eröffnen - Bank account opening flow
3. Deutschkurs buchen - German course booking flow

Each workflow needs dedicated pages with forms, document uploads, progress tracking, and status management.

## Checklist
- [x] Create /workflows/krankenversicherung page with insurance comparison (TK, AOK, Barmer, DAK)
- [x] Add insurance selection form (name, address, phone, email, employer, arrival date)
- [x] Create /workflows/bankkonto page with bank comparison (N26, Sparkasse, Deutsche Bank, Commerzbank)
- [x] Add bank account form with document upload (passport, Anmeldung, work contract)
- [x] Create /workflows/deutschkurs page with course levels (A1, A2, B1, B2)
- [x] Add course booking with format selection (Online, Präsenz, Hybrid) and calendar
- [x] Implement progress bars and status tracking for all workflows
- [x] Add confirmation messages and success states
- [x] Update Home page to link "Starten" buttons to new workflow pages

## Acceptance
- User can click "Starten" on any of the three features and access a complete guided workflow
- Each workflow saves progress and shows status (Nicht begonnen, In Bearbeitung, Abgeschlossen)
- Users receive confirmation messages upon completion