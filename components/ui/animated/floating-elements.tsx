"use client";

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * FloatingElements Component
 *
 * Elementos flutuantes decorativos com movimento suave.
 * Ideal para backgrounds de hero sections e elementos decorativos.
 *
 * @example
 * <FloatingElements
 *   count={5}
 *   element={<div className="w-20 h-20 rounded-full bg-primary/10" />}
 *   speed="slow"
 * />
 */

export type FloatSpeed = 'slow' | 'medium' | 'fast';
export type FloatDirection = 'vertical' | 'horizontal' | 'circular' | 'random';

export interface FloatingElementsProps {
  /** Número de elementos */
  count?: number;
  /** Elemento a ser renderizado */
  element?: React.ReactNode;
  /** Velocidade do float */
  speed?: FloatSpeed;
  /** Direção do movimento */
  direction?: FloatDirection;
  /** Distância do float (px) */
  distance?: number;
  /** Opacidade dos elementos (0-1) */
  opacity?: number;
  /** Aplicar blur */
  blur?: boolean;
  /** Classe CSS customizada */
  className?: string;
}

export function FloatingElements({
  count = 5,
  element,
  speed = 'medium',
  direction = 'vertical',
  distance = 20,
  opacity = 0.3,
  blur = false,
  className,
}: FloatingElementsProps) {
  const speeds = {
    slow: 6,
    medium: 4,
    fast: 2,
  };

  const duration = speeds[speed];

  const elements = React.useMemo(() => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * duration,
      duration: duration + Math.random() * 2,
      scale: 0.5 + Math.random() * 0.5,
    }));
  }, [count, duration]);

  const getAnimationStyle = (el: (typeof elements)[0]) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${el.left}%`,
      top: `${el.top}%`,
      opacity: opacity,
      filter: blur ? 'blur(4px)' : 'none',
      transform: `scale(${el.scale})`,
      animationDelay: `${el.delay}s`,
      animationDuration: `${el.duration}s`,
    };

    return baseStyle;
  };

  const getAnimationClass = () => {
    const classes = {
      vertical: 'animate-float-vertical',
      horizontal: 'animate-float-horizontal',
      circular: 'animate-float-circular',
      random: 'animate-float-random',
    };
    return classes[direction];
  };

  // Default element se nenhum for fornecido
  const defaultElement = (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />
  );

  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden pointer-events-none', className)}>
      {elements.map((el) => (
        <div key={el.id} className={getAnimationClass()} style={getAnimationStyle(el)}>
          {element || defaultElement}
        </div>
      ))}

      <style>{`
        @keyframes float-vertical {
          0%, 100% {
            transform: translateY(0) scale(var(--scale, 1));
          }
          50% {
            transform: translateY(-${distance}px) scale(var(--scale, 1));
          }
        }

        @keyframes float-horizontal {
          0%, 100% {
            transform: translateX(0) scale(var(--scale, 1));
          }
          50% {
            transform: translateX(${distance}px) scale(var(--scale, 1));
          }
        }

        @keyframes float-circular {
          0% {
            transform: rotate(0deg) translateX(${distance}px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(${distance}px) rotate(-360deg);
          }
        }

        @keyframes float-random {
          0%, 100% {
            transform: translate(0, 0) scale(var(--scale, 1));
          }
          25% {
            transform: translate(${distance}px, -${distance}px) scale(var(--scale, 1));
          }
          50% {
            transform: translate(-${distance}px, ${distance}px) scale(var(--scale, 1));
          }
          75% {
            transform: translate(${distance}px, ${distance}px) scale(var(--scale, 1));
          }
        }

        .animate-float-vertical {
          animation: float-vertical ease-in-out infinite;
        }

        .animate-float-horizontal {
          animation: float-horizontal ease-in-out infinite;
        }

        .animate-float-circular {
          animation: float-circular linear infinite;
        }

        .animate-float-random {
          animation: float-random ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-vertical,
          .animate-float-horizontal,
          .animate-float-circular,
          .animate-float-random {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * FloatingIcons Component
 *
 * Ícones flutuantes com efeito decorativo.
 *
 * @example
 * <FloatingIcons
 *   icons={[<ShieldIcon />, <MapPinIcon />, <AlertIcon />]}
 *   count={10}
 * />
 */

export interface FloatingIconsProps {
  icons: React.ReactNode[];
  count?: number;
  speed?: FloatSpeed;
  size?: number;
  opacity?: number;
  className?: string;
}

export function FloatingIcons({
  icons,
  count = 10,
  speed = 'slow',
  size = 32,
  opacity = 0.1,
  className,
}: FloatingIconsProps) {
  const elements = React.useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      const Icon = icons[index % icons.length];
      return (
        <div
          key={index}
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
          className="text-primary"
        >
          {Icon}
        </div>
      );
    });
  }, [icons, count, size]);

  return (
    <FloatingElements
      count={count}
      speed={speed}
      direction="random"
      opacity={opacity}
      blur={true}
      className={className}
      element={elements}
    />
  );
}

/**
 * FloatingShapes Component
 *
 * Formas geométricas flutuantes decorativas.
 *
 * @example
 * <FloatingShapes count={8} shapes={['circle', 'square', 'triangle']} />
 */

export interface FloatingShapesProps {
  shapes?: ('circle' | 'square' | 'triangle' | 'hexagon')[];
  count?: number;
  speed?: FloatSpeed;
  minSize?: number;
  maxSize?: number;
  opacity?: number;
  className?: string;
}

export function FloatingShapes({
  shapes = ['circle', 'square', 'triangle'],
  count = 10,
  speed = 'medium',
  minSize = 20,
  maxSize = 80,
  opacity = 0.15,
  className,
}: FloatingShapesProps) {
  const elements = React.useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      const shape = shapes[index % shapes.length];
      const size = minSize + Math.random() * (maxSize - minSize);

      const renderShape = () => {
        switch (shape) {
          case 'circle':
            return (
              <div
                className="rounded-full bg-gradient-to-br from-primary/30 to-accent/30"
                style={{ width: size, height: size }}
              />
            );
          case 'square':
            return (
              <div
                className="rounded-lg bg-gradient-to-br from-secondary/30 to-primary/30"
                style={{ width: size, height: size }}
              />
            );
          case 'triangle':
            return (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `${size / 2}px solid transparent`,
                  borderRight: `${size / 2}px solid transparent`,
                  borderBottom: `${size}px solid hsl(var(--accent) / 0.3)`,
                }}
              />
            );
          case 'hexagon':
            return (
              <svg width={size} height={size} viewBox="0 0 24 24">
                <path
                  d="M12 2l9 5v10l-9 5-9-5V7z"
                  fill="hsl(var(--primary) / 0.3)"
                />
              </svg>
            );
          default:
            return null;
        }
      };

      return <div key={index}>{renderShape()}</div>;
    });
  }, [shapes, count, minSize, maxSize]);

  return (
    <FloatingElements
      count={count}
      speed={speed}
      direction="circular"
      opacity={opacity}
      blur={true}
      className={className}
      element={elements}
    />
  );
}

/**
 * FloatingBadges Component
 *
 * Badges flutuantes com informações (ideal para hero sections de serviços).
 *
 * @example
 * <FloatingBadges
 *   badges={[
 *     { icon: <ShieldIcon />, text: 'Segurança 24/7' },
 *     { icon: <MapIcon />, text: 'Cobertura Total' },
 *   ]}
 * />
 */

export interface FloatingBadge {
  icon: React.ReactNode;
  text: string;
}

export interface FloatingBadgesProps {
  badges: FloatingBadge[];
  speed?: FloatSpeed;
  className?: string;
}

export function FloatingBadges({ badges, speed = 'slow', className }: FloatingBadgesProps) {
  const elements = badges.map((badge, index) => (
    <div
      key={index}
      className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-full shadow-lg"
    >
      <div className="w-5 h-5 text-primary">{badge.icon}</div>
      <span className="text-sm font-medium">{badge.text}</span>
    </div>
  ));

  return (
    <FloatingElements
      count={badges.length}
      speed={speed}
      direction="random"
      distance={30}
      opacity={1}
      blur={false}
      className={className}
      element={elements}
    />
  );
}

// Export default
export default FloatingElements;
