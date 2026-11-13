---
name: accessible-keyboard-navigation-aria-audit
description: >-
  Use this skill when auditing or implementing WCAG 2.1 AA accessibility, ARIA dialog roles,
  modal focus traps, roving tabindex for lists, and 4.5:1 color contrast ratios.
---

# Accessible Keyboard Navigation & ARIA Audit (Subatomic Skill)

Governs accessibility (a11y) compliance across all interactive UI components in `@workspace/ui`, ensuring strict adherence to WCAG 2.1 AA standards.

## Accessibility Requirements & Focus Traps

1. **Keyboard Operability**:
   - Every interactive element (buttons, dropdowns, modal dialogs, tab panels) must be focusable via the `Tab` key and operable via `Enter` / `Space`.
   - Modals and dialogs must implement focus traps: pressing `Tab` on the last element wraps around to the first element; pressing `Escape` dismisses the modal and returns focus to the trigger.
2. **Semantic ARIA Attributes**:
   - Buttons without text must possess an explicit `aria-label`:
     ```tsx
     <button aria-label="Close dialog" onClick={onClose}>
       <X className="size-4" />
     </button>
     ```
   - Tabs and accordion components must declare `role="tab"`, `aria-selected="true|false"`, and `aria-controls="panel-id"`.
3. **Contrast Ratios**:
   - Standard body text must maintain a minimum contrast ratio of **4.5:1** against its canvas.
   - Large headings ($\ge 18\text{pt}$ or $14\text{pt bold}$) must maintain at least **3:0:1**.

## Roving Tabindex Pattern for Lists
For list navigation (e.g. Surah picker, command palette):
```typescript
function handleKeyDown(e: React.KeyboardEvent, index: number) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusIndex((index + 1) % totalItems)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusIndex((index - 1 + totalItems) % totalItems)
  }
}
```

## Canonical Source Files
- `packages/ui/src/components/`
- `packages/hooks/`

## Verification Command
```bash
pnpm --filter=@workspace/ui test
```
