---
name: helpdesk-sla-breach-escalation-timer
description: >-
  Use this skill when auditing or implementing Helpdesk Service Level Agreement (SLA) timers,
  business hours calendar calculation, breach warning countdowns, and automated ticket escalation in @moon/helpdesk.
---

# Helpdesk SLA Breach & Escalation Timer (Subatomic Skill)

Governs the real-time calculation of Service Level Agreement (SLA) response and resolution deadlines against active business calendars in `@moon/helpdesk`.

## Business Hours Calculation Model

Real-world SLA time only elapses during configured operational working hours (e.g. Mon-Fri 08:00 - 17:00 excluding gazetted public holidays):

$$\text{Effective SLA Elapsed} = \int_{t_{\text{ticket\_created}}}^{t_{\text{current}}} \mathbf{1}_{\text{BusinessHour}}(t) \, dt$$

Where:
$$\mathbf{1}_{\text{BusinessHour}}(t) = \begin{cases}
1 & \text{if } t \in [\text{OpenTime}, \text{CloseTime}] \land \text{DayOfWeek}(t) \in [1, 5] \land t \notin \text{Holidays} \\
0 & \text{otherwise}
\end{cases}$$

## SLA Status State Machine
Given target SLA duration $T_{\text{target}}$:
- **`ON_TRACK`**: $\text{Elapsed} < 0.75 \times T_{\text{target}}$ (Green badge).
- **`WARNING`**: $0.75 \times T_{\text{target}} \le \text{Elapsed} < T_{\text{target}}$ (Warning badge; triggers Slack/email warning notification).
- **`BREACHED`**: $\text{Elapsed} \ge T_{\text{target}}$ (Destructive red badge; automatically escalates priority to Level 2 Tier).

## Canonical Source Files
- `packages/moon-helpdesk/src/`
- `packages/moon-helpdesk/src/views.ts`

## Verification Command
```bash
pnpm --filter=@moon/helpdesk test
```
