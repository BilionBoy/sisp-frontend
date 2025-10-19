"use client";

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * ShimmerButton Component
 *
 * Botão com efeito shimmer (brilho deslizante) animado.
 * Ideal para CTAs e ações importantes.
 *
 * @example
 * <ShimmerButton variant="primary" size="lg">
 *   Click Me
 * </ShimmerButton>
 */

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Intensidade do shimmer (0-1) */
  shimmerIntensity?: number;
  /** Velocidade do shimmer */
  shimmerSpeed?: 'slow' | 'medium' | 'fast';
  /** Habilitar efeito hover glow */
  glow?: boolean;
  /** Habilitar ripple effect ao clicar */
  ripple?: boolean;
}

export function ShimmerButton({
  children,
  variant = 'primary',
  size = 'md',
  shimmerIntensity = 0.5,
  shimmerSpeed = 'medium',
  glow = true,
  ripple = true,
  className,
  ...props
}: ShimmerButtonProps) {
  const [isRippling, setIsRippling] = React.useState(false);

  // Variantes de cor
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10',
  };

  // Tamanhos
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-11 px-6 text-lg',
    xl: 'h-14 px-8 text-xl',
  };

  // Velocidade do shimmer
  const speeds = {
    slow: '3s',
    medium: '2s',
    fast: '1s',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 600);
    }
    props.onClick?.(e);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        'rounded-lg font-semibold',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'overflow-hidden',
        variants[variant],
        sizes[size],
        glow && 'hover-glow-primary',
        className
      )}
    >
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer-slide"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, ${shimmerIntensity}), transparent)`,
          animationDuration: speeds[shimmerSpeed],
        }}
      />

      {/* Ripple effect */}
      {isRippling && ripple && (
        <span className="absolute inset-0 animate-ripple-effect bg-white/30 rounded-full" />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>

      <style>{`
        @keyframes shimmer-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes ripple-effect {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-shimmer-slide {
          animation: shimmer-slide linear infinite;
        }

        .animate-ripple-effect {
          animation: ripple-effect 600ms ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer-slide,
          .animate-ripple-effect {
            animation: none;
          }
        }
      `}</style>
    </button>
  );
}

/**
 * GradientShimmerButton Component
 *
 * Botão com gradiente de fundo e shimmer.
 *
 * @example
 * <GradientShimmerButton gradient="rainbow">
 *   Premium Action
 * </GradientShimmerButton>
 */

export interface GradientShimmerButtonProps extends Omit<ShimmerButtonProps, 'variant'> {
  gradient?: 'primary' | 'secondary' | 'accent' | 'rainbow' | 'fire' | 'ocean';
}

export function GradientShimmerButton({
  children,
  gradient = 'primary',
  size = 'md',
  className,
  ...props
}: GradientShimmerButtonProps) {
  const gradients = {
    primary: 'bg-gradient-to-r from-primary to-primary/70',
    secondary: 'bg-gradient-to-r from-secondary to-secondary/70',
    accent: 'bg-gradient-to-r from-accent to-accent/70',
    rainbow: 'bg-gradient-to-r from-primary via-accent to-secondary',
    fire: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500',
    ocean: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500',
  };

  return (
    <ShimmerButton
      {...props}
      size={size}
      className={cn(gradients[gradient], 'text-white', className)}
    >
      {children}
    </ShimmerButton>
  );
}

/**
 * IconShimmerButton Component
 *
 * Botão com ícone e shimmer effect.
 *
 * @example
 * <IconShimmerButton icon={<IconPlus />} variant="primary">
 *   Add New
 * </IconShimmerButton>
 */

export interface IconShimmerButtonProps extends ShimmerButtonProps {
  icon: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function IconShimmerButton({
  children,
  icon,
  iconPosition = 'left',
  ...props
}: IconShimmerButtonProps) {
  return (
    <ShimmerButton {...props}>
      {iconPosition === 'left' && <span className="w-5 h-5">{icon}</span>}
      {children}
      {iconPosition === 'right' && <span className="w-5 h-5">{icon}</span>}
    </ShimmerButton>
  );
}

/**
 * PulseShimmerButton Component
 *
 * Botão com shimmer e pulso contínuo para chamar atenção.
 *
 * @example
 * <PulseShimmerButton variant="accent">
 *   Important Action
 * </PulseShimmerButton>
 */

export interface PulseShimmerButtonProps extends ShimmerButtonProps {
  pulseSpeed?: 'slow' | 'medium' | 'fast';
}

export function PulseShimmerButton({
  pulseSpeed = 'medium',
  className,
  ...props
}: PulseShimmerButtonProps) {
  const speeds = {
    slow: 'animate-pulse-slow',
    medium: 'animate-pulse',
    fast: 'animate-pulse duration-500',
  };

  return (
    <div className={speeds[pulseSpeed]}>
      <ShimmerButton {...props} className={className} />
    </div>
  );
}

// Export default
export default ShimmerButton;
