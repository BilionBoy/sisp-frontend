# 👨‍💻 Guia do Desenvolvedor - SISP Frontend

## 🚀 Setup Inicial

### Pré-requisitos

- **Node.js**: >= 18.x (recomendado: 20.x LTS)
- **npm**: >= 9.x
- **Git**: Última versão
- **Editor**: VS Code (recomendado) com extensões:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### Instalação

```bash
# 1. Clonar repositório
git clone <repository-url>
cd sisp-frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local com suas configurações:
# NEXT_PUBLIC_API_URL=http://10.0.1.66:3000/api/v1

# 4. Iniciar servidor de desenvolvimento
npm run dev

# 5. Abrir no navegador
# http://localhost:3000
```

### Verificação do Setup

```bash
# Verificar versões
node --version  # v18.x ou superior
npm --version   # v9.x ou superior

# Testar build
npm run build

# Testar lint
npm run lint
```

---

## 📂 Navegando no Código

### Pontos de Entrada

**1. Página Principal (Desktop)**:
```
app/ocorrencias/page.tsx
```
- Mapa interativo
- Lista de ocorrências
- Filtros e busca

**2. Versão Mobile**:
```
app/ocorrencias-mobile/page.tsx
app/ocorrencias-mobile/[id]/page.tsx
```
- Lista otimizada
- Detalhes da ocorrência

**3. Layout Raiz**:
```
app/layout.tsx
app/providers.tsx
```
- Configuração de providers
- React Query setup
- Notificações

### Componentes Principais

**Mapas**:
```
components/maps/EnhancedInteractiveMap.tsx  # Mapa principal
components/crime-map-interactive.tsx        # Mapa simplificado
components/heat-map.tsx                     # Heatmap
```

**Modais e Formulários**:
```
components/create-ocorrencia-modal.tsx      # Criar ocorrência
components/incident-details.tsx             # Detalhes
```

**Listas**:
```
components/ocorrencias-list-compact.tsx     # Lista compacta
```

### Serviços e Hooks

**API Services**:
```
lib/services/ocorrencias-api.ts             # CRUD ocorrências
lib/services/tipos-crime-api.ts             # Tipos de crime
```

**Hooks**:
```
lib/hooks/use-infinite-ocorrencias.ts       # Paginação infinita
lib/hooks/use-ocorrencias.ts                # Hook básico
lib/hooks/use-cameras.ts                    # Câmeras
lib/hooks/use-notifications.ts              # Push notifications
```

**Mappers**:
```
lib/mappers/ocorrencia-mapper.ts            # API → UI transformation
```

---

## 🛠️ Desenvolvimento

### Criando um Novo Componente

**1. Estrutura de Pastas**:

```
components/
├── ui/                  # Componentes shadcn/ui (não editar)
├── maps/                # Componentes de mapas
├── mobile/              # Mobile-specific
└── [nome-componente]/   # Componente complexo (pasta própria)
    ├── index.tsx
    ├── types.ts
    └── utils.ts
```

**2. Template de Componente**:

```typescript
// components/my-component.tsx
"use client" // Se precisar de interatividade

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MyComponentProps {
  data: string[]
  className?: string
  onSelect?: (item: string) => void
}

export function MyComponent({ data, className, onSelect }: MyComponentProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (item: string) => {
    setSelected(item)
    onSelect?.(item)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Meu Componente</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((item) => (
          <button
            key={item}
            onClick={() => handleSelect(item)}
            className={cn(
              "px-4 py-2 rounded",
              selected === item && "bg-primary text-white"
            )}
          >
            {item}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
```

**3. Export Pattern**:

```typescript
// components/index.ts
export { MyComponent } from "./my-component"
export type { MyComponentProps } from "./my-component"
```

### Criando um Custom Hook

**1. Estrutura**:

```
lib/hooks/
├── use-[nome].ts
└── use-[nome].test.ts  # (opcional)
```

**2. Template de Hook**:

```typescript
// lib/hooks/use-my-data.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { myAPI } from "@/lib/services/my-api"

interface UseMyDataOptions {
  filter?: string
  enabled?: boolean
}

export function useMyData({ filter, enabled = true }: UseMyDataOptions = {}) {
  return useQuery({
    queryKey: ["my-data", filter],
    queryFn: () => myAPI.fetch(filter),
    enabled,
    staleTime: 5 * 60 * 1000, // 5min
  })
}
```

**3. Hook com Mutations**:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateMyData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: MyPayload) => myAPI.create(payload),
    onSuccess: (data) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ["my-data"] })
      toast.success("Criado com sucesso!")
    },
    onError: (error) => {
      toast.error(error.message)
      console.error("[CreateMyData]", error)
    },
  })
}
```

### Criando um Service (API Client)

**1. Template de Service**:

```typescript
// lib/services/my-api.ts
import type { MyData, CreatePayload, ListResponse } from "@/lib/types/my-data"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP Error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    console.error(`[API Error] ${endpoint}:`, error)
    throw error
  }
}

export const myAPI = {
  async list(): Promise<MyData[]> {
    const response = await fetchAPI<ListResponse>("/my-endpoint")
    return response.data || []
  },

  async getById(id: number): Promise<MyData> {
    return fetchAPI<MyData>(`/my-endpoint/${id}`)
  },

  async create(payload: CreatePayload): Promise<MyData> {
    return fetchAPI<MyData>("/my-endpoint", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  async update(id: number, payload: Partial<MyData>): Promise<MyData> {
    return fetchAPI<MyData>(`/my-endpoint/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  },

  async delete(id: number): Promise<void> {
    await fetchAPI(`/my-endpoint/${id}`, { method: "DELETE" })
  },
}
```

### Adicionando um Tipo TypeScript

**1. Criar arquivo de tipo**:

```typescript
// lib/types/my-data.ts

/**
 * Estrutura retornada pela API
 * IMPORTANTE: snake_case (Rails backend)
 */
export interface MyDataAPI {
  id: number
  name: string
  created_at: string
  updated_at: string
}

/**
 * Estrutura usada no frontend
 * camelCase (JavaScript convention)
 */
export interface MyData {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Payload para criação
 */
export interface CreateMyDataPayload {
  my_data: {
    name: string
  }
}

/**
 * Resposta paginada
 */
export interface MyDataListResponse {
  data: MyDataAPI[]
  current_page: number
  total_pages: number
  total_count: number
}
```

**2. Criar Mapper**:

```typescript
// lib/mappers/my-data-mapper.ts
import type { MyDataAPI, MyData } from "@/lib/types/my-data"

export function apiToUI(data: MyDataAPI): MyData {
  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

export function uiToAPI(data: MyData): MyDataAPI {
  return {
    id: data.id,
    name: data.name,
    created_at: data.createdAt.toISOString(),
    updated_at: data.updatedAt.toISOString(),
  }
}
```

---

## 🎨 Trabalhando com UI

### Usando Componentes shadcn/ui

**Instalando novo componente**:

```bash
npx shadcn-ui@latest add [component-name]

# Exemplos:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
```

**Componentes já instalados**:
- Button, Card, Dialog, Modal
- Input, Select, Checkbox, Switch
- Toast, Accordion, Tabs
- ScrollArea, Dropdown, Popover

**Uso**:

```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

<Button variant="default" size="lg">
  Criar Ocorrência
</Button>

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="Digite algo..." />
  </CardContent>
</Card>
```

### Estilização com Tailwind CSS

**Classes Comuns**:

```typescript
// Layout
className="flex flex-col gap-4"
className="grid grid-cols-2 md:grid-cols-4 gap-6"

// Spacing
className="p-4 px-6"  // padding
className="m-4 mx-auto"  // margin

// Sizing
className="w-full h-64"
className="max-w-md min-h-screen"

// Colors (usar variáveis CSS)
className="bg-primary text-white"
className="bg-muted text-foreground"
className="border border-border"

// Responsividade
className="hidden md:block"  // Esconder no mobile
className="text-sm md:text-lg"  // Responsive text
```

**Utility Function `cn()`**:

```typescript
import { cn } from "@/lib/utils"

// Combinar classes condicionalmente
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes",
  customClassName  // Props
)} />
```

### Temas e Cores

**Cores Principais** (definidas em `app/globals.css`):

```css
/* Light Mode */
--primary: 221 83% 53%;      /* #003DA5 - Azul */
--secondary: 88 61% 44%;     /* #76BC21 - Verde */
--accent: 48 100% 50%;       /* #FFD700 - Ouro */

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  --primary: ...
  --secondary: ...
}
```

**Uso**:

```typescript
<div className="bg-primary text-primary-foreground">
  Azul institucional
</div>

<div className="bg-secondary text-secondary-foreground">
  Verde
</div>

<div className="bg-accent text-accent-foreground">
  Ouro
</div>
```

---

## 🗺️ Trabalhando com Mapas

### Adicionando Marcador no Mapa

```typescript
import { Marker, Popup } from "react-leaflet"
import L from "leaflet"

const myIcon = L.icon({
  iconUrl: "/icons/my-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

<Marker position={[lat, lng]} icon={myIcon}>
  <Popup>
    <div>
      <h3>Título</h3>
      <p>Descrição</p>
    </div>
  </Popup>
</Marker>
```

### Criando Layer Customizado

```typescript
import { LayerGroup, useMap } from "react-leaflet"
import { useEffect } from "react"

function MyCustomLayer({ data }) {
  const map = useMap()

  useEffect(() => {
    // Adicionar layer customizado
    const layer = L.layerGroup()

    data.forEach(item => {
      const marker = L.marker([item.lat, item.lng])
      marker.addTo(layer)
    })

    layer.addTo(map)

    return () => {
      map.removeLayer(layer)
    }
  }, [map, data])

  return null
}
```

### Eventos de Mapa

```typescript
import { useMapEvents } from "react-leaflet"

function MapClickHandler({ onClick }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng)
    },
    moveend: () => {
      console.log("Map moved")
    },
    zoomend: () => {
      console.log("Zoom changed")
    },
  })

  return null
}
```

---

## 📡 Trabalhando com API

### Exemplo: Criar Nova Ocorrência

**1. Preparar Payload**:

```typescript
import { buildCreatePayload } from "@/lib/services/ocorrencias-api"

const payload = buildCreatePayload({
  numero_bo: "2024/12345",
  id_tipo_crime: 23,
  id_bairro: 1,
  data_ocorrencia: "2024-10-19",
  hora_ocorrencia: "14:30",
  latitude_ocorrencia: "-8.7496088",
  longitude_ocorrencia: "-63.8923717",
  descricao_ocorrencia: "Furto de veículo",
  status_ocorrencia: "Registrada",
})
```

**2. Usar Hook de Mutation**:

```typescript
import { useInfiniteOcorrencias } from "@/lib/hooks/use-infinite-ocorrencias"
import { toast } from "sonner"

function MyComponent() {
  const { createOcorrencia } = useInfiniteOcorrencias()

  const handleCreate = async () => {
    try {
      const newOcorrencia = await createOcorrencia(payload)
      toast.success("Ocorrência criada!")
      console.log("Nova ocorrência:", newOcorrencia)
    } catch (error) {
      toast.error("Erro ao criar ocorrência")
      console.error(error)
    }
  }

  return <Button onClick={handleCreate}>Criar</Button>
}
```

### Exemplo: Listar com Filtros

```typescript
import { useOcorrenciasQuery } from "@/lib/hooks/use-ocorrencias-query"

function FilteredList() {
  const { data, isLoading, error } = useOcorrenciasQuery({
    id_bairro: 1,
    status_ocorrencia: "Registrada",
    data_inicio: "2024-10-01",
    data_fim: "2024-10-19",
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />

  return (
    <ul>
      {data?.map(ocorrencia => (
        <li key={ocorrencia.id}>{ocorrencia.numero_bo}</li>
      ))}
    </ul>
  )
}
```

### Exemplo: Paginação Infinita

```typescript
import { useInfiniteOcorrencias } from "@/lib/hooks/use-infinite-ocorrencias"
import { useEffect, useRef } from "react"

function InfiniteList() {
  const {
    incidents,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
  } = useInfiniteOcorrencias()

  const observerRef = useRef<IntersectionObserver>()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loadMoreRef.current) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetchingMore) {
          loadMore()
        }
      },
      { threshold: 0.5 }
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => observerRef.current?.disconnect()
  }, [hasMore, isFetchingMore, loadMore])

  return (
    <div>
      {incidents.map(incident => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}

      {hasMore && (
        <div ref={loadMoreRef} className="py-4">
          {isFetchingMore ? <Spinner /> : <p>Carregue mais</p>}
        </div>
      )}
    </div>
  )
}
```

---

## 🔔 Trabalhando com Notificações

### Toast Notifications

```typescript
import { toast } from "sonner"

// Success
toast.success("Operação bem-sucedida!")

// Error
toast.error("Erro ao processar")

// Info
toast.info("Informação importante")

// Warning
toast.warning("Atenção!")

// Custom
toast("Mensagem customizada", {
  description: "Descrição adicional",
  duration: 3000,
  action: {
    label: "Desfazer",
    onClick: () => console.log("Undo"),
  },
})

// Promise (loading → success/error)
toast.promise(
  myAsyncFunction(),
  {
    loading: "Processando...",
    success: "Concluído!",
    error: "Falhou",
  }
)
```

### Push Notifications

**1. Solicitar Permissão**:

```typescript
import { useNotifications } from "@/lib/hooks/use-notifications"

function NotificationButton() {
  const { permission, requestPermission, isSupported } = useNotifications()

  if (!isSupported) {
    return <p>Navegador não suporta notificações</p>
  }

  if (permission === "granted") {
    return <p>✅ Notificações ativas</p>
  }

  return (
    <Button onClick={requestPermission}>
      Permitir Notificações
    </Button>
  )
}
```

**2. Enviar Notificação**:

```typescript
// Backend (Server Action)
import { sendPushNotification } from "@/app/actions/push-notifications"

await sendPushNotification({
  title: "Nova Ocorrência",
  body: "Furto de veículo na Av. Brasil",
  data: { id: 123, type: "ocorrencia" },
})
```

---

## 🧪 Debugging e Testes

### Logging Estruturado

```typescript
// ✅ BOM: Logs estruturados com contexto
console.log(`[ComponentName] Ação específica:`, { data, context })

// ❌ EVITAR: Logs genéricos
console.log("error")
```

**Exemplos**:

```typescript
console.log(`[CreateOcorrencia] Iniciando criação:`, payload)
console.error(`[API Error] /ocorrencias:`, error)
console.warn(`[Validation] Campo inválido:`, fieldName)
```

### React Query Devtools

**Ativar no desenvolvimento**:

```typescript
// app/providers.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

**Abrir devtools**: Clique no ícone flutuante no canto da tela.

### Debugging de Mapas

```typescript
import { useMap } from "react-leaflet"

function MapDebugger() {
  const map = useMap()

  useEffect(() => {
    console.log("Map Instance:", map)
    console.log("Center:", map.getCenter())
    console.log("Zoom:", map.getZoom())
    console.log("Bounds:", map.getBounds())
  }, [map])

  return null
}
```

### Verificar Cache do React Query

```typescript
import { useQueryClient } from "@tanstack/react-query"

function CacheDebugger() {
  const queryClient = useQueryClient()

  const handleLog = () => {
    const cache = queryClient.getQueryCache().getAll()
    console.log("Query Cache:", cache)
  }

  return <Button onClick={handleLog}>Log Cache</Button>
}
```

---

## 🚨 Tratamento de Erros

### Error Boundaries

**Criar Error Boundary**:

```typescript
// components/error-boundary.tsx
"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[ErrorBoundary]", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive">
            Algo deu errado
          </h2>
          <p className="mt-2 text-muted-foreground">
            {this.state.error?.message}
          </p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4"
          >
            Tentar Novamente
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Uso**:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

### Try-Catch Pattern

```typescript
async function handleAsyncOperation() {
  try {
    const result = await riskyOperation()
    toast.success("Sucesso!")
    return result
  } catch (error) {
    // Tipo-safe error handling
    const message = error instanceof Error
      ? error.message
      : "Erro desconhecido"

    toast.error(message)
    console.error("[HandleAsyncOperation]", error)

    // Re-throw se necessário
    throw error
  } finally {
    // Cleanup sempre executado
    cleanup()
  }
}
```

---

## 📱 Desenvolvimento Mobile

### Detecção de Dispositivo

```typescript
import { isMobile } from "@/lib/utils/device"

function MyComponent() {
  const mobile = isMobile()

  return (
    <div>
      {mobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  )
}
```

### Responsividade com Tailwind

```typescript
// Mobile-first approach
<div className="
  flex flex-col gap-2      // Mobile: vertical
  md:flex-row md:gap-4     // Desktop: horizontal
">
  <div className="
    w-full                  // Mobile: 100% width
    md:w-1/2                // Desktop: 50% width
  ">
    Content
  </div>
</div>
```

### Hook de Detecção Mobile

```typescript
import { useMobileDetection } from "@/lib/hooks/use-mobile-detection"

function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useMobileDetection()

  return (
    <div>
      {isMobile && <MobileUI />}
      {isTablet && <TabletUI />}
      {isDesktop && <DesktopUI />}
    </div>
  )
}
```

---

## 🔧 Ferramentas de Desenvolvimento

### VS Code Snippets (Recomendados)

**Criar `.vscode/snippets.code-snippets`**:

```json
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "import { ${1:ComponentName}Props } from './types'",
      "",
      "export function ${1:ComponentName}({ ${2:props} }: ${1:ComponentName}Props) {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  )",
      "}"
    ]
  },
  "Custom Hook": {
    "prefix": "hook",
    "body": [
      "\"use client\"",
      "",
      "import { useState, useEffect } from 'react'",
      "",
      "export function use${1:HookName}() {",
      "  const [state, setState] = useState($2)",
      "",
      "  useEffect(() => {",
      "    $0",
      "  }, [])",
      "",
      "  return { state }",
      "}"
    ]
  }
}
```

### Extensões VS Code Essenciais

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "wayou.vscode-todo-highlight"
  ]
}
```

---

## 🎯 Boas Práticas

### DO's ✅

- ✅ Use TypeScript estrito (sem `any`)
- ✅ Extraia lógica para custom hooks
- ✅ Use TanStack Query para estado do servidor
- ✅ Implemente loading states (Skeleton screens)
- ✅ Trate erros com try-catch + toast
- ✅ Use `"use client"` apenas quando necessário
- ✅ Prefira Server Components
- ✅ Use dynamic imports para componentes pesados
- ✅ Valide inputs com Zod schemas
- ✅ Logs estruturados com contexto

### DON'Ts ❌

- ❌ Não use `any` sem justificativa
- ❌ Não faça fetch direto em componentes
- ❌ Não ignore estados de loading/error
- ❌ Não misture lógica de negócio com UI
- ❌ Não use `useEffect` para data fetching (use React Query)
- ❌ Não ignore hydration warnings
- ❌ Não comite código com console.logs desnecessários
- ❌ Não ignore ESLint warnings

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Leaflet](https://leafletjs.com/reference.html)

### Tutoriais Recomendados

- [Next.js App Router Tutorial](https://nextjs.org/learn)
- [React Query Essentials](https://tkdodo.eu/blog/practical-react-query)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)

---

## 🆘 Solução de Problemas Comuns

### "Hydration Mismatch"

**Problema**: Diferença entre SSR e cliente.

**Solução**:
```typescript
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return <Skeleton />
```

### "Cannot read property of undefined"

**Problema**: Dados não carregados ainda.

**Solução**:
```typescript
const { data, isLoading } = useQuery(...)

if (isLoading) return <Skeleton />
if (!data) return <EmptyState />

return <Component data={data} />
```

### "Map not loading"

**Problema**: Leaflet requer cliente.

**Solução**:
```typescript
const Map = dynamic(() => import('./map'), { ssr: false })
```

### "API timeout"

**Problema**: Timeout de 30s muito curto.

**Solução**: Ajustar em `lib/services/ocorrencias-api.ts:27`

```typescript
const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s
```

---

**Última Atualização**: 19/10/2024
**Versão**: 0.1.0
