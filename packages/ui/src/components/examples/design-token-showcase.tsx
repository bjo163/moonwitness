"use client"

/**
 * ◈ MoonWitness — Design Token Showcase
 * 
 * Demonstrates proper usage of the enterprise shadcn design token system.
 * 
 * @module @workspace/ui/components/examples/design-token-showcase
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../card';
import { Button } from '../button';
import { Badge } from '../badge';

export function SemanticColorExample() {
  return (
    <div className="space-y-4 font-sans">
      <div className="text-primary text-xl font-bold">
        Primary Action
      </div>
      <div className="text-emerald-600 dark:text-emerald-400 text-sm">
        ✓ Operation Successful
      </div>
      <div className="text-amber-600 dark:text-amber-400 text-sm">
        ⚠ Attention Required
      </div>
    </div>
  );
}

export function StandardCardExample() {
  return (
    <Card className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          System Overview
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enterprise shadcn/ui and Tailwind v4 token system.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4 flex gap-3">
        <Button variant="default">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Badge variant="outline">Enterprise</Badge>
      </CardContent>
    </Card>
  );
}
