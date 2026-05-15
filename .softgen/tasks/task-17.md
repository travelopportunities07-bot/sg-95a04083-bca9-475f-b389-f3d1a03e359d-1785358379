---
title: "Fix Navigation - Back Buttons and Worker Pages"
status: done
priority: urgent
type: bug
tags: ["navigation", "bug-fix", "worker-pages"]
created_by: agent
created_at: 2026-05-15T14:52:42Z
position: 17
---

## Notes
User reported navigation issues:
1. Back buttons (ArrowLeft) not working - clicking takes to previous route instead of browser history
2. /tasks and /documents pages missing - bottom nav links broken

Root cause: Back buttons using `router.push("/")` instead of `router.back()`. Worker pages need to be created with full TaskChecklist and DocumentManager components.

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
