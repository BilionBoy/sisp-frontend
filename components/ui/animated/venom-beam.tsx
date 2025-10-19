"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * VenomBeam Component
 *
 * Efeito de beam "venom" orgânico com gradientes multicoloridos e movimento fluido.
 * Ideal para highlights, call-to-action e elementos decorativos impactantes.
 *
 * @example
 * <VenomBeam
 *   colors={['primary', 'accent']}
 *   intensity={0.6}
 *   speed="medium"
 *   blur={20}
 * />
 */

export type VenomColor = 'primary' | 'secondary' | 'accent' | 'rainbow' | 'fire' | 'ocean';
export type VenomSpeed = 'slow' | 'medium' | 'fast';
export type VenomDirection = 'horizontal' | 'vertical' | 'diagonal' | 'radial';

export interface VenomBeamProps {
  /** Cores do beam (aceita array ou preset) */
  colors?: VenomColor[] | VenomColor;
  /** Velocidade da animação */
  speed?: VenomSpeed;
  /** Direção do movimento */
  direction?: VenomDirection;
  /** Intensidade do efeito (0-1) */
  intensity?: number;
  /** Blur do efeito (px) */
  blur?: number;
  /** Classe CSS customizada */
  className?: string;
  /** Habilitar pulso */
  pulse?: boolean;
}

export function VenomBeam({
  colors = 'primary',
  speed = 'medium',
  direction = 'horizontal',
  intensity = 0.5,
  blur = 30,
  className,
  pulse = false,
}: VenomBeamProps) {
  // Duração da animação baseada na velocidade
  const duration = useMemo(() => {
    const speeds = { slow: '15s', medium: '10s', fast: '5s' };
    return speeds[speed];
  }, [speed]);

  // Gerar gradiente baseado nas cores
  const gradient = useMemo(() => {
    const colorPresets = {
      primary: ['hsl(var(--primary))', 'hsl(var(--primary) / 0.5)'],
      secondary: ['hsl(var(--secondary))', 'hsl(var(--secondary) / 0.5)'],
      accent: ['hsl(var(--accent))', 'hsl(var(--accent) / 0.5)'],
      rainbow: [
        'hsl(0, 100%, 50%)',
        'hsl(60, 100%, 50%)',
        'hsl(120, 100%, 50%)',
        'hsl(180, 100%, 50%)',
        'hsl(240, 100%, 50%)',
        'hsl(300, 100%, 50%)',
      ],
      fire: [
        'hsl(0, 100%, 50%)',
        'hsl(30, 100%, 50%)',
        'hsl(60, 100%, 50%)',
        'hsl(30, 100%, 50%)',
      ],
      ocean: [
        'hsl(180, 100%, 40%)',
        'hsl(200, 100%, 50%)',
        'hsl(220, 100%, 60%)',
        'hsl(200, 100%, 50%)',
      ],
    };

    let colorArray: string[];

    if (Array.isArray(colors)) {
      colorArray = colors.flatMap((c) => colorPresets[c as VenomColor] || []);
    } else {
      colorArray = colorPresets[colors] || colorPresets.primary;
    }

    const directionMap = {
      horizontal: '90deg',
      vertical: '180deg',
      diagonal: '135deg',
      radial: 'circle',
    };

    if (direction === 'radial') {
      return `radial-gradient(${directionMap[direction]}, ${colorArray.join(', ')})`;
    }

    return `linear-gradient(${directionMap[direction]}, ${colorArray.join(', ')})`;
  }, [colors, direction]);

  // Estilo do beam
  const beamStyle: React.CSSProperties = {
    background: gradient,
    backgroundSize: direction === 'radial' ? '200% 200%' : '400% 400%',
    opacity: intensity,
    filter: `blur(${blur}px)`,
  };

  return (
    <div
      className={cn(
        'absolute inset-0 -z-10 overflow-hidden pointer-events-none',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0',
          pulse ? 'animate-venom-pulse' : 'animate-venom-flow'
        )}
        style={beamStyle}
      />

      <style>{`
        @keyframes venom-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes venom-pulse {
          0%, 100% {
            opacity: ${intensity * 0.7};
            transform: scale(1);
          }
          50% {
            opacity: ${intensity};
            transform: scale(1.05);
          }
        }

        .animate-venom-flow {
          animation: venom-flow ${duration} ease-in-out infinite;
        }

        .animate-venom-pulse {
          animation: venom-pulse ${duration} ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-venom-flow,
          .animate-venom-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * VenomBorder Component
 *
 * Componente wrapper que adiciona borda animada com efeito venom.
 *
 * @example
 * <VenomBorder colors="rainbow" blur={10}>
 *   <div className="p-8">Content here</div>
 * </VenomBorder>
 */

export interface VenomBorderProps extends VenomBeamProps {
  children: React.ReactNode;
  /** Largura da borda (px) */
  borderWidth?: number;
  /** Border radius (px) */
  borderRadius?: number;
}

export function VenomBorder({
  children,
  colors = 'primary',
  speed = 'medium',
  intensity = 0.8,
  blur = 20,
  borderWidth = 2,
  borderRadius = 12,
  className,
}: VenomBorderProps) {
  const duration = useMemo(() => {
    const speeds = { slow: '15s', medium: '10s', fast: '5s' };
    return speeds[speed];
  }, [speed]);

  const gradient = useMemo(() => {
    const colorPresets = {
      primary: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))'],
      secondary: ['hsl(var(--secondary))', 'hsl(var(--primary))'],
      accent: ['hsl(var(--accent))', 'hsl(var(--primary))'],
      rainbow: [
        'hsl(0, 100%, 50%)',
        'hsl(60, 100%, 50%)',
        'hsl(120, 100%, 50%)',
        'hsl(180, 100%, 50%)',
        'hsl(240, 100%, 50%)',
        'hsl(300, 100%, 50%)',
        'hsl(0, 100%, 50%)',
      ],
      fire: ['hsl(0, 100%, 50%)', 'hsl(30, 100%, 50%)', 'hsl(60, 100%, 50%)'],
      ocean: ['hsl(180, 100%, 40%)', 'hsl(200, 100%, 50%)', 'hsl(220, 100%, 60%)'],
    };

    const colorArray = colorPresets[colors as VenomColor] || colorPresets.primary;
    return `linear-gradient(90deg, ${colorArray.join(', ')})`;
  }, [colors]);

  return (
    <div className={cn('relative', className)} style={{ borderRadius: `${borderRadius}px` }}>
      <div
        className="absolute inset-0 animate-venom-border"
        style={{
          padding: `${borderWidth}px`,
          background: gradient,
          backgroundSize: '400% 400%',
          borderRadius: `${borderRadius}px`,
          opacity: intensity,
          filter: `blur(${blur}px)`,
        }}
      />
      <div
        className="relative bg-background"
        style={{
          borderRadius: `${borderRadius - borderWidth}px`,
          margin: `${borderWidth}px`,
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes venom-border {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-venom-border {
          animation: venom-border ${duration} linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-venom-border {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * VenomHighlight Component
 *
 * Componente para destacar texto com efeito venom animado.
 *
 * @example
 * <VenomHighlight colors="accent">
 *   Texto Destacado
 * </VenomHighlight>
 */

export interface VenomHighlightProps {
  children: React.ReactNode;
  colors?: VenomColor;
  speed?: VenomSpeed;
  intensity?: number;
  className?: string;
}

export function VenomHighlight({
  children,
  colors = 'accent',
  speed = 'medium',
  intensity = 0.6,
  className,
}: VenomHighlightProps) {
  const duration = useMemo(() => {
    const speeds = { slow: '15s', medium: '10s', fast: '5s' };
    return speeds[speed];
  }, [speed]);

  const gradient = useMemo(() => {
    const colorPresets = {
      primary: ['hsl(var(--primary))', 'hsl(var(--primary) / 0.5)'],
      secondary: ['hsl(var(--secondary))', 'hsl(var(--secondary) / 0.5)'],
      accent: ['hsl(var(--accent))', 'hsl(var(--accent) / 0.5)'],
      rainbow: [
        'hsl(0, 100%, 50%)',
        'hsl(60, 100%, 50%)',
        'hsl(120, 100%, 50%)',
        'hsl(180, 100%, 50%)',
        'hsl(240, 100%, 50%)',
        'hsl(300, 100%, 50%)',
      ],
      fire: ['hsl(0, 100%, 50%)', 'hsl(30, 100%, 50%)', 'hsl(60, 100%, 50%)'],
      ocean: ['hsl(180, 100%, 40%)', 'hsl(200, 100%, 50%)', 'hsl(220, 100%, 60%)'],
    };

    const colorArray = colorPresets[colors] || colorPresets.accent;
    return `linear-gradient(90deg, ${colorArray.join(', ')})`;
  }, [colors]);

  return (
    <span className={cn('relative inline-block', className)}>
      <span
        className="absolute inset-0 -z-10 animate-venom-highlight"
        style={{
          background: gradient,
          backgroundSize: '200% 200%',
          opacity: intensity,
          filter: 'blur(8px)',
        }}
      />
      <span className="relative">{children}</span>

      <style>{`
        @keyframes venom-highlight {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-venom-highlight {
          animation: venom-highlight ${duration} ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-venom-highlight {
            animation: none;
          }
        }
      `}</style>
    </span>
  );
}

/**
 * VenomGlow Component
 *
 * Componente de glow pulsante com efeito venom.
 *
 * @example
 * <VenomGlow colors="rainbow" size="large">
 *   <Button>Click Me</Button>
 * </VenomGlow>
 */

export interface VenomGlowProps {
  children: React.ReactNode;
  colors?: VenomColor;
  speed?: VenomSpeed;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function VenomGlow({
  children,
  colors = 'primary',
  speed = 'medium',
  size = 'medium',
  className,
}: VenomGlowProps) {
  const duration = useMemo(() => {
    const speeds = { slow: '4s', medium: '2s', fast: '1s' };
    return speeds[speed];
  }, [speed]);

  const glowSize = useMemo(() => {
    const sizes = { small: '20px', medium: '40px', large: '60px' };
    return sizes[size];
  }, [size]);

  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      <div
        className="absolute inset-0 -z-10 animate-venom-glow rounded-full"
        style={{
          boxShadow: `0 0 ${glowSize} hsl(var(--${colors}))`,
        }}
      />

      <style>{`
        @keyframes venom-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .animate-venom-glow {
          animation: venom-glow ${duration} ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-venom-glow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

// Export default
export default VenomBeam;
