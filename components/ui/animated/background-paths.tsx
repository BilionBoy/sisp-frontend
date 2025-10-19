"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * BackgroundPaths Component
 *
 * Componente de background animado com paths SVG ou gradientes em movimento.
 * Ideal para backgrounds de hero sections, login pages e seções destacadas.
 *
 * @example
 * <BackgroundPaths
 *   variant="waves"
 *   color="primary"
 *   speed="slow"
 *   opacity={0.3}
 * />
 */

export type PathVariant = 'waves' | 'grid' | 'dots' | 'lines' | 'curves' | 'gradient';
export type PathColor = 'primary' | 'secondary' | 'accent' | 'muted';
export type PathSpeed = 'slow' | 'medium' | 'fast';

export interface BackgroundPathsProps {
  /** Variante do padrão de background */
  variant?: PathVariant;
  /** Cor do padrão baseada no tema */
  color?: PathColor;
  /** Velocidade da animação */
  speed?: PathSpeed;
  /** Opacidade do padrão (0-1) */
  opacity?: number;
  /** Densidade do padrão (0-1) */
  density?: number;
  /** Classe CSS customizada */
  className?: string;
  /** Ativar efeito parallax */
  parallax?: boolean;
  /** Blur effect */
  blur?: boolean;
}

export function BackgroundPaths({
  variant = 'waves',
  color = 'primary',
  speed = 'medium',
  opacity = 0.2,
  density = 0.5,
  className,
  parallax = false,
  blur = false,
}: BackgroundPathsProps) {
  // Duração da animação baseada na velocidade
  const duration = useMemo(() => {
    const speeds = { slow: '30s', medium: '20s', fast: '10s' };
    return speeds[speed];
  }, [speed]);

  // Cor do padrão baseada no tema
  const patternColor = useMemo(() => {
    const colors = {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      accent: 'hsl(var(--accent))',
      muted: 'hsl(var(--muted-foreground))',
    };
    return colors[color];
  }, [color]);

  // Renderizar padrão baseado na variante
  const renderPattern = () => {
    switch (variant) {
      case 'waves':
        return (
          <svg
            className={cn('absolute inset-0 w-full h-full', className)}
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
          >
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: patternColor, stopOpacity: opacity }} />
                <stop offset="100%" style={{ stopColor: patternColor, stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <g className="animate-wave">
              <path
                d="M0 50 Q 250 0, 500 50 T 1000 50 T 1500 50 T 2000 50 V 100 H 0 Z"
                fill="url(#wave-gradient)"
                opacity={opacity}
              />
              <path
                d="M0 70 Q 200 40, 400 70 T 800 70 T 1200 70 T 1600 70 V 100 H 0 Z"
                fill={patternColor}
                opacity={opacity * 0.7}
              />
              <path
                d="M0 90 Q 300 70, 600 90 T 1200 90 T 1800 90 T 2400 90 V 100 H 0 Z"
                fill={patternColor}
                opacity={opacity * 0.5}
              />
            </g>
            <style>{`
              @keyframes wave {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-wave {
                animation: wave ${duration} linear infinite;
              }
            `}</style>
          </svg>
        );

      case 'grid':
        return (
          <svg
            className={cn('absolute inset-0 w-full h-full', className)}
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
          >
            <defs>
              <pattern
                id="grid-pattern"
                x="0"
                y="0"
                width={50 * density}
                height={50 * density}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${50 * density} 0 L 0 0 0 ${50 * density}`}
                  fill="none"
                  stroke={patternColor}
                  strokeWidth="1"
                  opacity={opacity}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        );

      case 'dots':
        return (
          <svg
            className={cn('absolute inset-0 w-full h-full', className)}
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
          >
            <defs>
              <pattern
                id="dots-pattern"
                x="0"
                y="0"
                width={30 * density}
                height={30 * density}
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx={15 * density}
                  cy={15 * density}
                  r={2 * density}
                  fill={patternColor}
                  opacity={opacity}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-pattern)" />
          </svg>
        );

      case 'lines':
        return (
          <svg
            className={cn('absolute inset-0 w-full h-full', className)}
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
          >
            <defs>
              <pattern
                id="lines-pattern"
                x="0"
                y="0"
                width={40 * density}
                height={40 * density}
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <path
                  d={`M 0 0 L 0 ${40 * density}`}
                  fill="none"
                  stroke={patternColor}
                  strokeWidth="1"
                  opacity={opacity}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lines-pattern)" />
          </svg>
        );

      case 'curves':
        return (
          <svg
            className={cn('absolute inset-0 w-full h-full', className)}
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
          >
            <g className="animate-curves">
              {Array.from({ length: 5 }).map((_, i) => (
                <path
                  key={i}
                  d={`M ${i * 200} 0 Q ${i * 200 + 100} ${100 + i * 50}, ${i * 200 + 200} 0 T ${i * 200 + 400} 0`}
                  fill="none"
                  stroke={patternColor}
                  strokeWidth="2"
                  opacity={opacity * (1 - i * 0.15)}
                />
              ))}
            </g>
            <style>{`
              @keyframes curves {
                0% { transform: translateY(0); }
                100% { transform: translateY(-100px); }
              }
              .animate-curves {
                animation: curves ${duration} linear infinite;
              }
            `}</style>
          </svg>
        );

      case 'gradient':
        return (
          <div
            className={cn('absolute inset-0 w-full h-full animate-gradient', className)}
            style={{
              background: `
                radial-gradient(ellipse at top, ${patternColor} 0%, transparent 50%),
                radial-gradient(ellipse at bottom, ${patternColor} 0%, transparent 50%)
              `,
              opacity,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'absolute inset-0 -z-10 overflow-hidden',
        parallax && 'transform-gpu',
        blur && 'backdrop-blur-3xl'
      )}
      style={{
        pointerEvents: 'none',
      }}
    >
      {renderPattern()}
    </div>
  );
}

/**
 * BackgroundGradientAnimation Component
 *
 * Componente de gradiente animado com movimento suave.
 *
 * @example
 * <BackgroundGradientAnimation
 *   colors={['primary', 'secondary', 'accent']}
 *   speed="slow"
 * />
 */

export interface BackgroundGradientAnimationProps {
  /** Cores do gradiente */
  colors?: PathColor[];
  /** Velocidade da animação */
  speed?: PathSpeed;
  /** Opacidade do gradiente */
  opacity?: number;
  /** Classe CSS customizada */
  className?: string;
}

export function BackgroundGradientAnimation({
  colors = ['primary', 'secondary', 'accent'],
  speed = 'slow',
  opacity = 0.3,
  className,
}: BackgroundGradientAnimationProps) {
  const duration = useMemo(() => {
    const speeds = { slow: '15s', medium: '10s', fast: '5s' };
    return speeds[speed];
  }, [speed]);

  const gradientColors = useMemo(() => {
    return colors.map((color) => {
      const colorMap = {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted-foreground)',
      };
      return colorMap[color];
    });
  }, [colors]);

  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden', className)}>
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: `linear-gradient(-45deg, ${gradientColors.join(', ')})`,
          backgroundSize: '400% 400%',
          opacity,
        }}
      />
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          animation: gradient-shift ${duration} ease infinite;
        }
      `}</style>
    </div>
  );
}

// Export default
export default BackgroundPaths;
