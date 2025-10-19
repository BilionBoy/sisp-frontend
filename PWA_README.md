# 📱 PWA - Progressive Web App - SISP

Este documento descreve a implementação e funcionalidades do PWA (Progressive Web App) do Sistema Integrado de Segurança Pública de Porto Velho.

## 📖 Abordagem Oficial Next.js 15

Esta implementação segue a **documentação oficial do Next.js 15** para PWA:
- ✅ Usa `app/manifest.ts` (TypeScript) em vez de `public/manifest.json`
- ✅ Next.js gera automaticamente `manifest.webmanifest` e adiciona link no HTML
- ✅ Metadata API com exports `metadata` e `viewport` separados
- ✅ Service Worker gerenciado por `next-pwa` (Next.js não tem SW built-in)
- ✅ Suporte completo para App Router

**Referência**: https://nextjs.org/docs/app/guides/progressive-web-apps

## ✨ Funcionalidades PWA Implementadas

### 🎯 Instalação
- ✅ Instalável em dispositivos móveis (iOS e Android)
- ✅ Instalável em desktop (Windows, macOS, Linux)
- ✅ Ícone na tela inicial / área de trabalho
- ✅ Splash screen customizada

### 🔄 Offline
- ✅ Funciona offline com cache inteligente
- ✅ Página offline customizada
- ✅ Cache de assets estáticos (JS, CSS, imagens)
- ✅ Cache de fontes (Google Fonts)
- ✅ Estratégias de cache otimizadas

### ⚡ Performance
- ✅ Service Worker para cache avançado
- ✅ Pré-cache de rotas principais
- ✅ Carregamento rápido em redes lentas
- ✅ Otimização de imagens e vídeos

### 🔔 Recursos Nativos
- ✅ Ícones de atalhos (Quick Actions)
- ✅ Tema adaptável (light/dark)
- ✅ Barra de status customizada
- ✅ Screenshots para instalação

## 📦 Arquivos PWA

### Configuração Principal
- `app/manifest.ts` - Web App Manifest (gerado automaticamente pelo Next.js 15)
- `next.config.mjs` - Configuração do next-pwa para Service Worker
- `public/offline.html` - Página offline customizada
- `app/layout.tsx` - Metadata e Viewport exports

### Ícones
- `public/icons/icon-*.png` - Ícones em diversos tamanhos (16px a 512px)
- `public/icons/icon-base.svg` - SVG base para gerar ícones
- `scripts/generate-pwa-icons.js` - Script de geração automática

## 🚀 Como Usar

### Desenvolvimento

O PWA está **desabilitado em desenvolvimento** para evitar problemas de cache durante o desenvolvimento.

```bash
npm run dev
# ou
npm run dev:turbo
```

### Produção

O PWA é **ativado automaticamente** em produção.

```bash
# Build de produção
npm run build

# Executar em produção
npm start
```

### Regenerar Ícones

Se você modificar o `icon-base.svg`, regenere os ícones:

```bash
npm run generate-icons
```

## 📱 Instalação no Dispositivo

### Android (Chrome/Edge)
1. Acesse o site no Chrome
2. Toque no menu (⋮) → "Instalar app" ou "Adicionar à tela inicial"
3. Confirme a instalação
4. O app aparecerá na tela inicial

### iOS (Safari)
1. Acesse o site no Safari
2. Toque no botão de compartilhar (□↑)
3. Role para baixo e toque em "Adicionar à Tela Inicial"
4. Confirme a instalação

### Desktop (Chrome/Edge)
1. Acesse o site no navegador
2. Clique no ícone de instalação na barra de endereço (+)
3. Confirme a instalação
4. O app aparecerá como aplicativo standalone

## 🎨 Personalização

### Alterar Cores do Tema

Edite `app/manifest.ts`:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#003DA5",
    background_color: "#ffffff",
    // ... resto da configuração
  }
}
```

### Alterar Nome do App

Edite `app/manifest.ts`:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Novo Nome Completo",
    short_name: "Nome Curto",
    // ... resto da configuração
  }
}
```

### Criar Novos Ícones

1. **Edite o SVG**: Modifique `public/icons/icon-base.svg`
2. **Regenere**: Execute `npm run generate-icons`
3. **Teste**: Build e instale o PWA

### Manifest Dinâmico (Opcional)

O `app/manifest.ts` permite gerar manifestos dinâmicos:

```typescript
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  // Ler variáveis de ambiente
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'SISP'

  return {
    name: appName,
    // Pode buscar dados de API, ler configs, etc.
  }
}
```

**Vantagens**:
- Type-safe com TypeScript
- Pode ser gerado dinamicamente
- Detectado automaticamente pelo Next.js
- Melhor DX (Developer Experience)

### Adicionar Atalhos (Shortcuts)

Edite `app/manifest.ts` → seção `shortcuts`:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    // ... outras configs
    shortcuts: [
      {
        name: 'Nova Funcionalidade',
        short_name: 'Nova',
        url: '/nova-rota',
        icons: [
          {
            src: '/icons/icon-nova-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ]
  }
}
```

## 🔧 Estratégias de Cache

### Cache First
**Usado para**: Fontes, áudio, vídeo
- Busca no cache primeiro
- Somente vai à rede se não estiver em cache
- Melhor para assets que não mudam

### Stale While Revalidate
**Usado para**: Imagens, CSS, JS, Next.js Data
- Retorna do cache imediatamente
- Atualiza o cache em background
- Melhor para assets que podem estar levemente desatualizados

### Network First
**Usado para**: Dados JSON, rotas da aplicação
- Busca na rede primeiro
- Usa cache se rede falhar
- Timeout de 10s
- Melhor para dados dinâmicos

### Exclusões
**Não são cacheadas**:
- Rotas `/api/v1/*` (API do backend Rails)
- Requisições externas

## 📊 Monitoramento

### DevTools - Application Tab
```
Chrome DevTools → Application → Service Workers
Chrome DevTools → Application → Manifest
Chrome DevTools → Application → Cache Storage
```

### Lighthouse PWA Audit
```bash
# Chrome DevTools → Lighthouse → Progressive Web App
# Ou via CLI:
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

## 🐛 Debug

### Limpar Cache
```javascript
// DevTools Console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})

// Limpar cache storage
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key))
})
```

### Logs do Service Worker
```javascript
// next.config.mjs
disable: false, // Ativar em dev para debug
```

### Verificar Instalabilidade
```javascript
// DevTools Console
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker suportado')
}

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ PWA instalável')
})
```

## 📝 Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Todos os ícones estão gerados (16px a 512px)
- [ ] `manifest.json` está correto
- [ ] `offline.html` está funcionando
- [ ] Testado instalação no Android
- [ ] Testado instalação no iOS
- [ ] Testado instalação no Desktop
- [ ] Lighthouse PWA Score > 90
- [ ] Cache funcionando offline
- [ ] Service Worker registrado corretamente
- [ ] Screenshots adicionadas (opcional)

## 🔄 Atualizações

### Como o PWA atualiza
1. Service Worker detecta nova versão
2. Baixa novos assets em background
3. Próximo reload usa nova versão
4. `skipWaiting: true` força atualização imediata

### Forçar Atualização
```javascript
// Adicionar em app/layout.tsx se necessário
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      registration.update()
    })
  }
}, [])
```

## 🌐 Recursos Adicionais

- [Next PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Web.dev - PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWA Builder](https://www.pwabuilder.com/)

## 🎯 Próximos Passos (Opcional)

- [ ] Implementar notificações push
- [ ] Adicionar sincronização em background
- [ ] Implementar share target API
- [ ] Adicionar badge API para contadores
- [ ] Implementar file handling API

---

**Status**: ✅ PWA Totalmente Funcional

**Última atualização**: 2025-01-19
