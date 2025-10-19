# 🚨 SISP Porto Velho - Frontend

> **Sistema Integrado de Segurança Pública de Porto Velho**
> Plataforma inteligente de gestão e monitoramento da segurança pública municipal

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5a0fc8)](https://web.dev/progressive-web-apps/)

---

## 📋 Sobre o Projeto

O **SISP Frontend** é uma Progressive Web App (PWA) moderna desenvolvida para a Prefeitura de Porto Velho como sistema centralizado de gestão de ocorrências de segurança pública. A aplicação permite visualização em tempo real de ocorrências, gestão de câmeras de segurança, análise de dados criminais e muito mais.

### ✨ Principais Funcionalidades

- 🗺️ **Mapa Interativo**: Visualização geoespacial de ocorrências com Leaflet
- 📊 **Dashboard Analítico**: Estatísticas e insights sobre segurança pública
- 📱 **PWA**: Instalável em dispositivos móveis com suporte offline
- 🔔 **Notificações Push**: Alertas em tempo real sobre novas ocorrências
- 📹 **Sistema de Câmeras**: Monitoramento integrado de câmeras de segurança
- 🌡️ **Heatmaps**: Visualização de densidade criminal por região
- 📝 **CRUD Completo**: Criação, edição e gestão de ocorrências
- 📱 **Mobile-First**: Interface otimizada para dispositivos móveis e desktop
- 🔄 **Real-time Updates**: Atualizações automáticas via WebSockets (ActionCable)
- 🎨 **UI Moderna**: Componentes Radix UI + shadcn/ui

---

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** >= 18.x (recomendado: 20.x LTS)
- **npm** >= 9.x
- **Git**

### Instalação

```bash
# 1. Clonar repositório
git clone <repository-url>
cd sisp-frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local:
# NEXT_PUBLIC_API_URL=http://10.0.1.66:3000/api/v1

# 4. Iniciar desenvolvimento
npm run dev

# 5. Abrir navegador
# http://localhost:3000
```

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (localhost:3000)
npm run dev:turbo    # Desenvolvimento com Turbopack (mais rápido)
npm run build        # Build de produção
npm run start        # Iniciar servidor de produção
npm run lint         # ESLint
npm run generate-icons  # Gerar ícones PWA
```

---

## 🏗️ Stack Tecnológica

### Core

- **Framework**: [Next.js 15.2.4](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Linguagem**: [TypeScript 5](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS 4.1.9](https://tailwindcss.com/)

### UI & Design

- **Componentes**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Notificações**: [Sonner](https://sonner.emilkowal.ski/)
- **Animações**: [Tailwind CSS Animate](https://github.com/jamiebuilds/tailwindcss-animate)

### Mapas & Geolocalização

- **Mapas**: [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Plugins**:
  - `leaflet.heat`: Heatmaps
  - `leaflet.markercluster`: Agrupamento de marcadores
  - `leaflet-control-geocoder`: Busca de endereços
  - `leaflet-fullscreen`: Modo fullscreen

### State Management & Data Fetching

- **Server State**: [TanStack Query](https://tanstack.com/query/latest) (React Query v5)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Real-time**: [ActionCable](https://guides.rubyonrails.org/action_cable_overview.html) (Rails WebSockets)

### PWA & Offline

- **PWA**: [next-pwa](https://www.npmjs.com/package/next-pwa)
- **Service Workers**: Workbox (via next-pwa)
- **Push Notifications**: [web-push](https://www.npmjs.com/package/web-push)

### Backend Integration

- **API**: Rails API (http://10.0.1.66:3000/api/v1)
- **Formato**: RESTful JSON API
- **Autenticação**: (TODO)

---

## 📂 Estrutura do Projeto

```
sisp-frontend/
├── app/                        # Next.js App Router
│   ├── actions/                # Server Actions
│   ├── ocorrencias/            # Página principal (Desktop)
│   ├── ocorrencias-mobile/     # Versão mobile otimizada
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Redirect inteligente
│   └── providers.tsx           # React Query + Providers
│
├── components/                 # Componentes React
│   ├── ui/                     # shadcn/ui components
│   ├── maps/                   # Componentes de mapas
│   ├── mobile/                 # Mobile-specific
│   ├── cameras/                # Sistema de câmeras
│   └── ...
│
├── lib/                        # Lógica de negócio
│   ├── services/               # API clients
│   ├── hooks/                  # Custom React Hooks
│   ├── types/                  # TypeScript types
│   ├── mappers/                # Data transformation
│   ├── contexts/               # React Contexts
│   ├── cache/                  # IndexedDB cache
│   └── utils/                  # Utilities
│
├── public/                     # Assets estáticos
│   ├── icons/                  # PWA icons
│   └── sw.js                   # Service Worker
│
├── styles/                     # CSS customizado
├── docs/                       # Documentação
└── scripts/                    # Build scripts
```

Para detalhes completos da arquitetura, consulte [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🗺️ Funcionalidades Principais

### 1. Mapa Interativo

- **Visualização**: Ocorrências plotadas em mapa com marcadores customizados
- **Heatmap**: Densidade criminal por região
- **Clusters**: Agrupamento inteligente de marcadores próximos
- **Click-to-Create**: Criar ocorrências clicando no mapa
- **Fullscreen**: Modo tela cheia
- **Geocoding**: Busca de endereços

### 2. Gestão de Ocorrências

- **CRUD Completo**:
  - ✅ Criar nova ocorrência
  - ✅ Visualizar detalhes
  - ✅ Editar ocorrência
  - ✅ Deletar ocorrência

- **Filtros**:
  - Por tipo de crime
  - Por bairro
  - Por status
  - Por período de data
  - Por prioridade

- **Paginação Infinita**:
  - Carregamento automático em background
  - 50 ocorrências por página
  - Otimizado para performance

### 3. Sistema de Câmeras

- **Visualização em Tempo Real**: Stream de câmeras de segurança
- **Localização no Mapa**: Posicionamento geográfico das câmeras
- **Status Online/Offline**: Monitoramento de disponibilidade
- **Integração com Ocorrências**: Criar ocorrência a partir de câmera

### 4. Notificações

- **Push Notifications**: Alertas em tempo real para novas ocorrências
- **Toast Notifications**: Feedback visual para ações do usuário
- **Service Worker**: Notificações mesmo com app em background

### 5. Mobile-First Design

- **Detecção Automática**: Redireciona para versão otimizada
- **UI Adaptativa**: Layout responsivo para todos os tamanhos de tela
- **Gestos Touch**: Suporte completo a interações touch
- **Performance**: Otimizado para conexões lentas

---

## 📡 Integração com Backend

### Endpoints Principais

**Base URL**: `http://10.0.1.66:3000/api/v1`

```
GET    /ocorrencias              # Listar ocorrências (paginado)
GET    /ocorrencias/:id          # Buscar por ID
POST   /ocorrencias              # Criar nova
PUT    /ocorrencias/:id          # Atualizar
DELETE /ocorrencias/:id          # Deletar

GET    /tipos_crime              # Listar tipos de crime
GET    /tipos_crime/ativos       # Listar apenas ativos
```

### Formato de Resposta

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
      "status_ocorrencia": "Registrada"
    }
  ],
  "current_page": 1,
  "per_page": 50,
  "total_pages": 80,
  "total_count": 4000
}
```

Para detalhes completos da API, consulte [docs/API.md](docs/API.md).

---

## 🎨 UI/UX

### Design System

**Cores Principais**:
- 🔵 **Primary**: #003DA5 (Azul institucional)
- 🟢 **Secondary**: #76BC21 (Verde)
- 🟡 **Accent**: #FFD700 (Ouro)

**Tipografia**:
- **Sans**: Inter (Google Fonts)
- **Mono**: Roboto Mono

**Componentes**:
- Baseados em **Radix UI** (acessibilidade nativa)
- Estilizados com **Tailwind CSS**
- Variantes via **class-variance-authority**

### Temas

- ✅ **Light Mode**: Tema claro (padrão)
- ✅ **Dark Mode**: Tema escuro (suporte via next-themes)
- ✅ **Auto**: Seguir preferência do sistema

---

## 🔔 Sistema de Notificações

### Push Notifications

1. **Solicitar Permissão**:
   ```typescript
   const { requestPermission } = useNotifications()
   await requestPermission()
   ```

2. **Backend Envia Notificação**:
   ```typescript
   await sendPushNotification({
     title: "Nova Ocorrência",
     body: "Furto de veículo na Av. Brasil",
     data: { id: 123 }
   })
   ```

3. **Service Worker Recebe e Exibe**:
   ```javascript
   self.addEventListener('push', (event) => {
     const data = event.data.json()
     self.registration.showNotification(data.title, {
       body: data.body,
       icon: '/icons/icon-192x192.png'
     })
   })
   ```

---

## 📱 PWA Features

### Instalação

O app pode ser instalado em:
- ✅ **Android**: Chrome, Edge, Samsung Internet
- ✅ **iOS**: Safari (iOS 16.4+)
- ✅ **Desktop**: Chrome, Edge, Brave

### Capacidades Offline

- ✅ **Cache de Assets**: JS, CSS, fontes, imagens
- ✅ **Cache de Dados**: Ocorrências recentes
- ✅ **Offline Fallback**: Mensagem quando sem conexão
- ✅ **Background Sync**: Sincronização quando voltar online

### Service Worker

**Estratégias de Cache**:
- **CacheFirst**: Assets estáticos (fontes, ícones)
- **StaleWhileRevalidate**: JS, CSS, imagens
- **NetworkFirst**: Dados dinâmicos
- **NetworkOnly**: API calls (`/api/v1/*`)

---

## 🚀 Performance

### Otimizações Implementadas

1. **Code Splitting**:
   - Dynamic imports para mapas
   - Lazy loading de modais e componentes pesados

2. **Data Fetching**:
   - TanStack Query com cache inteligente (5min stale, 10min gc)
   - Pre-loading de tipos de crime (evita N+1 queries)
   - Paginação infinita com auto-load

3. **Rendering**:
   - Server Components por padrão
   - Client Components apenas quando necessário
   - Memoization com `useMemo` e `useCallback`

4. **Images**:
   - Next.js Image component
   - Formatos modernos (WebP, AVIF)
   - Responsive images

5. **Bundle**:
   - Tree-shaking automático
   - Tailwind CSS purging
   - Minificação e compressão

### Métricas Alvo

- **FCP** < 1.8s
- **LCP** < 2.5s
- **TTI** < 3.8s
- **CLS** < 0.1
- **Lighthouse** > 90

---

## 🔐 Segurança

### Headers de Segurança

```javascript
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self'
```

### Boas Práticas

- ✅ HTTPS obrigatório em produção
- ✅ Validação de inputs com Zod
- ✅ Sanitização de dados da API
- ✅ Timeout de requests (30s)
- ✅ Error handling robusto

---

## 📚 Documentação

- 📐 [**ARCHITECTURE.md**](docs/ARCHITECTURE.md): Arquitetura completa do sistema
- 👨‍💻 [**DEVELOPER_GUIDE.md**](docs/DEVELOPER_GUIDE.md): Guia para desenvolvedores
- 🔌 [**API.md**](docs/API.md): Documentação da API (TODO)
- 🎨 [**DESIGN_SYSTEM.md**](docs/DESIGN_SYSTEM.md): Sistema de design (TODO)

---

## 🤝 Contribuindo

### Workflow de Desenvolvimento

1. **Criar branch**:
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. **Desenvolver**:
   - Seguir padrões do [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)
   - Escrever código type-safe (TypeScript estrito)
   - Adicionar testes (TODO)

3. **Commit**:
   ```bash
   git commit -m "Feat: nova funcionalidade X"
   ```

   **Formato**: `Tipo: descrição`
   - `Feat`: Nova funcionalidade
   - `Fix`: Correção de bug
   - `Refactor`: Refatoração
   - `Docs`: Documentação
   - `Style`: Formatação
   - `Test`: Testes
   - `Chore`: Manutenção

4. **Push e Pull Request**:
   ```bash
   git push origin feature/nome-da-feature
   ```

   Criar PR para `main` com descrição detalhada.

### Code Review

- ✅ TypeScript sem erros
- ✅ ESLint sem warnings
- ✅ Build bem-sucedido
- ✅ Funcionalidade testada manualmente
- ✅ Mobile e desktop testados
- ✅ Performance verificada

---

## 🐛 Solução de Problemas

### Problemas Comuns

**1. "Hydration Mismatch"**
```typescript
// Solução: Inicializar estado após mount
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return <Skeleton />
```

**2. "Map not loading"**
```typescript
// Solução: Dynamic import com ssr: false
const Map = dynamic(() => import('./map'), { ssr: false })
```

**3. "API timeout"**
```typescript
// Solução: Aumentar timeout em lib/services/ocorrencias-api.ts
setTimeout(() => controller.abort(), 60000) // 60s
```

Para mais soluções, consulte [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md#-solução-de-problemas-comuns).

---

## 📊 Status do Projeto

### Versão Atual: 0.1.0

### Features Implementadas ✅

- ✅ Mapa interativo com Leaflet
- ✅ CRUD de ocorrências
- ✅ Paginação infinita
- ✅ Sistema de câmeras
- ✅ Push notifications
- ✅ PWA (instalável)
- ✅ Mobile-first design
- ✅ Real-time updates (ActionCable)

### Roadmap 🚧

- 🚧 Autenticação e autorização
- 🚧 Dashboard analytics avançado
- 🚧 Relatórios e exportação de dados
- 🚧 Testes automatizados (Vitest + Playwright)
- 🚧 CI/CD pipeline
- 🚧 Internacionalização (i18n)
- 🚧 Dark mode completo

---

## 👥 Time

**Desenvolvido por**: Walace
**Instituição**: Prefeitura de Porto Velho
**Branch Atual**: DEV-Walace

---

## 📄 Licença

Propriedade da Prefeitura de Porto Velho.
Todos os direitos reservados.

---

## 🔗 Links Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Leaflet Documentation](https://leafletjs.com/reference.html)

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consultar [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)
2. Verificar [Issues](https://github.com/.../issues) existentes
3. Criar nova Issue com detalhes do problema

---

**Última Atualização**: 19/10/2024
**Versão**: 0.1.0
**Branch**: DEV-Walace
