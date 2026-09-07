# UI component ownership

This register documents component-health findings that are intentionally kept in
`packages/ui`. These are not duplicate application primitives and must not be
replaced with local wrappers.

| Component | Owner | Reason |
| --- | --- | --- |
| `ChartContainer`, `ChartTooltipItem` | `packages/ui/components/chart.tsx` | Shared chart infrastructure; it owns responsive sizing, tooltip context, and chart-library presentation. Domain series configuration remains with the feature. |
| `AuthTerminalWidget` | `packages/ui/widgets/auth/auth-terminal-widget.tsx` | Stateful authentication presentation and portal flow. Authentication client calls and session behavior remain in the auth owner. |
| `MoonwitnessAuthFlow` | `packages/ui/widgets/auth/moonwitness-auth-flow.tsx` | Shared product authentication flow composition. API calls, redirects, and state transitions are not generic primitive concerns. |
| `GraphEntityPanelWidget` | `packages/ui/widgets/graph/graph-entity-panel-widget.tsx` | Graph entity inspection presentation, including graph-specific tabs and evidence metadata. |
| `GraphSvgPrimaryNodes` | `packages/ui/widgets/graph/graph-svg-primary-nodes.tsx` | Domain graph renderer for primary knowledge nodes and their relationships. |
| `GraphSvgSecondaryNodes` | `packages/ui/widgets/graph/graph-svg-secondary-nodes.tsx` | Domain graph renderer for secondary and child knowledge nodes. |

These findings remain subject to normal review. A future extraction is valid only
if it creates a presentational component reused by at least two features without
moving graph, chart, authentication, API, or business logic into a generic UI
primitive.
