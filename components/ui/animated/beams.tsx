"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Beams Component
 *
 * Componente de feixes de luz animados (laser beams) que se movem pela tela.
 * Ideal para backgrounds de hero sections, call-to-action e efeitos visuais impactantes.
 *
 * @example
 * <Beams
 *   count={5}
 *   color="primary"
 *   direction="up"
 *   speed="medium"
 *   blur={true}
 * />
 */

export type BeamDirection = 'up' | 'down' | 'left' | 'right';
export type BeamColor = 'primary' | 'secondary' | 'accent' | 'white' | 'rainbow';
export type BeamSpeed = 'slow' | 'medium' | 'fast';

export interface BeamsProps {
  /** Número de beams a serem renderizados */
  count?: number;
  /** Cor dos beams */
  color?: BeamColor;
  /** Direção do movimento */
  direction?: BeamDirection;
  /** Velocidade da animação */
  speed?: BeamSpeed;
  /** Largura dos beams (px) */
  width?: number;
  /** Opacidade dos beams (0-1) */
  opacity?: number;
  /** Aplicar blur effect */
  blur?: boolean;
  /** Classe CSS customizada */
  className?: string;
  /** Delay entre cada beam (ms) */
  stagger?: number;
}

export function Beams({
  count = 5,
  color = 'primary',
  direction = 'up',
  speed = 'medium',
  width = 2,
  opacity = 0.4,
  blur = true,
  className,
  stagger = 200,
}: BeamsProps) {
  // Duração da animação baseada na velocidade
  const duration = useMemo(() => {
    const speeds = { slow: 8000, medium: 5000, fast: 3000 };
    return speeds[speed];
  }, [speed]);

  // Cor do beam
  const beamColor = useMemo(() => {
    const colors = {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      accent: 'hsl(var(--accent))',
      white: 'rgb(255, 255, 255)',
      rainbow: null, // Será gradiente
    };
    return colors[color];
  }, [color]);

  // Estilo de gradiente para cada beam
  const getBeamGradient = (index: number) => {
    if (color === 'rainbow') {
      const hue = (index / count) * 360;
      return `linear-gradient(to ${direction === 'up' || direction === 'down' ? 'bottom' : 'right'},
        transparent,
        hsla(${hue}, 100%, 60%, ${opacity}),
        transparent
      )`;
    }

    const directionMap = {
      up: 'to bottom',
      down: 'to top',
      left: 'to right',
      right: 'to left',
    };

    return `linear-gradient(${directionMap[direction]},
      transparent,
      ${beamColor},
      transparent
    )`;
  };

  // Posição e animação baseadas na direção
  const getBeamStyle = (index: number) => {
    const isVertical = direction === 'up' || direction === 'down';
    const position = (index / count) * 100;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      background: getBeamGradient(index),
      opacity: opacity,
      filter: blur ? `blur(${width}px)` : 'none',
      animationDelay: `${index * stagger}ms`,
      animationDuration: `${duration}ms`,
    };

    if (isVertical) {
      return {
        ...baseStyle,
        left: `${position}%`,
        width: `${width}px`,
        height: '100%',
        top: direction === 'up' ? '100%' : '-100%',
      };
    } else {
      return {
        ...baseStyle,
        top: `${position}%`,
        height: `${width}px`,
        width: '100%',
        left: direction === 'right' ? '100%' : '-100%',
      };
    }
  };

  // Classe de animação baseada na direção
  const animationClass = useMemo(() => {
    const classes = {
      up: 'animate-beam-up',
      down: 'animate-beam-down',
      left: 'animate-beam-left',
      right: 'animate-beam-right',
    };
    return classes[direction];
  }, [direction]);

  return (
    <div
      className={cn('absolute inset-0 -z-10 overflow-hidden pointer-events-none', className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={animationClass}
          style={getBeamStyle(index)}
        />
      ))}

      <style>{`
        @keyframes beam-up {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: ${opacity};
          }
          90% {
            opacity: ${opacity};
          }
          100% {
            transform: translateY(-200%);
            opacity: 0;
          }
        }

        @keyframes beam-down {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: ${opacity};
          }
          90% {
            opacity: ${opacity};
          }
          100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }

        @keyframes beam-left {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          10% {
            opacity: ${opacity};
          }
          90% {
            opacity: ${opacity};
          }
          100% {
            transform: translateX(-200%);
            opacity: 0;
          }
        }

        @keyframes beam-right {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          10% {
            opacity: ${opacity};
          }
          90% {
            opacity: ${opacity};
          }
          100% {
            transform: translateX(200%);
            opacity: 0;
          }
        }

        .animate-beam-up {
          animation: beam-up linear infinite;
        }

        .animate-beam-down {
          animation: beam-down linear infinite;
        }

        .animate-beam-left {
          animation: beam-left linear infinite;
        }

        .animate-beam-right {
          animation: beam-right linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-beam-up,
          .animate-beam-down,
          .animate-beam-left,
          .animate-beam-right {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * BeamsUpstream Component
 *
 * Componente de beams que sobem pela tela (variante pré-configurada).
 *
 * @example
 * <BeamsUpstream count={8} color="primary" />
 */

export interface BeamsUpstreamProps extends Omit<BeamsProps, 'direction'> {}

export function BeamsUpstream(props: BeamsUpstreamProps) {
  return <Beams {...props} direction="up" />;
}

/**
 * CrossBeams Component
 *
 * Componente com beams cruzados (vertical e horizontal).
 *
 * @example
 * <CrossBeams
 *   verticalCount={3}
 *   horizontalCount={3}
 *   color="accent"
 * />
 */

export interface CrossBeamsProps {
  /** Número de beams verticais */
  verticalCount?: number;
  /** Número de beams horizontais */
  horizontalCount?: number;
  /** Cor dos beams */
  color?: BeamColor;
  /** Velocidade da animação */
  speed?: BeamSpeed;
  /** Aplicar blur effect */
  blur?: boolean;
  /** Classe CSS customizada */
  className?: string;
}

export function CrossBeams({
  verticalCount = 3,
  horizontalCount = 3,
  color = 'primary',
  speed = 'medium',
  blur = true,
  className,
}: CrossBeamsProps) {
  return (
    <div className={cn('relative', className)}>
      <Beams
        count={verticalCount}
        color={color}
        direction="up"
        speed={speed}
        blur={blur}
        stagger={300}
      />
      <Beams
        count={horizontalCount}
        color={color}
        direction="right"
        speed={speed}
        blur={blur}
        stagger={400}
      />
    </div>
  );
}

/**
 * RadialBeams Component
 *
 * Componente de beams que emanam radialmente de um ponto central.
 *
 * @example
 * <RadialBeams count={12} color="accent" />
 */

export interface RadialBeamsProps {
  /** Número de beams radiais */
  count?: number;
  /** Cor dos beams */
  color?: BeamColor;
  /** Velocidade da animação */
  speed?: BeamSpeed;
  /** Largura dos beams */
  width?: number;
  /** Opacidade dos beams */
  opacity?: number;
  /** Aplicar blur effect */
  blur?: boolean;
  /** Classe CSS customizada */
  className?: string;
}

export function RadialBeams({
  count = 12,
  color = 'primary',
  speed = 'medium',
  width = 2,
  opacity = 0.3,
  blur = true,
  className,
}: RadialBeamsProps) {
  const duration = useMemo(() => {
    const speeds = { slow: 8000, medium: 5000, fast: 3000 };
    return speeds[speed];
  }, [speed]);

  const beamColor = useMemo(() => {
    const colors = {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      accent: 'hsl(var(--accent))',
      white: 'rgb(255, 255, 255)',
      rainbow: null,
    };
    return colors[color];
  }, [color]);

  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden pointer-events-none', className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: count }).map((_, index) => {
          const angle = (index / count) * 360;
          const hue = (index / count) * 360;

          return (
            <div
              key={index}
              className="absolute animate-pulse-slow"
              style={{
                width: `${width}px`,
                height: '150%',
                background:
                  color === 'rainbow'
                    ? `linear-gradient(to bottom, transparent, hsla(${hue}, 100%, 60%, ${opacity}), transparent)`
                    : `linear-gradient(to bottom, transparent, ${beamColor}, transparent)`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center',
                opacity: opacity,
                filter: blur ? `blur(${width}px)` : 'none',
                animationDelay: `${index * 100}ms`,
                animationDuration: `${duration}ms`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// Export default
export default Beams;
