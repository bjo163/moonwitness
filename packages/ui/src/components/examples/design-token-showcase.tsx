"use client"

/**
 * ◈ MoonWitness OS — Design Token Showcase
 * 
 * Comprehensive examples demonstrating proper usage of the design token system.
 * This file serves as both documentation and a visual testing ground.
 * 
 * @module @workspace/ui/components/examples/design-token-showcase
 */

import React from 'react';
import {
  useCyberColor,
  useClipPath,
  useGlow,
  useCornerBrackets,
  usePanelGlass,
  useCosmicGrid,
  useLaserConduit,
  useSemanticTokens,
} from '../../hooks/use-design-tokens';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE 1: Semantic Color Usage
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function SemanticColorExample() {
  const primaryColor = useCyberColor({ type: 'semantic', name: 'primary' });
  const successColor = useCyberColor({ type: 'semantic', name: 'success' });
  const warningColor = useCyberColor({ type: 'semantic', name: 'warning' });

  return (
    <div className="space-y-4">
      <div style={{ color: primaryColor }} className="text-2xl font-mono tracking-widest">
        PRIMARY ACTION
      </div>
      <div style={{ color: successColor }} className="text-xl">
        ✓ OPERATION SUCCESSFUL
      </div>
      <div style={{ color: warningColor }} className="text-xl">
        ⚠ ATTENTION REQUIRED
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE 2: Chamfered Card with Clip Path
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function ChamferedCard() {
  const cardClip = useClipPath({ variant: 'card', className: true });
  const glassStyles = usePanelGlass();

  return (
    <div className={`${cardClip.className} p-6`} style={glassStyles}>
      <h3 className="text-primary text-xl font-mono tracking-widest mb-4">
        CONTROL PANEL ALPHA
      </h3>
      <p className="text-muted-foreground">
        This card demonstrates proper usage of chamfered corners with glassmorphism effects.
      </p>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE 3: Button with Glow Effect
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function GlowingButton() {
  const btnClip = useClipPath({ variant: 'button', className: true });
  const glowStyle = useGlow({ color: 'cyan', depth: 'active' });

  return (
    <button
      className={`${btnClip.className} bg-cyber-cyan text-cyber-dark px-6 py-3 font-mono tracking-widest uppercase transition-all hover:scale-105`}
      style={glowStyle}
    >
      Execute Command
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE 4: Corner Accents
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function CornerBracketExample() {
  const activeCorner = useCornerBrackets({ variant: 'active' });
  const successCorner = useCornerBrackets({ variant: 'success' });
  const criticalCorner = useCornerBrackets({ variant: 'critical' });

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className={`corner-box ${activeCorner} p-4 border border-cyber-cyan/25`}>
        <p className="text-cyber-cyan text-sm font-mono">ACTIVE</p>
      </div>
      <div className={`corner-box ${successCorner} p-4 border border-cyber-green/25`}>
        <p className="text-cyber-green text-sm font-mono">SUCCESS</p>
      </div>
      <div className={`corner-box ${criticalCorner} p-4 border border-cyber-pink/25`}>
        <p className="text-cyber-pink text-sm font-mono">CRITICAL</p>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE 5: Cosmic Grid Background
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function CosmicGridExample() {
  const cosmicGrid = useCosmicGrid({ variant: 'cosmic' });
  const glassStyles = usePanelGlass();

  return (
    <div className={`${cosmicGrid} min-h-[300px] p-8`}>
      <div className="clip-card" style={glassStyles}>
        <div className="p-6">
          <h3 className="text-cyber-cyan text-xl font-mono tracking-widest mb-2">
            COSMIC GRID MATRIX
          </h3>
          <p className="text-[#8B9BB0]">
            32px grid pattern for navigation and dashboard interfaces
          </p>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE 6: Laser Conduit Dividers
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function LaserConduitExample() {
  const cyanConduit = useLaserConduit({ color: 'cyan' });
  const greenConduit = useLaserConduit({ color: 'green' });
  const yellowConduit = useLaserConduit({ color: 'yellow' });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-cyber-cyan text-sm font-mono mb-2">SECTION ALPHA</p>
        <div className={cyanConduit} />
      </div>
      <div>
        <p className="text-cyber-green text-sm font-mono mb-2">SECTION BETA</p>
        <div className={greenConduit} />
      </div>
      <div>
        <p className="text-cyber-yellow text-sm font-mono mb-2">SECTION GAMMA</p>
        <div className={yellowConduit} />
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE 7: Comprehensive Semantic Token Usage
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function SemanticTokenCard({ intent = 'primary' }: { intent?: 'primary' | 'success' | 'warning' | 'premium' | 'danger' }) {
  const tokens = useSemanticTokens(intent);
  const btnClip = useClipPath({ variant: 'button', className: true });

  return (
    <div className={`corner-box ${tokens.cornerClass} clip-card panel-glass p-6 border`} style={{ borderColor: tokens.color + '40' }}>
      <h3 className="font-mono tracking-widest mb-3" style={{ color: tokens.color }}>
        {intent.toUpperCase()} INTENT
      </h3>
      <div className={tokens.conduitClass + ' mb-4'} />
      <button
        className={`${btnClip.className} ${tokens.glowClass} px-4 py-2 font-mono text-sm tracking-widest uppercase`}
        style={{ backgroundColor: tokens.color, color: 'var(--cyber-dark)' }}
      >
        {intent} Action
      </button>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE 8: Alert Banners with Different States
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function AlertBanner({ 
  type = 'info', 
  message 
}: { 
  type?: 'info' | 'success' | 'warning' | 'error'; 
  message: string;
}) {
  const tokenMap = {
    info: 'primary' as const,
    success: 'success' as const,
    warning: 'warning' as const,
    error: 'danger' as const,
  };

  const tokens = useSemanticTokens(tokenMap[type]);
  const tagClip = useClipPath({ variant: 'tag', className: true });

  return (
    <div 
      className={`${tagClip.className} flex items-center gap-3 p-4 border backdrop-blur-md`}
      style={{ 
        backgroundColor: tokens.color + '15',
        borderColor: tokens.color + '40'
      }}
    >
      <div 
        className={`${tagClip.className} px-2 py-1 text-xs font-mono tracking-widest`}
        style={{ backgroundColor: tokens.color, color: 'var(--cyber-dark)' }}
      >
        {type.toUpperCase()}
      </div>
      <p className="font-mono text-sm" style={{ color: tokens.color }}>
        {message}
      </p>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE 9: Complete Dashboard Panel
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function DashboardPanel() {
  const primaryTokens = useSemanticTokens('primary');
  const cosmicGrid = useCosmicGrid({ variant: 'cosmic' });
  const glassStyles = usePanelGlass();
  const heroClip = useClipPath({ variant: 'hero', className: true });
  const cardClip = useClipPath({ variant: 'card', className: true });

  return (
    <section className={`${cosmicGrid} min-h-screen p-8`}>
      {/* Hero Banner */}
      <div className={`${heroClip.className} mb-8 p-8`} style={glassStyles}>
        <h1 className="text-4xl font-orbitron tracking-wider text-cyber-cyan mb-2">
          MOONWITNESS OPERATING SYSTEM
        </h1>
        <p className="text-[#8B9BB0] font-mono">
          Deep Space Sci-Fi Divine Operating System — Version 9.5
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <SemanticTokenCard intent="primary" />
        <SemanticTokenCard intent="success" />
        <SemanticTokenCard intent="warning" />
      </div>

      {/* Alert Examples */}
      <div className="space-y-4">
        <AlertBanner type="success" message="System synchronization completed successfully" />
        <AlertBanner type="warning" message="Database migration pending — action required" />
        <AlertBanner type="error" message="Critical authentication failure detected" />
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MAIN SHOWCASE COMPONENT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function DesignTokenShowcase() {
  return (
    <div className="bg-cyber-dark min-h-screen">
      <DashboardPanel />
    </div>
  );
}
