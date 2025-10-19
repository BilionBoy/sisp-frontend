# 📐 Arquitetura do Sistema SISP Frontend

## 🎯 Visão Geral

O **SISP Frontend** é uma aplicação **Progressive Web App (PWA)** construída com **Next.js 15.2.4** e **React 19**, desenvolvida para a Prefeitura de Porto Velho como sistema de gestão e monitoramento de segurança pública municipal.

### Características Principais

- ✅ **Framework**: Next.js 15 (App Router)
- ✅ **UI Library**: React 19
- ✅ **Linguagem**: TypeScript 5
- ✅ **Estilização**: Tailwind CSS 4.1.9
- ✅ **Componentes**: Radix UI + shadcn/ui
- ✅ **Mapas**: Leaflet + React Leaflet
- ✅ **State Management**: TanStack Query (React Query)
- ✅ **Notificações**: Sonner + Web Push Notifications
- ✅ **PWA**: next-pwa com Service Workers customizados
- ✅ **Backend**: Rails API (http://10.0.1.66:3000/api/v1)

---

## 🏗️ Estrutura de Diretórios

```
sisp-frontend/
├── app/                          # App Router do Next.js
│   ├── actions/                  # Server Actions
│   │   └── push-notifications.ts # Gerenciamento de push notifications
│   ├── ocorrencias/              # Página principal (Desktop)
│   │   └── page.tsx              # Mapa interativo + listagem
│   ├── ocorrencias-mobile/       # Versão mobile otimizada
│   │   ├── page.tsx              # Lista de ocorrências
│   │   └── [id]/page.tsx         # Detalhes da ocorrência
│   ├── layout.tsx                # Layout raiz com providers
│   ├── page.tsx                  # Redirect inteligente mobile/desktop
│   ├── providers.tsx             # React Query + Notifications
│   ├── manifest.ts               # PWA Manifest (Next.js 15)
│   └── globals.css               # Estilos globais
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes shadcn/ui
│   ├── maps/                     # Componentes de mapas
│   ├── mobile/                   # Componentes mobile-specific
│   ├── cameras/                  # Sistema de câmeras
│   ├── header/                   # Header e navegação
│   ├── sidebar/                  # Sidebar (desktop)
│   ├── pwa/                      # Componentes PWA
│   ├── create-ocorrencia-modal.tsx
│   ├── incident-details.tsx
│   ├── ocorrencias-list-compact.tsx
│   └── ... (outros componentes)
│
├── lib/                          # Lógica de negócio e utilitários
│   ├── services/                 # Camada de API
│   │   ├── ocorrencias-api.ts    # CRUD de ocorrências
│   │   └── tipos-crime-api.ts    # Tipos de crime
│   ├── hooks/                    # Custom React Hooks
│   │   ├── use-ocorrencias.ts    # Hook básico de ocorrências
│   │   ├── use-infinite-ocorrencias.ts # Paginação infinita
│   │   ├── use-cameras.ts        # Gerenciamento de câmeras
│   │   ├── use-notifications.ts  # Push notifications
│   │   └── ... (outros hooks)
│   ├── types/                    # TypeScript types
│   │   ├── ocorrencia-api.ts     # Tipos da API
│   │   ├── map.ts                # Tipos de mapas
│   │   └── camera.ts             # Tipos de câmeras
│   ├── mappers/                  # Transformação API → UI
│   │   └── ocorrencia-mapper.ts  # OcorrenciaAPI → Incident
│   ├── contexts/                 # React Contexts
│   │   ├── sidebar-context.tsx
│   │   └── fullscreen-context.tsx
│   ├── cache/                    # Cache Layer (IndexedDB)
│   │   └── indexed-db.ts
│   ├── data/                     # Dados estáticos e mocks
│   │   ├── bairros.ts
│   │   ├── tipos-crime.ts
│   │   └── mock-incidents.ts
│   └── utils/                    # Funções utilitárias
│       └── device.ts             # Detecção mobile/desktop
│
├── public/                       # Assets estáticos
│   ├── icons/                    # Ícones PWA
│   ├── sw.js                     # Service Worker
│   └── manifest.json (gerado)
│
├── styles/                       # CSS customizado
│   ├── map.css                   # Estilos de mapas
│   └── mobile.css                # Estilos mobile
│
├── scripts/                      # Build scripts
│   └── generate-pwa-icons.js     # Geração de ícones PWA
│
├── next.config.mjs               # Configuração Next.js + PWA
├── tailwind.config.js            # Configuração Tailwind
├── tsconfig.json                 # Configuração TypeScript
└── package.json                  # Dependências
```

---

## 🔄 Fluxo de Dados

### 1. Arquitetura de Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    UI LAYER (React)                     │
│  Components: Maps, Lists, Modals, Forms                │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              HOOKS LAYER (Custom Hooks)                 │
│  use-ocorrencias, use-infinite-ocorrencias, etc.        │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│          STATE MANAGEMENT (TanStack Query)              │
│  Cache, Refetch, Optimistic Updates, Pagination        │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│            SERVICES LAYER (API Clients)                 │
│  ocorrencias-api.ts, tipos-crime-api.ts                 │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│          MAPPERS LAYER (Data Transformation)            │
│  OcorrenciaAPI → Incident (snake_case → camelCase)      │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              BACKEND API (Rails)                        │
│  http://10.0.1.66:3000/api/v1                           │
└─────────────────────────────────────────────────────────┘
```

### 2. Fluxo de Criação de Ocorrência

```
User Action (Clicar no Mapa)
    ↓
CreateOcorrenciaModal (componente)
    ↓
onSubmit → use-infinite-ocorrencias.createOcorrencia()
    ↓
TanStack Query: useMutation
    ↓
ocorrencias-api.create(payload)
    ↓
POST /api/v1/ocorrencias
    ↓
Backend Rails processa e retorna OcorrenciaAPI
    ↓
Mapper: ocorrenciaAPIToIncident()
    ↓
TanStack Query: Optimistic Update + Cache Invalidation
    ↓
UI atualizada automaticamente (lista + mapa)
```

### 3. Fluxo de Listagem com Paginação Infinita

```
Component Mount
    ↓
use-infinite-ocorrencias (hook)
    ↓
TanStack Query: useInfiniteQuery
    ↓
fetchOcorrencias({ page: 1, per_page: 50 })
    ↓
ocorrencias-api.list(filters)
    ↓
GET /api/v1/ocorrencias?page=1&per_page=50
    ↓
Backend retorna: { ocorrencias: [...], total_count: 4000, current_page: 1, ... }
    ↓
Mapper: ocorrenciasAPIToIncidents(ocorrencias)
    ↓
Pre-load tipos_crime cache (otimização)
    ↓
Transformação paralela de 50 ocorrências
    ↓
TanStack Query armazena em cache
    ↓
Auto-load próxima página em background (100ms delay)
    ↓
Repete até hasMore === false
```

---

## 🎨 Sistema de Design

### Componentes Base (shadcn/ui)

O projeto utiliza **shadcn/ui** com componentes baseados em **Radix UI**:

- **Button**: Variantes (default, destructive, outline, secondary, ghost, link)
- **Card**: Container padrão para seções
- **Dialog/Modal**: Para formulários e detalhes
- **Select, Input, Checkbox**: Form controls
- **Toast**: Notificações (via Sonner)
- **Accordion, Tabs, Dropdown**: Navegação
- **ScrollArea**: Scroll customizado

### Temas e Cores

```css
/* Cores principais (Tailwind CSS Variables) */
--primary: Azul institucional (#003DA5)
--secondary: Verde (#76BC21)
--accent: Amarelo/Ouro (#FFD700)
--destructive: Vermelho (errors/warnings)
--muted: Cinza claro (backgrounds secundários)
```

### Responsividade

**Estratégia Mobile-First com Detecção de Dispositivo:**

- **Mobile** (`< 768px`): UI simplificada, lista vertical, sem mapa interativo
- **Tablet** (`768px - 1024px`): Layout intermediário
- **Desktop** (`> 1024px`): Mapa + sidebar + detalhes

**Redirect Inteligente** (app/page.tsx):
```typescript
if (isMobile()) {
  router.replace('/ocorrencias-mobile')
} else {
  router.replace('/ocorrencias')
}
```

---

## 🗺️ Sistema de Mapas

### Tecnologias

- **Leaflet**: Biblioteca core de mapas
- **React Leaflet**: Bindings React
- **Plugins**:
  - `leaflet.heat`: Heatmaps
  - `leaflet.markercluster`: Agrupamento de marcadores
  - `leaflet-control-geocoder`: Busca de endereços
  - `leaflet-fullscreen`: Modo fullscreen

### Componentes de Mapa

1. **EnhancedInteractiveMap** (components/maps/EnhancedInteractiveMap.tsx)
   - Mapa principal com todas as funcionalidades
   - Click para criar ocorrências
   - Heatmap de densidade criminal
   - Clusters de marcadores
   - Integração com câmeras

2. **CrimeMapInteractive** (components/crime-map-interactive.tsx)
   - Versão simplificada do mapa
   - Foco em visualização

3. **HeatMap** (components/heat-map.tsx)
   - Visualização de densidade de crimes

### Layers do Mapa

- **Base Layer**: OpenStreetMap
- **Markers Layer**: Ocorrências individuais
- **Clusters Layer**: Agrupamento de marcadores próximos
- **Heatmap Layer**: Densidade de crimes
- **Cameras Layer**: Posicionamento de câmeras de segurança

---

## 📡 Integração com Backend (Rails API)

### Endpoints Principais

**Base URL**: `http://10.0.1.66:3000/api/v1`

#### 1. Ocorrências

```
GET    /ocorrencias              # Listar (paginado)
GET    /ocorrencias/:id          # Buscar por ID
POST   /ocorrencias              # Criar nova
PUT    /ocorrencias/:id          # Atualizar
DELETE /ocorrencias/:id          # Deletar
```

**Formato de Resposta (Paginada)**:
```json
{
  "ocorrencias": [
    {
      "id_ocorrencia": 1,
      "numero_bo": "2024/001",
      "id_tipo_crime": 23,
      "id_bairro": 1,
      "data_ocorrencia": "2024-10-19",
      "hora_ocorrencia": "2024-10-19T14:30:00Z",
      "latitude_ocorrencia": "-8.74960884",
      "longitude_ocorrencia": "-63.89237171",
      "status_ocorrencia": "Registrada",
      ...
    }
  ],
  "current_page": 1,
  "per_page": 50,
  "total_pages": 80,
  "total_count": 4000
}
```

#### 2. Tipos de Crime

```
GET    /tipos_crime              # Listar todos
GET    /tipos_crime/ativos       # Listar ativos
```

### Camada de Serviços (lib/services/)

**ocorrencias-api.ts**:
```typescript
export const ocorrenciasAPI = {
  async list(filters?: OcorrenciaFilters): Promise<OcorrenciaAPI[]>
  async getById(id: number): Promise<OcorrenciaAPI>
  async create(payload: CreateOcorrenciaPayload): Promise<OcorrenciaAPI>
  async update(id: number, payload: UpdateOcorrenciaPayload): Promise<OcorrenciaAPI>
  async delete(id: number): Promise<void>
}
```

**Características**:
- ✅ Timeout de 30s (conexões mobile lentas)
- ✅ AbortController para cancelamento
- ✅ Error handling robusto
- ✅ Logs detalhados para debug
- ✅ Type-safe com TypeScript

### Sistema de Mappers

**Problema**: API usa `snake_case` (Rails), Frontend usa `camelCase` (JS)

**Solução**: Camada de mapeamento (lib/mappers/ocorrencia-mapper.ts)

```typescript
// API → UI
export async function ocorrenciaAPIToIncident(
  ocorrencia: OcorrenciaAPI
): Promise<Incident> {
  const tipoCrime = await tiposCrimeAPI.getById(ocorrencia.id_tipo_crime)

  return {
    id: `incident-${ocorrencia.id_ocorrencia}`,
    type: tipoCrime?.nome || 'Desconhecido',
    location: [
      parseFloat(ocorrencia.latitude_ocorrencia),
      parseFloat(ocorrencia.longitude_ocorrencia)
    ],
    address: ocorrencia.logradouro || 'Endereço não informado',
    time: formatDateTime(ocorrencia.data_ocorrencia, ocorrencia.hora_ocorrencia),
    severity: mapSeverity(tipoCrime?.gravidade),
    status: ocorrencia.status_ocorrencia,
    _apiData: ocorrencia // Preserva dados originais
  }
}
```

**Otimização Crítica**: Pre-load de `tipos_crime` antes de processar lote de ocorrências para evitar centenas de requests simultâneas.

---

## ⚡ Sistema de Estado (TanStack Query)

### Configuração Global (app/providers.tsx)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5min
      gcTime: 10 * 60 * 1000,           // 10min (antes: cacheTime)
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})
```

### Hooks Principais

#### 1. use-infinite-ocorrencias.ts

**Hook de paginação infinita com auto-load**:

```typescript
export function useInfiniteOcorrencias() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['ocorrencias', 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchOcorrencias({ page: pageParam, per_page: 50 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.total_pages) {
        return lastPage.current_page + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })

  // Auto-load em background (100ms delay entre páginas)
  useEffect(() => {
    if (hasNextPage && !isFetching) {
      setTimeout(() => fetchNextPage(), 100)
    }
  }, [hasNextPage, isFetching])

  return { incidents: flattenIncidents(data), ... }
}
```

**Features**:
- ✅ Carregamento automático de todas as páginas
- ✅ Delay de 100ms entre páginas (evita sobrecarga)
- ✅ Flattening automático de páginas
- ✅ Cache inteligente com React Query

#### 2. use-ocorrencias-query.ts

**Hook com filtros e busca**:

```typescript
export function useOcorrenciasQuery(filters?: OcorrenciaFilters) {
  return useQuery({
    queryKey: ['ocorrencias', filters],
    queryFn: () => fetchWithFilters(filters),
    enabled: !!filters,
  })
}
```

#### 3. Mutations (Create/Update/Delete)

```typescript
const createMutation = useMutation({
  mutationFn: (payload: CreateOcorrenciaPayload) => ocorrenciasAPI.create(payload),
  onSuccess: (newOcorrencia) => {
    queryClient.invalidateQueries({ queryKey: ['ocorrencias'] })
    toast.success('Ocorrência criada com sucesso!')
  },
  onError: (error) => {
    toast.error(error.message)
  }
})
```

---

## 🔔 Sistema de Notificações

### Push Notifications (Web Push)

**Tecnologias**:
- **web-push**: Backend notification sender
- **Service Worker**: Push event listener
- **Next.js Server Actions**: Gerenciamento de subscriptions

**Fluxo**:

```
1. User clica "Permitir Notificações"
   ↓
2. Browser solicita permissão
   ↓
3. Service Worker registra subscription
   ↓
4. Frontend envia subscription para backend (Server Action)
   ↓
5. Backend armazena subscription no DB
   ↓
6. Ocorrência nova é criada
   ↓
7. Backend envia push notification via web-push
   ↓
8. Service Worker recebe evento 'push'
   ↓
9. Service Worker exibe notification
   ↓
10. User clica na notificação → Abre app
```

**Arquivos**:
- `app/actions/push-notifications.ts`: Server Actions
- `public/sw.js`: Service Worker customizado
- `lib/hooks/use-notifications.ts`: Hook de gerenciamento
- `components/notifications-provider.tsx`: Provider React

### Toast Notifications (Sonner)

**Biblioteca**: `sonner` (toast notifications elegantes)

**Configuração** (app/providers.tsx):
```tsx
<Toaster
  position="top-center"
  richColors
  closeButton
  duration={5000}
/>
```

**Uso**:
```typescript
import { toast } from 'sonner'

toast.success('Ocorrência criada!')
toast.error('Erro ao salvar')
toast.info('Carregando...')
toast.warning('Atenção!')
```

---

## 📱 Progressive Web App (PWA)

### Configuração (next.config.mjs)

```javascript
import withPWA from 'next-pwa'

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/manifest\.json$/], // Usar manifest.ts do Next.js 15
  runtimeCaching: [
    // Cache strategies para diferentes tipos de assets
    { urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i, handler: 'StaleWhileRevalidate' },
    { urlPattern: /\.(?:js|css)$/i, handler: 'StaleWhileRevalidate' },
    { urlPattern: /^https:\/\/fonts\.googleapis\.com/, handler: 'CacheFirst' },
    // Não cachear rotas de API
    { urlPattern: /\/api\/v1\//, handler: 'NetworkOnly' },
  ],
})

export default pwaConfig(nextConfig)
```

### Manifest (app/manifest.ts)

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SISP Porto Velho',
    short_name: 'SISP',
    description: 'Sistema Integrado de Segurança Pública',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#003DA5',
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
```

### Service Worker (public/sw.js)

**Funcionalidades**:
- ✅ Cache de assets estáticos
- ✅ Offline fallback
- ✅ Push notifications handler
- ✅ Background sync
- ✅ Update checking

**Estratégias de Cache**:
- **CacheFirst**: Fontes, ícones (long-lived assets)
- **StaleWhileRevalidate**: JS, CSS, imagens (revalidar em background)
- **NetworkFirst**: Dados dinâmicos, API calls
- **NetworkOnly**: Rotas de API `/api/v1/*`

### Instalação PWA

**Components**:
- `components/pwa/install-banner.tsx`: Banner de instalação
- `components/pwa/install-prompt.tsx`: Prompt de instalação

**Detecção**:
```typescript
const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

useEffect(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    setDeferredPrompt(e)
  })
}, [])

const handleInstall = async () => {
  deferredPrompt?.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    toast.success('App instalado com sucesso!')
  }
}
```

---

## 🎯 Padrões de Código e Boas Práticas

### 1. Estrutura de Componentes

**Pattern**: Separation of Concerns

```typescript
// ✅ BOM: Componente focado, lógica em hooks
export function MyComponent() {
  const { data, isLoading } = useMyData()

  if (isLoading) return <Skeleton />

  return <UI data={data} />
}

// ❌ EVITAR: Lógica misturada com UI
export function MyComponent() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData)
  }, [])

  return <div>{/* UI complexa + lógica misturada */}</div>
}
```

### 2. Custom Hooks

**Pattern**: Reutilização de lógica

```typescript
// ✅ Hook reutilizável
export function useOcorrencias(filters?: Filters) {
  return useQuery({
    queryKey: ['ocorrencias', filters],
    queryFn: () => fetchOcorrencias(filters),
  })
}

// Uso em múltiplos componentes
function ComponentA() {
  const { data } = useOcorrencias({ status: 'Registrada' })
}

function ComponentB() {
  const { data } = useOcorrencias({ bairro: 1 })
}
```

### 3. Type Safety

**Pattern**: TypeScript estrito

```typescript
// ✅ Tipos completos da API
interface OcorrenciaAPI {
  id_ocorrencia: number
  numero_bo: string
  latitude_ocorrencia: string // STRING na API!
  // ... todos os campos tipados
}

// ✅ Payloads tipados
interface CreateOcorrenciaPayload {
  ocorrencia: {
    numero_bo: string
    id_tipo_crime: number
    // ... campos obrigatórios
  }
}

// ❌ EVITAR: any ou tipos incompletos
function createOcorrencia(data: any) { ... }
```

### 4. Error Handling

**Pattern**: Try-Catch + User Feedback

```typescript
async function handleCreate(payload: CreatePayload) {
  try {
    const result = await ocorrenciasAPI.create(payload)
    toast.success('Ocorrência criada com sucesso!')
    return result
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Erro ao criar ocorrência'

    toast.error(message)
    console.error('[CreateOcorrencia]', error)
    throw error
  }
}
```

### 5. Loading States

**Pattern**: Skeleton Screens

```typescript
if (isLoading) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
```

### 6. Client-Only Components

**Pattern**: Dynamic Imports para evitar SSR

```typescript
// ✅ Mapa carregado apenas no cliente
const MapComponent = dynamic(
  () => import('@/components/map').then(mod => mod.Map),
  {
    ssr: false,
    loading: () => <MapSkeleton />
  }
)
```

### 7. Hydration-Safe State

**Pattern**: Evitar hydration mismatches

```typescript
// ✅ Estado inicializado após mount
const [isCollapsed, setIsCollapsed] = useState(false)
const [hasMounted, setHasMounted] = useState(false)

useEffect(() => {
  setHasMounted(true)
  const saved = localStorage.getItem('collapsed')
  if (saved) setIsCollapsed(JSON.parse(saved))
}, [])

if (!hasMounted) {
  return <Skeleton /> // Evita hydration mismatch
}
```

---

## 🔐 Segurança

### Headers de Segurança (next.config.mjs)

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/sw.js',
      headers: [
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
      ],
    },
  ]
}
```

### Práticas de Segurança

- ✅ **HTTPS obrigatório** em produção
- ✅ **CSP headers** para Service Workers
- ✅ **XSS Protection** via React (auto-escape)
- ✅ **CSRF Protection** no backend Rails
- ✅ **Input Validation** com Zod schemas
- ✅ **API Timeout** (30s) para evitar hanging requests

---

## 🚀 Performance

### Otimizações Implementadas

1. **Code Splitting**:
   - Dynamic imports para mapas (`ssr: false`)
   - Lazy loading de modais e componentes pesados

2. **Image Optimization**:
   - Next.js Image component (`next/image`)
   - Formatos modernos (WebP, AVIF)
   - Responsive images

3. **API Optimizations**:
   - Pre-load de `tipos_crime` cache (evita N+1 queries)
   - Paginação em lote (50 items por página)
   - Auto-load com delay (100ms entre páginas)
   - TanStack Query cache (5min stale, 10min gc)

4. **Bundle Size**:
   - Tree-shaking automático (Next.js)
   - Tailwind CSS purging
   - Radix UI: import apenas componentes usados

5. **Rendering**:
   - Server Components onde possível
   - Client Components apenas quando necessário (`'use client'`)
   - Memoization com `useMemo` e `useCallback`

### Métricas Alvo

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.8s
- **CLS** (Cumulative Layout Shift): < 0.1
- **Lighthouse Score**: > 90

---

## 📦 Build e Deploy

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (localhost:3000)
npm run dev:turbo    # Desenvolvimento com Turbopack
npm run build        # Build de produção
npm run start        # Start produção
npm run lint         # ESLint
```

### Processo de Build

```
1. TypeScript Compilation
   ↓
2. Next.js Optimization
   ↓
3. Tailwind CSS Purging
   ↓
4. Service Worker Generation (next-pwa)
   ↓
5. PWA Manifest Generation
   ↓
6. Asset Optimization (images, fonts)
   ↓
7. Output: .next/ folder
```

### Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_API_URL=http://10.0.1.66:3000/api/v1
DATABASE_URL=postgres://... (não usado no frontend)
```

---

## 🧪 Testing (TODO)

**Recomendações para implementação futura**:

- **Unit Tests**: Vitest + React Testing Library
- **Integration Tests**: Playwright
- **E2E Tests**: Cypress ou Playwright
- **API Mocking**: MSW (Mock Service Worker)

---

## 📚 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query (TanStack)](https://tanstack.com/query/latest)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Leaflet](https://leafletjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

---

**Última Atualização**: 19/10/2024
**Branch**: DEV-Walace
**Versão**: 0.1.0
