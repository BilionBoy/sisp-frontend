"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * AnimatedText Component
 *
 * Componente para animar texto com efeitos de digitação, fade-in, slide-in ou blur-in.
 * Ideal para títulos, hero sections e mensagens importantes.
 *
 * @example
 * <AnimatedText
 *   text="SISP - Sistema Integrado de Segurança Pública"
 *   effect="typing"
 *   speed={50}
 *   showCursor={true}
 * />
 */

export type AnimationEffect = 'typing' | 'fade-in' | 'slide-in' | 'blur-in' | 'word-fade' | 'char-fade';

export interface AnimatedTextProps {
  /** Texto a ser animado */
  text: string;
  /** Efeito de animação */
  effect?: AnimationEffect;
  /** Velocidade da animação em ms (menor = mais rápido) */
  speed?: number;
  /** Mostrar cursor piscante (apenas para typing) */
  showCursor?: boolean;
  /** Classe CSS customizada */
  className?: string;
  /** Delay antes de iniciar animação (ms) */
  delay?: number;
  /** Callback ao completar animação */
  onComplete?: () => void;
  /** Tag HTML do elemento (padrão: span) */
  as?: keyof JSX.IntrinsicElements;
  /** Animar por palavra ao invés de caractere (typing e fade-in) */
  byWord?: boolean;
}

export function AnimatedText({
  text,
  effect = 'fade-in',
  speed = 50,
  showCursor = false,
  className,
  delay = 0,
  onComplete,
  as: Component = 'span',
  byWord = false,
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [words, setWords] = useState<string[]>([]);

  // Processar texto em palavras ou caracteres
  useEffect(() => {
    if (byWord) {
      setWords(text.split(' '));
    }
  }, [text, byWord]);

  // Animação de digitação
  const handleTyping = useCallback(() => {
    if (currentIndex < text.length) {
      setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay + speed);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, delay, speed, isComplete, onComplete]);

  useEffect(() => {
    if (effect === 'typing') {
      handleTyping();
    } else {
      // Para outros efeitos, mostrar texto completo imediatamente
      const timer = setTimeout(() => {
        setDisplayedText(text);
        setIsComplete(true);
        onComplete?.();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [effect, handleTyping, text, delay, onComplete]);

  // Renderização baseada no efeito
  const renderContent = () => {
    const baseClasses = cn(className);

    switch (effect) {
      case 'typing':
        return (
          <Component className={baseClasses}>
            {displayedText}
            {showCursor && !isComplete && (
              <span className="inline-block w-[2px] h-[1em] bg-current ml-1 animate-pulse" />
            )}
          </Component>
        );

      case 'fade-in':
        if (byWord) {
          return (
            <Component className={baseClasses}>
              {words.map((word, index) => (
                <span
                  key={index}
                  className="inline-block opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${delay + index * speed}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  {word}
                  {index < words.length - 1 && '\u00A0'}
                </span>
              ))}
            </Component>
          );
        }
        return (
          <Component
            className={cn(baseClasses, 'animate-fade-in')}
            style={{ animationDelay: `${delay}ms` }}
          >
            {displayedText}
          </Component>
        );

      case 'slide-in':
        if (byWord) {
          return (
            <Component className={baseClasses}>
              {words.map((word, index) => (
                <span
                  key={index}
                  className="inline-block opacity-0 animate-slide-up"
                  style={{
                    animationDelay: `${delay + index * speed}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  {word}
                  {index < words.length - 1 && '\u00A0'}
                </span>
              ))}
            </Component>
          );
        }
        return (
          <Component
            className={cn(baseClasses, 'animate-slide-up')}
            style={{ animationDelay: `${delay}ms` }}
          >
            {displayedText}
          </Component>
        );

      case 'blur-in':
        if (byWord) {
          return (
            <Component className={baseClasses}>
              {words.map((word, index) => (
                <span
                  key={index}
                  className="inline-block opacity-0 animate-blur-in"
                  style={{
                    animationDelay: `${delay + index * speed}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  {word}
                  {index < words.length - 1 && '\u00A0'}
                </span>
              ))}
            </Component>
          );
        }
        return (
          <Component
            className={cn(baseClasses, 'animate-blur-in')}
            style={{ animationDelay: `${delay}ms` }}
          >
            {displayedText}
          </Component>
        );

      case 'char-fade':
        return (
          <Component className={baseClasses}>
            {text.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${delay + index * speed}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </Component>
        );

      case 'word-fade':
        return (
          <Component className={baseClasses}>
            {text.split(' ').map((word, index) => (
              <span
                key={index}
                className="inline-block opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${delay + index * speed}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {word}
                {index < text.split(' ').length - 1 && '\u00A0'}
              </span>
            ))}
          </Component>
        );

      default:
        return <Component className={baseClasses}>{displayedText}</Component>;
    }
  };

  return <>{renderContent()}</>;
}

/**
 * AnimatedHeading Component
 *
 * Componente wrapper para criar títulos animados facilmente.
 *
 * @example
 * <AnimatedHeading level={1} effect="typing" speed={80}>
 *   SISP Porto Velho
 * </AnimatedHeading>
 */

export interface AnimatedHeadingProps extends Omit<AnimatedTextProps, 'text' | 'as'> {
  children: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function AnimatedHeading({
  children,
  level = 1,
  className,
  ...props
}: AnimatedHeadingProps) {
  const headingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <AnimatedText
      text={children}
      as={headingTag}
      className={cn('font-display font-bold', className)}
      {...props}
    />
  );
}

/**
 * AnimatedGradientText Component
 *
 * Componente para texto animado com gradiente.
 *
 * @example
 * <AnimatedGradientText effect="word-fade" speed={100}>
 *   Segurança Pública de Porto Velho
 * </AnimatedGradientText>
 */

export interface AnimatedGradientTextProps extends Omit<AnimatedTextProps, 'text'> {
  children: string;
  gradient?: 'primary' | 'secondary' | 'accent' | 'full';
}

export function AnimatedGradientText({
  children,
  gradient = 'full',
  className,
  ...props
}: AnimatedGradientTextProps) {
  const gradientClass = {
    primary: 'text-gradient-primary',
    secondary: 'text-gradient-secondary',
    accent: 'text-gradient-accent',
    full: 'text-gradient',
  }[gradient];

  return (
    <AnimatedText
      text={children}
      className={cn('font-display font-bold', gradientClass, className)}
      {...props}
    />
  );
}

// Export default
export default AnimatedText;
