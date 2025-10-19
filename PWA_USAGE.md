# 📱 Guia de Uso - PWA Features SISP

Este documento explica como usar os componentes de PWA implementados conforme a **documentação oficial do Next.js 15**.

## 🔔 Web Push Notifications

### Componente: PushNotificationManager

**Importar:**
```typescript
import { PushNotificationManager } from '@/components/pwa/push-notification-manager'
```

### Uso Básico (Versão Completa)

```tsx
// Página de configurações ou perfil
export default function SettingsPage() {
  return (
    <div>
      <h1>Configurações</h1>
      <PushNotificationManager />
    </div>
  )
}
```

### Uso Compacto (Versão Header/Menu)

```tsx
// Header ou menu lateral
import { PushNotificationManager } from '@/components/pwa/push-notification-manager'

export function Header() {
  return (
    <header>
      <PushNotificationManager compact />
    </header>
  )
}
```

### Props

```typescript
interface PushNotificationManagerProps {
  className?: string
  compact?: boolean  // true = ícone compacto, false = card completo
}
```

### Funcionalidades

- ✅ Solicitar permissão de notificações
- ✅ Se inscrever/desinscrever de push
- ✅ Enviar notificação de teste (apenas dev)
- ✅ UI completa ou compacta
- ✅ Feedback visual com toasts

---

## 📲 Install Prompt

### Componente: InstallPrompt

**Importar:**
```typescript
import { InstallPrompt } from '@/components/pwa/install-prompt'
```

### Uso Básico

```tsx
// Página inicial ou onboarding
export default function HomePage() {
  return (
    <div>
      <InstallPrompt />
      {/* Resto da página */}
    </div>
  )
}
```

### Com Callbacks

```tsx
<InstallPrompt
  onInstall={() => {
    console.log('App instalado!')
    // Analytics, redirect, etc.
  }}
  onDismiss={() => {
    console.log('Prompt dismissado')
    // Analytics
  }}
/>
```

### Funcionalidades

- ✅ Detecção automática de iOS vs Android/Chrome
- ✅ Instruções específicas para iOS (3 passos)
- ✅ Prompt nativo para Chrome/Edge/Android
- ✅ Dismiss temporário (7 dias)
- ✅ Esconde automaticamente se já instalado
- ✅ UI responsiva e acessível

---

## 🔐 Server Actions

### Importar

```typescript
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
  broadcastNotification,
  notifyNewOcorrencia,
  notifyOcorrenciaResolved,
  getSubscriptionsCount,
} from '@/app/actions/push-notifications'
```

### Exemplos de Uso

#### 1. Notificar nova ocorrência criada

```typescript
// Após criar uma ocorrência
const ocorrencia = await createOcorrencia(data)

// Notificar todos os usuários inscritos
await notifyNewOcorrencia(
  ocorrencia.numero_bo,
  ocorrencia.tipo_crime.nome,
  ocorrencia.bairro.nome
)
```

#### 2. Notificar ocorrência resolvida

```typescript
// Após resolver uma ocorrência
await updateOcorrencia(id, { status: 'Resolvida' })

// Notificar usuários
await notifyOcorrenciaResolved(
  ocorrencia.numero_bo,
  ocorrencia.tipo_crime.nome
)
```

#### 3. Broadcast customizado

```typescript
// Notificação genérica para todos
await broadcastNotification(
  'Manutenção Programada',
  'O sistema ficará indisponível das 22h às 23h',
  '/avisos'
)
```

#### 4. Notificação para usuário específico

```typescript
// Apenas para subscription específica
const subscription = await getUserSubscription(userId)

await sendNotification(
  subscription,
  'Ocorrência atribuída a você'
)
```

#### 5. Obter estatísticas

```typescript
const count = await getSubscriptionsCount()
console.log(`${count} usuários com notificações ativas`)
```

---

## 🎯 Integração com Sistema de Notificações Existente

### Adicionando ao notifications-provider.tsx

```typescript
// components/notifications-provider.tsx

import { notifyNewOcorrencia } from '@/app/actions/push-notifications'

const handleNotification = async (notification: Notification) => {
  // Lógica existente de WebSocket...

  // Adicionar envio de push notification
  if (notification.type === 'ocorrencia_criada' && notification.data?.id) {
    try {
      const ocorrencia = await ocorrenciasAPI.getById(notification.data.id)

      // Enviar push notification para todos
      await notifyNewOcorrencia(
        ocorrencia.numero_bo,
        ocorrencia.tipo_crime.nome,
        ocorrencia.bairro.nome
      )
    } catch (error) {
      console.error('Erro ao enviar push notification:', error)
    }
  }
}
```

---

## 🧪 Testes

### Testando Localmente

**Requisitos:**
- HTTPS habilitado (`next dev --experimental-https`)
- Navegador com notificações habilitadas
- Permissão concedida

**Passos:**

1. **Iniciar dev server:**
   ```bash
   npm run dev -- --experimental-https
   ```

2. **Acessar:** https://localhost:3000

3. **Ativar notificações:**
   - Usar componente `<PushNotificationManager />`
   - Clicar em "Ativar Notificações"
   - Aceitar permissão no browser

4. **Enviar teste:**
   - Digite mensagem no input (apenas em dev)
   - Clicar em "Send Test"
   - Verificar notificação

### Testando em Produção

1. **Build e deploy:**
   ```bash
   npm run build
   npm start
   ```

2. **Verificar HTTPS** (obrigatório para push)

3. **Testar instalação:**
   - Chrome/Edge: Menu → "Instalar [Nome]"
   - iOS Safari: Compartilhar → "Adicionar à Tela Inicial"

4. **Testar notificações:**
   - Ativar via UI
   - Disparar via backend/admin

---

## 📊 Monitoramento

### Verificar Service Worker

```javascript
// DevTools Console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers registrados:', regs.length)
  regs.forEach(reg => {
    console.log('Scope:', reg.scope)
    console.log('Active:', reg.active)
  })
})
```

### Verificar Push Subscription

```javascript
// DevTools Console
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(sub => {
    if (sub) {
      console.log('Inscrito:', sub.endpoint)
    } else {
      console.log('Não inscrito')
    }
  })
})
```

### Verificar Permissão

```javascript
// DevTools Console
console.log('Permissão:', Notification.permission)
// Valores: "granted", "denied", "default"
```

---

## 🔧 Troubleshooting

### Notificações não aparecem

**Possíveis causas:**

1. **Permissão negada**
   - Solução: Limpar site settings no browser e tentar novamente

2. **HTTPS não configurado**
   - Solução: Push notifications requerem HTTPS (exceto localhost)

3. **Service Worker não registrado**
   - Solução: Verificar console por erros de registro

4. **iOS sem instalação**
   - Solução: iOS requer app instalado na tela inicial

### Service Worker não atualiza

**Solução:**
```javascript
// DevTools → Application → Service Workers
// Clicar em "Unregister"
// Recarregar página
```

Ou via código:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister())
})
```

### VAPID keys inválidas

**Solução:**
```bash
# Gerar novas keys
npx web-push generate-vapid-keys --json

# Atualizar .env.local
```

---

## 🌐 Compatibilidade

### Navegadores Suportados

| Navegador | Versão Mínima | Push | Install |
|-----------|---------------|------|---------|
| Chrome    | 89+           | ✅   | ✅      |
| Edge      | 89+           | ✅   | ✅      |
| Firefox   | 88+           | ✅   | ✅      |
| Safari    | 16+           | ✅*  | ✅**    |
| iOS Safari| 16.4+         | ✅*  | ✅      |

\* Safari/iOS: Apenas para apps instalados na tela inicial
\** iOS: Instalação via "Adicionar à Tela Inicial" (não tem prompt nativo)

---

## 📱 Exemplo Completo

### Página de Configurações

```tsx
// app/settings/page.tsx
'use client'

import { PushNotificationManager } from '@/components/pwa/push-notification-manager'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>

      {/* Install Prompt */}
      <InstallPrompt />

      {/* Push Notifications */}
      <PushNotificationManager />

      {/* Outras configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Outras Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Resto das configs */}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🎉 Recursos Completos

- ✅ Web App Manifest (TypeScript)
- ✅ Service Worker (cache otimizado)
- ✅ Service Worker Custom (push notifications)
- ✅ Web Push Notifications (cross-platform)
- ✅ Install Prompt (iOS + Android)
- ✅ Security Headers
- ✅ VAPID Keys configuradas
- ✅ Server Actions prontos
- ✅ Componentes React reutilizáveis
- ✅ Documentação completa

**Status**: 🟢 PWA Totalmente Funcional
