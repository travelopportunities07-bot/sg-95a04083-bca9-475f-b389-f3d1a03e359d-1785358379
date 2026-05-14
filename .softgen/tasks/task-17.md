---
title: Fix Navigation - Back Buttons and Worker Pages
status: done
priority: urgent
type: bug
tags: [navigation, routing, worker]
created_by: agent
created_at: 2026-05-14T01:42:00Z
position: 17
---

## Notes
Two critical navigation fixes:
1. Update all ArrowLeft back buttons to use router.back() instead of hardcoded routes
2. Create dedicated pages for /tasks and /documents (currently accessed from bottom nav but pages don't exist)

Files to update with router.back():
- profile.tsx
- faq.tsx
- workflows (krankenversicherung, bankkonto, deutschkurs)
- hr pages (employees, reminders, settings)

Pages to create:
- /tasks → TaskChecklist component
- /documents → DocumentManager component

## Checklist
- [x] Update profile.tsx ArrowLeft to use router.back()
- [x] Update faq.tsx ArrowLeft to use router.back()
- [x] Update workflow pages ArrowLeft to use router.back()
- [x] Update HR pages ArrowLeft to use router.back()
- [x] Create /tasks page with TaskChecklist component
- [x] Create /documents page with DocumentManager component
- [x] Verify all navigation flows work correctly

## Acceptance
- All back buttons navigate to the previous page in history
- /tasks and /documents pages are accessible from bottom navigation
- Worker can access full task checklist and document manager