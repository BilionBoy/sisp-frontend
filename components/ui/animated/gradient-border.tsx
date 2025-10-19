"use client";

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * GradientBorder Component
 *
 * Componente wrapper que adiciona borda animada com gradiente.
 * Ideal para cards, buttons e elementos destacados.
 *
 * @example
 * <GradientBorder gradient="primary" borderWidth={2} animate>
 *   <div className="p-6">Content here</div>
 * </GradientBorder>
 */

export type GradientType = 'primary' | 'secondary' | 'accent' | 'rainbow' | 'fire' | 'ocean' | 'sunset';
export type GradientSpeed = 'slow' | 'medium' | 'fast';

export interface GradientBorderProps {
  children: React.ReactNode;
  /** Tipo de gradiente */
  gradient?: GradientType;
  /** Largura da borda (px) */
  borderWidth?: number;
  /** Border radius (px) */
  borderRadius?: number;
  /** Animar gradiente */
  animate?: boolean;
  /** Velocidade da animação */
  speed?: GradientSpeed;
  /** Classe CSS customizada */
  className?: string;
}

export function GradientBorder({
  children,
  gradient = 'primary',
  borderWidth = 2,
  borderRadius = 12,
  animate = true,
  speed = 'medium',
  className,
}: GradientBorderProps) {
  // Presets de gradientes
  const gradients = {
    primary: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.5) 100%)',
    secondary: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--secondary) / 0.5) 100%)',
    accent: 'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.5) 100%)',
    rainbow: 'linear-gradient(135deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(0, 100%, 50%))',
    fire: 'linear-gradient(135deg, hsl(0, 100%, 50%), hsl(30, 100%, 50%), hsl(60, 100%, 50%))',
    ocean: 'linear-gradient(135deg, hsl(180, 100%, 40%), hsl(200, 100%, 50%), hsl(220, 100%, 60%))',
    sunset: 'linear-gradient(135deg, hsl(30, 100%, 50%), hsl(350, 100%, 50%), hsl(270, 100%, 50%))',
  };

  const durations = {
    slow: '6s',
    medium: '4s',
    fast: '2s',
  };

  return (
    <div
      className={cn('relative', className)}
      style={{
        borderRadius: `${borderRadius}px`,
      }}
    >
      {/* Gradient border */}
      <div
        className={cn('absolute inset-0 -z-10', animate && 'animate-gradient-border')}
        style={{
          background: gradients[gradient],
          backgroundSize: '200% 200%',
          borderRadius: `${borderRadius}px`,
          padding: `${borderWidth}px`,
        }}
      />

      {/* Content wrapper */}
      <div
        className="relative bg-background h-full"
        style={{
          borderRadius: `${borderRadius - borderWidth}px`,
        }}
      >
        {children}
      </div>

      {animate && (
        <style>{`
          @keyframes gradient-border {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .animate-gradient-border {
            animation: gradient-border ${durations[speed]} ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-gradient-border {
              animation: none;
            }
          }
        `}</style>
      )}
    </div>
  );
}

/**
 * GradientCard Component
 *
 * Card pré-configurado com borda gradiente.
 *
 * @example
 * <GradientCard gradient="rainbow">
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </GradientCard>
 */

export interface GradientCardProps extends GradientBorderProps {
  padding?: number;
}

export function GradientCard({
  children,
  padding = 24,
  className,
  ...props
}: GradientCardProps) {
  return (
    <GradientBorder {...props} className={className}>
      <div style={{ padding: `${padding}px` }}>{children}</div>
    </GradientBorder>
  );
}

/**
 * GradientText Component
 *
 * Texto com gradiente animado.
 *
 * @example
 * <GradientText gradient="rainbow">
 *   Texto Gradiente
 * </GradientText>
 */

export interface GradientTextProps {
  children: React.ReactNode;
  gradient?: GradientType;
  animate?: boolean;
  speed?: GradientSpeed;
  className?: string;
}

export function GradientText({
  children,
  gradient = 'rainbow',
  animate = true,
  speed = 'medium',
  className,
}: GradientTextProps) {
  const gradients = {
    primary: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)',
    secondary: 'linear-gradient(90deg, hsl(var(--secondary)) 0%, hsl(var(--secondary) / 0.7) 100%)',
    accent: 'linear-gradient(90deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.7) 100%)',
    rainbow: 'linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%))',
    fire: 'linear-gradient(90deg, hsl(0, 100%, 50%), hsl(30, 100%, 50%), hsl(60, 100%, 50%))',
    ocean: 'linear-gradient(90deg, hsl(180, 100%, 40%), hsl(200, 100%, 50%), hsl(220, 100%, 60%))',
    sunset: 'linear-gradient(90deg, hsl(30, 100%, 50%), hsl(350, 100%, 50%), hsl(270, 100%, 50%))',
  };

  const durations = {
    slow: '6s',
    medium: '4s',
    fast: '2s',
  };

  return (
    <>
      <span
        className={cn(
          'bg-clip-text text-transparent font-bold',
          animate && 'animate-gradient-text',
          className
        )}
        style={{
          background: gradients[gradient],
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {children}
      </span>

      {animate && (
        <style>{`
          @keyframes gradient-text {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .animate-gradient-text {
            animation: gradient-text ${durations[speed]} linear infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-gradient-text {
              animation: none;
            }
          }
        `}</style>
      )}
    </>
  );
}

// Export default
export default GradientBorder;
