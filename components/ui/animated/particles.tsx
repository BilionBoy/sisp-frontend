"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Particles Component
 *
 * Sistema de partículas animadas para backgrounds decorativos.
 * Suporta movimento browniano, direcional e interatividade opcional.
 *
 * @example
 * <Particles
 *   count={50}
 *   shape="circle"
 *   color="primary"
 *   movement="float"
 *   speed="medium"
 * />
 */

export type ParticleShape = 'circle' | 'square' | 'triangle' | 'star' | 'hexagon';
export type ParticleMovement = 'float' | 'rise' | 'fall' | 'drift' | 'static';
export type ParticleSpeed = 'slow' | 'medium' | 'fast';
export type ParticleColor = 'primary' | 'secondary' | 'accent' | 'white' | 'rainbow';

export interface ParticlesProps {
  /** Número de partículas */
  count?: number;
  /** Forma das partículas */
  shape?: ParticleShape;
  /** Cor das partículas */
  color?: ParticleColor;
  /** Tipo de movimento */
  movement?: ParticleMovement;
  /** Velocidade da animação */
  speed?: ParticleSpeed;
  /** Tamanho mínimo das partículas (px) */
  minSize?: number;
  /** Tamanho máximo das partículas (px) */
  maxSize?: number;
  /** Opacidade das partículas (0-1) */
  opacity?: number;
  /** Aplicar blur effect */
  blur?: boolean;
  /** Classe CSS customizada */
  className?: string;
}

export function Particles({
  count = 50,
  shape = 'circle',
  color = 'primary',
  movement = 'float',
  speed = 'medium',
  minSize = 2,
  maxSize = 6,
  opacity = 0.5,
  blur = false,
  className,
}: ParticlesProps) {
  // Duração da animação baseada na velocidade
  const duration = useMemo(() => {
    const speeds = { slow: 30, medium: 20, fast: 10 };
    return speeds[speed];
  }, [speed]);

  // Gerar partículas com posições e propriedades aleatórias
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      const size = Math.random() * (maxSize - minSize) + minSize;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * duration;
      const animDuration = duration + Math.random() * duration * 0.5;

      // Movimento específico
      let moveX = 0;
      let moveY = 0;

      switch (movement) {
        case 'float':
          moveX = (Math.random() - 0.5) * 100;
          moveY = (Math.random() - 0.5) * 100;
          break;
        case 'rise':
          moveX = (Math.random() - 0.5) * 30;
          moveY = -100 - Math.random() * 50;
          break;
        case 'fall':
          moveX = (Math.random() - 0.5) * 30;
          moveY = 100 + Math.random() * 50;
          break;
        case 'drift':
          moveX = 50 + Math.random() * 50;
          moveY = (Math.random() - 0.5) * 30;
          break;
        case 'static':
          moveX = 0;
          moveY = 0;
          break;
      }

      return {
        id: index,
        size,
        x,
        y,
        delay,
        duration: animDuration,
        moveX,
        moveY,
        rotation: Math.random() * 360,
      };
    });
  }, [count, duration, maxSize, minSize, movement]);

  // Cor da partícula
  const getParticleColor = (index: number) => {
    if (color === 'rainbow') {
      const hue = (index / count) * 360;
      return `hsla(${hue}, 100%, 60%, ${opacity})`;
    }

    const colors = {
      primary: `hsla(var(--primary), ${opacity})`,
      secondary: `hsla(var(--secondary), ${opacity})`,
      accent: `hsla(var(--accent), ${opacity})`,
      white: `rgba(255, 255, 255, ${opacity})`,
    };

    return colors[color as keyof typeof colors];
  };

  // Renderizar forma da partícula
  const renderShape = (particle: (typeof particles)[0]) => {
    const colorValue = getParticleColor(particle.id);
    const baseStyle: React.CSSProperties = {
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: colorValue,
      filter: blur ? `blur(${particle.size * 0.3}px)` : 'none',
    };

    switch (shape) {
      case 'circle':
        return (
          <div
            style={{
              ...baseStyle,
              borderRadius: '50%',
            }}
          />
        );

      case 'square':
        return (
          <div
            style={{
              ...baseStyle,
              borderRadius: `${particle.size * 0.2}px`,
            }}
          />
        );

      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${particle.size}px solid transparent`,
              borderRight: `${particle.size}px solid transparent`,
              borderBottom: `${particle.size * 1.5}px solid ${colorValue}`,
              filter: blur ? `blur(${particle.size * 0.3}px)` : 'none',
            }}
          />
        );

      case 'star':
        return (
          <svg
            width={particle.size * 2}
            height={particle.size * 2}
            viewBox="0 0 24 24"
            fill={colorValue}
            style={{
              filter: blur ? `blur(${particle.size * 0.3}px)` : 'none',
            }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );

      case 'hexagon':
        return (
          <svg
            width={particle.size * 2}
            height={particle.size * 2}
            viewBox="0 0 24 24"
            fill={colorValue}
            style={{
              filter: blur ? `blur(${particle.size * 0.3}px)` : 'none',
            }}
          >
            <path d="M12 2l9 5v10l-9 5-9-5V7z" />
          </svg>
        );

      default:
        return <div style={baseStyle} />;
    }
  };

  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden pointer-events-none', className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={movement !== 'static' ? 'animate-particle' : ''}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            // @ts-ignore - CSS custom properties
            '--particle-x': `${particle.moveX}px`,
            '--particle-y': `${particle.moveY}px`,
          }}
        >
          <div
            style={{
              transform: `rotate(${particle.rotation}deg)`,
            }}
          >
            {renderShape(particle)}
          </div>
        </div>
      ))}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-particle {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * FloatingParticles Component
 *
 * Variante pré-configurada com partículas flutuantes suaves.
 *
 * @example
 * <FloatingParticles count={30} color="accent" />
 */

export interface FloatingParticlesProps extends Omit<ParticlesProps, 'movement'> {}

export function FloatingParticles(props: FloatingParticlesProps) {
  return <Particles {...props} movement="float" />;
}

/**
 * RisingParticles Component
 *
 * Variante pré-configurada com partículas que sobem.
 *
 * @example
 * <RisingParticles count={40} shape="circle" color="primary" />
 */

export interface RisingParticlesProps extends Omit<ParticlesProps, 'movement'> {}

export function RisingParticles(props: RisingParticlesProps) {
  return <Particles {...props} movement="rise" />;
}

/**
 * StarField Component
 *
 * Campo de estrelas animado para efeito espacial.
 *
 * @example
 * <StarField count={100} />
 */

export interface StarFieldProps {
  /** Número de estrelas */
  count?: number;
  /** Velocidade de piscada */
  speed?: ParticleSpeed;
  /** Tamanho mínimo das estrelas */
  minSize?: number;
  /** Tamanho máximo das estrelas */
  maxSize?: number;
  /** Classe CSS customizada */
  className?: string;
}

export function StarField({
  count = 100,
  speed = 'slow',
  minSize = 1,
  maxSize = 3,
  className,
}: StarFieldProps) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (maxSize - minSize) + minSize,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));
  }, [count, minSize, maxSize]);

  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-black', className)}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-pulse-slow"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * SnowParticles Component
 *
 * Efeito de neve caindo suavemente.
 *
 * @example
 * <SnowParticles count={50} />
 */

export interface SnowParticlesProps {
  /** Número de flocos de neve */
  count?: number;
  /** Velocidade da queda */
  speed?: ParticleSpeed;
  /** Classe CSS customizada */
  className?: string;
}

export function SnowParticles({ count = 50, speed = 'medium', className }: SnowParticlesProps) {
  return (
    <Particles
      count={count}
      shape="circle"
      color="white"
      movement="fall"
      speed={speed}
      minSize={2}
      maxSize={6}
      opacity={0.8}
      blur={true}
      className={className}
    />
  );
}

// Export default
export default Particles;
