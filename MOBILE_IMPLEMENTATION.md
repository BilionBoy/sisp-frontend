# Implementação Mobile - SISP

## Visão Geral

Implementação completa de uma interface mobile-first para o Sistema Integrado de Segurança Pública (SISP), com foco em gestão de ocorrências policiais em dispositivos móveis.

---

## Estrutura de Arquivos

### Páginas (App Router)

```
app/
├── ocorrencias-mobile/
│   ├── page.tsx                    # Lista de ocorrências mobile
│   └── [id]/
│       └── page.tsx                # Detalhes de ocorrência específica
└── ocorrencias/
    └── page.tsx                    # Desktop (com redirecionamento mobile)
```

### Componentes Mobile

```
components/mobile/
├── ocorrencia-card-mobile.tsx      # Card de ocorrência otimizado touch
├── ocorrencia-details-mobile.tsx   # Tela de detalhes completa
├── encerrar-ocorrencia-sheet.tsx   # Bottom sheet para encerramento
└── mobile-redirect.tsx             # Componente de redirecionamento
```

### Hooks

```
lib/hooks/
└── use-mobile-detection.ts         # Detecção de dispositivo mobile
```

### Estilos

```
styles/
└── mobile.css                      # Otimizações CSS mobile
```

---

## Funcionalidades Implementadas

### 1. Tela de Listagem Mobile (`/ocorrencias-mobile`)

**Características:**
- Header fixo com logo SISP e botão refresh
- Filtros de prioridade (Todas, Alta, Média, Baixa) com contadores
- Cards otimizados para touch (min 44x44px)
- Infinite scroll com Intersection Observer
- Pull-to-refresh
- Loading states e skeletons
- Empty states contextuais
- Contador fixo no rodapé

**Tecnologias:**
- Next.js 15 App Router
- React Query (infinite queries)
- Shadcn/ui components
- Tailwind CSS

**Performance:**
- Virtual scrolling via Intersection Observer
- Cache offline (IndexedDB integrado)
- Debounced filters
- Optimistic updates

### 2. Tela de Detalhes (`/ocorrencias-mobile/[id]`)

**Layout:**
- Header com navegação back
- Mapa interativo (35% da tela)
  - Leaflet com SSR desabilitado
  - Marker centralizado
  - Controles de zoom touch-friendly
- Seção scrollable com:
  - Header da ocorrência (tipo, status, prioridade)
  - Card de localização (endereço, bairro, coordenadas)
  - Card de data/hora
  - Card de informações adicionais (vítimas, prejuízo)
- Botões de ação fixos no rodapé

**Funcionalidades:**
- Visualização completa de dados
- Botão "Encerrar Ocorrência" (se não resolvida)
- Formatação de datas/valores em PT-BR
- Badges de prioridade e status
- Safe areas (iOS notch)

### 3. Bottom Sheet de Encerramento

**Características:**
- Sheet responsivo (85-90vh)
- Formulário de encerramento:
  - Select de resultado (5 opções)
  - Textarea de observações (max 1000 chars)
  - Counter de caracteres
  - Validação de campos obrigatórios
- Informações importantes destacadas
- Loading states durante submit
- Toast de sucesso/erro
- Navegação automática após sucesso

**UX:**
- Bloqueio de dismiss durante submit
- Animações suaves (200ms)
- Feedback visual imediato
- Acessibilidade ARIA

### 4. Redirecionamento Automático

**Componente:** `MobileRedirect`

**Lógica:**
- Detecção via media query (max-width: 768px)
- Redirect apenas após hydration
- Evita redirect se já estiver em rota mobile
- Configurável por rota

**Uso:**
```tsx
<MobileRedirect
  mobileRoute="/ocorrencias-mobile"
  desktopRoutes={["/ocorrencias"]}
/>
```

---

## Design System

### Cores de Prioridade

```typescript
high: {
  bg: "bg-red-50 dark:bg-red-950/20"
  badge: "bg-red-500"
  label: "Alta Prioridade"
}

medium: {
  bg: "bg-amber-50 dark:bg-amber-950/20"
  badge: "bg-amber-500"
  label: "Média Prioridade"
}

low: {
  bg: "bg-blue-50 dark:bg-blue-950/20"
  badge: "bg-blue-500"
  label: "Baixa Prioridade"
}
```

### Status de Ocorrência

```typescript
"Registrada"       → Badge default + FileText icon
"Em Investigação"  → Badge secondary + AlertTriangle icon
"Resolvida"        → Badge outline + CheckCircle2 icon
"Arquivada"        → Badge outline + FileText icon
```

### Touch Targets

- **Mínimo:** 44x44px (WCAG AAA)
- **Botões:** height: 44px (sm), 48px (default), 52px (lg)
- **Cards:** Active scale 98% para feedback tátil

### Tipografia Mobile

```css
/* Prevenir zoom iOS em inputs */
input, select, textarea {
  font-size: 16px !important;
}
```

---

## Otimizações de Performance

### 1. Infinite Scroll

```typescript
// Intersection Observer para lazy loading
const observerRef = useRef<IntersectionObserver>()

observerRef.current = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
      loadMore()
    }
  },
  { threshold: 0.1 }
)
```

### 2. Cache Offline

- IndexedDB integrado via `cacheDB`
- TTL de 10 minutos para ocorrências
- Fallback automático em caso de erro API

### 3. Otimizações CSS

```css
/* Hardware acceleration */
.card-mobile {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}

/* Smooth scrolling iOS */
html {
  -webkit-overflow-scrolling: touch;
}

/* Reduce motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

### 4. Leaflet Map Mobile

```css
.leaflet-container {
  touch-action: pan-x pan-y;
}

/* Botões maiores para touch */
.leaflet-control-zoom a {
  width: 36px;
  height: 36px;
}
```

---

## Acessibilidade

### ARIA Labels

```tsx
<Button aria-label="Atualizar lista de ocorrências">
  <RefreshCw />
</Button>
```

### Keyboard Navigation

- Tab order lógico
- Focus visible em todos interativos
- Escape para fechar modals/sheets

### Screen Readers

- Semantic HTML (header, main, footer)
- Alt texts em ícones importantes
- Live regions para toasts

### Color Contrast

- WCAG AA mínimo
- Badges com contraste 4.5:1
- Dark mode suportado

---

## Integração com API

### Hook Principal: `useOcorrenciasQuery`

```typescript
const {
  incidents,        // Incident[]
  isLoading,        // boolean
  error,            // Error | null
  refresh,          // () => void
  createOcorrencia, // (payload) => Promise<Incident>
  updateOcorrencia, // (id, payload) => Promise<Incident>
} = useOcorrenciasQuery()
```

### Atualização de Status

```typescript
// Encerrar ocorrência
await updateOcorrencia(id, {
  status_ocorrencia: "Resolvida"
})

// Status disponíveis (ENUM PostgreSQL)
// 'Registrada' | 'Em Investigação' | 'Resolvida' | 'Arquivada'
```

### Cache Strategy

1. Carregar do cache (IndexedDB)
2. Setar dados imediatamente
3. Fetch da API em background
4. Update cache e UI
5. Em caso de erro: fallback para cache

---

## Navegação Mobile

### Rotas

```
/ocorrencias-mobile          → Lista
/ocorrencias-mobile/[id]     → Detalhes
/ocorrencias                 → Desktop (redireciona mobile)
```

### Fluxo do Usuário

```
1. Usuário acessa /ocorrencias em mobile
2. MobileRedirect detecta mobile
3. Redirect automático para /ocorrencias-mobile
4. Lista carregada com infinite scroll
5. Clique em card → /ocorrencias-mobile/[id]
6. Visualização de detalhes
7. Botão "Encerrar" → Bottom sheet
8. Submit → Toast → Redirect para lista
```

---

## Testes Recomendados

### Dispositivos

- **iOS:** iPhone SE (375x667), iPhone 12 Pro (390x844)
- **Android:** Pixel 5 (393x851), Galaxy S21 (360x800)
- **Tablets:** iPad Mini (768x1024)

### Navegadores

- Safari Mobile (iOS)
- Chrome Mobile (Android)
- Firefox Mobile

### Cenários de Teste

1. **Infinite Scroll:**
   - Scroll até final da lista
   - Verificar loading indicator
   - Confirmar novos itens carregados

2. **Filtros:**
   - Alternar entre prioridades
   - Verificar contadores atualizados
   - Confirmar lista filtrada

3. **Detalhes:**
   - Navegar para ocorrência
   - Verificar mapa renderizado
   - Testar zoom/pan do mapa
   - Verificar todos campos exibidos

4. **Encerramento:**
   - Abrir bottom sheet
   - Tentar submit sem preencher
   - Preencher e submeter
   - Verificar toast e redirect

5. **Offline:**
   - Desconectar rede
   - Verificar cache funcionando
   - Reconectar e verificar sync

6. **Performance:**
   - Medir Core Web Vitals
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## Melhorias Futuras

### v1.1 - Gestos

- [ ] Swipe para atualizar (pull-to-refresh nativo)
- [ ] Swipe horizontal para navegar entre ocorrências
- [ ] Long press para ações rápidas

### v1.2 - PWA

- [ ] Service Worker para offline completo
- [ ] App manifest
- [ ] Ícones adaptivos (iOS/Android)
- [ ] Splash screens
- [ ] Push notifications

### v1.3 - Features

- [ ] Câmera integrada para fotos de evidência
- [ ] Geolocalização automática
- [ ] Modo offline-first completo
- [ ] Sincronização em background
- [ ] Filtros avançados (data, zona, tipo)

### v1.4 - Acessibilidade

- [ ] Voice commands
- [ ] Modo de alto contraste
- [ ] Tamanho de fonte ajustável
- [ ] Navegação simplificada

---

## Troubleshooting

### Problema: Hydration Error

**Solução:** Usar `hasMounted` antes de renderizar conteúdo dependente de `window`

```tsx
const [hasMounted, setHasMounted] = useState(false)

useEffect(() => {
  setHasMounted(true)
}, [])

if (!hasMounted) return null
```

### Problema: Mapa não carrega

**Solução:** Garantir que Leaflet é carregado com `ssr: false`

```tsx
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
```

### Problema: Infinite scroll não dispara

**Solução:** Verificar threshold e cleanup do observer

```tsx
return () => {
  if (observerRef.current) {
    observerRef.current.disconnect()
  }
}
```

---

## Recursos

### Documentação

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Leaflet](https://react-leaflet.js.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn/ui](https://ui.shadcn.com/)

### Design References

- [Material Design Mobile](https://m3.material.io/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Contato

Para dúvidas ou sugestões sobre a implementação mobile, consulte a documentação do projeto principal ou abra uma issue no repositório.

**Última atualização:** 2025-10-19
