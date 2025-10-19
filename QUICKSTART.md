# Guia Rápido - Sistema de Câmeras

## Iniciar Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar aplicação
http://localhost:3000/ocorrencias
```

## Principais Arquivos

### Componentes de Câmeras
```
components/cameras/
├── camera-marker.tsx           # Pins no mapa
├── camera-video-player.tsx     # Player YouTube
└── camera-viewer-modal.tsx     # Modal de visualização
```

### Dados e Lógica
```
lib/types/camera.ts             # Types TypeScript
lib/data/mock-cameras.ts        # 5 câmeras mockadas
lib/hooks/use-cameras.ts        # Hook de gerenciamento
```

### Integração
```
app/ocorrencias/page.tsx        # Página principal
components/maps/EnhancedInteractiveMap.tsx  # Mapa
components/create-ocorrencia-modal.tsx      # Modal de criação
```

## Como Usar (Usuário)

### 1. Visualizar Câmera
1. Abrir `/ocorrencias`
2. Localizar pin verde com ícone de câmera
3. Clicar no pin
4. Modal abre com vídeo LIVE

### 2. Navegar Entre Câmeras
- **Botões**: "Câmera Anterior" / "Câmera Seguinte"
- **Teclado**: `←` (anterior) `→` (próxima)
- **Fechar**: `ESC` ou botão X

### 3. Criar Ocorrência de Câmera
1. Visualizar câmera no modal
2. Clicar em "Criar Ocorrência"
3. Preencher formulário (coordenadas já vêm preenchidas)
4. Salvar

## Como Usar (Desenvolvedor)

### Hook useCameras()

```typescript
import { useCameras } from "@/lib/hooks/use-cameras"

const {
  cameras,              // Array<Camera>
  onlineCameras,        // Câmeras online apenas
  selectedCamera,       // Camera | null
  selectCamera,         // (id: number | null) => void
  navigateToNextCamera, // () => void
  navigateToPreviousCamera, // () => void
} = useCameras()
```

### Adicionar Câmera no Mapa

```typescript
import { EnhancedInteractiveMap } from "@/components/maps/EnhancedInteractiveMap"
import { useCameras } from "@/lib/hooks/use-cameras"

const { onlineCameras, selectCamera } = useCameras()

<EnhancedInteractiveMap
  incidents={incidents}
  cameras={onlineCameras}          // Array de câmeras
  onCameraClick={selectCamera}     // Handler de clique
  showCameras={true}               // Mostrar câmeras
/>
```

### Modal de Visualização

```typescript
import { CameraViewerModal } from "@/components/cameras/camera-viewer-modal"
import { useCameras } from "@/lib/hooks/use-cameras"

const {
  selectedCamera,
  selectCamera,
  navigateToNextCamera,
  navigateToPreviousCamera,
} = useCameras()

<CameraViewerModal
  camera={selectedCamera}
  open={!!selectedCamera}
  onClose={() => selectCamera(null)}
  onNavigateNext={navigateToNextCamera}
  onNavigatePrevious={navigateToPreviousCamera}
  onCreateOcorrencia={(camera) => {
    // Abrir modal de ocorrência com coordenadas da câmera
  }}
/>
```

### Criar Ocorrência de Câmera

```typescript
import { CreateOcorrenciaModal } from "@/components/create-ocorrencia-modal"

const [sourceCamera, setSourceCamera] = useState<Camera>()

<CreateOcorrenciaModal
  open={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={(incident) => console.log(incident)}
  onSubmit={createOcorrencia}
  initialCoordinates={[camera.latitude, camera.longitude]}
  sourceCamera={sourceCamera}  // Badge verde aparece
/>
```

## Dados Mockados

### Editar Câmeras

Arquivo: `lib/data/mock-cameras.ts`

```typescript
export const MOCK_CAMERAS: Camera[] = [
  {
    id: 1,
    nome: "Câmera Centro",
    descricao: "Monitoramento do centro",
    localizacao: "Av. 7 de Setembro",
    latitude: -8.76077,
    longitude: -63.8999,
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    status: "online",
    bairro: "Centro",
    idBairro: 1,
    ativo: true,
  },
  // ... mais câmeras
]
```

### Adicionar Nova Câmera

```typescript
{
  id: 6, // Próximo ID
  nome: "Nome da Câmera",
  descricao: "Descrição",
  localizacao: "Endereço completo",
  latitude: -8.7XXX,  // Coordenadas reais
  longitude: -63.9XXX,
  videoUrl: "https://www.youtube.com/embed/VIDEO_ID", // URL do YouTube
  status: "online", // "online" | "offline" | "manutencao"
  bairro: "Nome do Bairro",
  idBairro: 1, // ID do bairro
  ativo: true,
}
```

## Personalização

### Alterar Cores de Status

Arquivo: `lib/types/camera.ts`

```typescript
export const CAMERA_STATUS_COLORS: Record<CameraStatus, string> = {
  online: "#22c55e",     // Verde (altere aqui)
  offline: "#ef4444",    // Vermelho (altere aqui)
  manutencao: "#f59e0b", // Amarelo (altere aqui)
}
```

### Customizar Ícone do Pin

Arquivo: `components/cameras/camera-marker.tsx`

Função `createCameraIcon()` - Edite o SVG conforme necessário.

## Troubleshooting

### Vídeo não carrega
```typescript
// Verificar URL (deve ser formato embed)
videoUrl: "https://www.youtube.com/embed/VIDEO_ID" // ✅ Correto
videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID" // ❌ Errado
```

### Câmera não aparece
```typescript
// Verificar status e ativo
status: "online"  // Deve ser "online" para aparecer
ativo: true       // Deve ser true
```

### Build Error
```bash
# Limpar cache e reinstalar
rm -rf .next node_modules
npm install
npm run build
```

## Scripts Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint

# Limpar cache
rm -rf .next
```

## Estrutura de Pastas

```
sisp-frontend/
├── app/
│   └── ocorrencias/page.tsx           # Página principal
├── components/
│   ├── cameras/                       # Componentes de câmeras
│   ├── maps/                          # Componentes de mapas
│   └── create-ocorrencia-modal.tsx    # Modal de criação
├── lib/
│   ├── data/mock-cameras.ts           # Dados mockados
│   ├── hooks/use-cameras.ts           # Hook de câmeras
│   └── types/camera.ts                # Types TypeScript
└── public/                            # Assets estáticos
```

## Integração Backend

Ver documentação completa em: **BACKEND_INTEGRATION.md**

### Endpoints Esperados

```
GET  /api/v1/cameras              # Listar câmeras
GET  /api/v1/cameras/:id          # Buscar câmera
GET  /api/v1/cameras/proximas     # Câmeras próximas
POST /api/v1/cameras              # Criar câmera (admin)
PUT  /api/v1/cameras/:id          # Atualizar (admin)
DELETE /api/v1/cameras/:id        # Deletar (admin)
```

### Service Layer

```typescript
// lib/services/cameras-api.ts
export async function fetchCameras(): Promise<Camera[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/cameras`)
  const data = await response.json()
  return data.cameras.map(mapCameraFromAPI)
}
```

## Documentação Completa

- **CAMERAS.md**: Documentação detalhada do sistema
- **BACKEND_INTEGRATION.md**: Guia de integração backend
- **IMPLEMENTATION_SUMMARY.md**: Resumo da implementação

## Suporte

Dúvidas ou problemas:
1. Verificar console do navegador
2. Consultar documentação completa
3. Revisar logs do servidor
4. Verificar CAMERAS.md

---

**Happy Coding!** 🎥🗺️
