"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * ExpandableDock Component
 *
 * Dock expansível estilo macOS com ícones, magnification ao hover e tooltips.
 * Ideal para quick actions, navigation dock e sidebar collapsed.
 *
 * @example
 * <ExpandableDock
 *   items={[
 *     { icon: <HomeIcon />, label: 'Home', onClick: () => {} },
 *     { icon: <SearchIcon />, label: 'Search', onClick: () => {} },
 *   ]}
 *   position="bottom"
 * />
 */

export type DockPosition = 'top' | 'bottom' | 'left' | 'right';
export type DockSize = 'small' | 'medium' | 'large';

export interface DockItem {
  /** Ícone do item */
  icon: React.ReactNode;
  /** Label para tooltip */
  label: string;
  /** Callback ao clicar */
  onClick?: () => void;
  /** Link para navegação */
  href?: string;
  /** Badge count (opcional) */
  badge?: number;
  /** Item ativo */
  active?: boolean;
  /** Item desabilitado */
  disabled?: boolean;
}

export interface ExpandableDockProps {
  /** Items do dock */
  items: DockItem[];
  /** Posição do dock */
  position?: DockPosition;
  /** Tamanho base dos ícones */
  size?: DockSize;
  /** Habilitar magnification ao hover */
  magnify?: boolean;
  /** Fator de magnification (1.0 - 2.0) */
  magnifyFactor?: number;
  /** Classe CSS customizada */
  className?: string;
}

export function ExpandableDock({
  items,
  position = 'bottom',
  size = 'medium',
  magnify = true,
  magnifyFactor = 1.5,
  className,
}: ExpandableDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Tamanhos base dos ícones
  const iconSizes = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const baseSize = iconSizes[size];
  const maxSize = baseSize * magnifyFactor;

  // Calcular escala baseada na proximidade do hover
  const getScale = (index: number) => {
    if (!magnify || hoveredIndex === null) return 1;

    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return magnifyFactor;
    if (distance === 1) return 1 + (magnifyFactor - 1) * 0.5;
    if (distance === 2) return 1 + (magnifyFactor - 1) * 0.25;
    return 1;
  };

  // Classes baseadas na posição
  const containerClasses = cn(
    'fixed z-50 flex gap-2 p-3 rounded-2xl backdrop-blur-md bg-background/80 border border-border shadow-xl',
    {
      'bottom-4 left-1/2 -translate-x-1/2 flex-row': position === 'bottom',
      'top-4 left-1/2 -translate-x-1/2 flex-row': position === 'top',
      'left-4 top-1/2 -translate-y-1/2 flex-col': position === 'left',
      'right-4 top-1/2 -translate-y-1/2 flex-col': position === 'right',
    },
    className
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div className={containerClasses}>
        {items.map((item, index) => {
          const scale = getScale(index);
          const isHorizontal = position === 'top' || position === 'bottom';

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  onClick={item.onClick}
                  disabled={item.disabled}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    'relative flex items-center justify-center rounded-xl transition-all duration-300 ease-spring',
                    'hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    item.active && 'bg-primary/10',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  style={{
                    width: `${baseSize * scale}px`,
                    height: `${baseSize * scale}px`,
                    transformOrigin: isHorizontal ? 'bottom center' : 'center left',
                  }}
                >
                  {/* Ícone */}
                  <div
                    className={cn(
                      'flex items-center justify-center transition-all duration-300',
                      item.active ? 'text-primary' : 'text-foreground'
                    )}
                    style={{
                      fontSize: `${(baseSize * scale) * 0.5}px`,
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
                      {item.badge > 99 ? '99+' : item.badge}
                    </div>
                  )}

                  {/* Active indicator */}
                  {item.active && (
                    <div
                      className={cn(
                        'absolute bg-primary rounded-full',
                        isHorizontal ? '-bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5' : '-left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5'
                      )}
                    />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side={position === 'bottom' ? 'top' : position === 'top' ? 'bottom' : position === 'left' ? 'right' : 'left'}
              >
                <p className="font-medium">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

/**
 * FloatingDock Component
 *
 * Variante do dock que flutua na tela com glassmorphism effect.
 *
 * @example
 * <FloatingDock items={dockItems} position="bottom" />
 */

export interface FloatingDockProps extends ExpandableDockProps {
  /** Habilitar auto-hide ao não usar */
  autoHide?: boolean;
}

export function FloatingDock({ autoHide = false, className, ...props }: FloatingDockProps) {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    if (!autoHide) return;

    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsVisible(false), 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [autoHide]);

  return (
    <div
      className={cn(
        'transition-all duration-300',
        !isVisible && 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <ExpandableDock
        {...props}
        className={cn('glass-card', className)}
      />
    </div>
  );
}

/**
 * DockSeparator Component
 *
 * Separador visual para organizar items do dock.
 */

export function DockSeparator() {
  return (
    <div className="w-px h-8 bg-border mx-1" aria-hidden="true" />
  );
}

/**
 * CompactDock Component
 *
 * Versão compacta do dock para espaços reduzidos.
 *
 * @example
 * <CompactDock items={dockItems} vertical />
 */

export interface CompactDockProps {
  items: DockItem[];
  vertical?: boolean;
  className?: string;
}

export function CompactDock({ items, vertical = false, className }: CompactDockProps) {
  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex gap-1 p-2 rounded-lg bg-muted/50',
          vertical ? 'flex-col' : 'flex-row',
          className
        )}
      >
        {items.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button
                onClick={item.onClick}
                disabled={item.disabled}
                className={cn(
                  'relative w-10 h-10 flex items-center justify-center rounded-md',
                  'transition-colors duration-200',
                  'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring',
                  item.active && 'bg-primary/10 text-primary',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-semibold rounded-full">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side={vertical ? 'right' : 'top'}>
              <p className="text-xs">{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

// Export default
export default ExpandableDock;
