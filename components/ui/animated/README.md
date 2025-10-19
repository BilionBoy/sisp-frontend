# SISP Animated Components

Biblioteca completa de componentes animados para o Sistema Integrado de Segurança Pública de Porto Velho.

## Componentes Disponíveis

### 1. AnimatedText
Texto com efeitos de animação (typing, fade-in, slide-in, blur-in).

```tsx
import { AnimatedText, AnimatedHeading, AnimatedGradientText } from '@/components/ui/animated';

<AnimatedText text="SISP" effect="typing" speed={50} showCursor />
<AnimatedHeading level={1} effect="slide-in">Título</AnimatedHeading>
<AnimatedGradientText gradient="full">Gradiente</AnimatedGradientText>
```

### 2. BackgroundPaths
Backgrounds animados com SVG paths ou gradientes.

```tsx
import { BackgroundPaths, BackgroundGradientAnimation } from '@/components/ui/animated';

<BackgroundPaths variant="waves" color="primary" opacity={0.2} />
<BackgroundGradientAnimation colors={['primary', 'accent']} />
```

### 3. Beams
Feixes de luz animados (laser beams).

```tsx
import { Beams, BeamsUpstream, CrossBeams, RadialBeams } from '@/components/ui/animated';

<BeamsUpstream count={5} color="primary" />
<CrossBeams verticalCount={3} horizontalCount={3} />
<RadialBeams count={12} color="accent" />
```

### 4. Particles
Sistema de partículas animadas.

```tsx
import { Particles, FloatingParticles, StarField } from '@/components/ui/animated';

<FloatingParticles count={30} color="primary" />
<StarField count={100} />
```

### 5. VenomBeam
Efeito de beam orgânico com gradientes.

```tsx
import { VenomBeam, VenomBorder, VenomHighlight } from '@/components/ui/animated';

<VenomBeam colors="rainbow" intensity={0.6} />
<VenomBorder colors="rainbow"><div>Content</div></VenomBorder>
<VenomHighlight colors="accent">Texto</VenomHighlight>
```

### 6. ExpandableDock
Dock expansível estilo macOS.

```tsx
import { ExpandableDock, FloatingDock } from '@/components/ui/animated';

const items = [
  { icon: <HomeIcon />, label: 'Home', onClick: () => {} },
];

<ExpandableDock items={items} position="bottom" magnify />
<FloatingDock items={items} autoHide />
```

### 7. GradientBorder
Borda animada com gradiente.

```tsx
import { GradientBorder, GradientCard, GradientText } from '@/components/ui/animated';

<GradientBorder gradient="rainbow" animate>
  <div>Content</div>
</GradientBorder>

<GradientCard gradient="primary">Card Content</GradientCard>
<GradientText gradient="rainbow">Text</GradientText>
```

### 8. ShimmerButton
Botões com efeito shimmer.

```tsx
import { ShimmerButton, GradientShimmerButton } from '@/components/ui/animated';

<ShimmerButton variant="primary" size="lg" glow ripple>
  Click Me
</ShimmerButton>

<GradientShimmerButton gradient="rainbow">
  Premium
</GradientShimmerButton>
```

### 9. FloatingElements
Elementos flutuantes decorativos.

```tsx
import { FloatingElements, FloatingShapes, FloatingIcons } from '@/components/ui/animated';

<FloatingElements count={5} speed="slow" />
<FloatingShapes shapes={['circle', 'square']} count={10} />
<FloatingIcons icons={[<Icon />]} count={8} />
```

## Características

- TypeScript completo com tipos bem definidos
- Suporte a Dark Mode
- Acessibilidade (prefers-reduced-motion)
- Performance otimizada (CSS animations)
- Configurável e extensível
- Documentação inline

## Performance

Todos os componentes seguem as melhores práticas:

- Uso de CSS animations (GPU-accelerated)
- Animações pausadas com `prefers-reduced-motion`
- Lazy loading quando apropriado
- Memoização de valores computados
- Evita layout thrashing

## Acessibilidade

- Contraste de cores WCAG 2.1 AA
- Suporte a reduced motion
- ARIA labels quando necessário
- Navegação por teclado
- Focus states visíveis

## Documentação

Para documentação completa, veja:
- `/docs/DESIGN_SYSTEM.md` - Documentação técnica
- `/docs/BRAND_GUIDELINES.md` - Guia de identidade visual
- `/design-system` - Showcase interativo

## Licença

© 2025 Sistema Integrado de Segurança Pública de Porto Velho
