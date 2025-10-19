# Ícones PWA - SISP

Esta pasta contém os ícones necessários para o PWA (Progressive Web App) do SISP.

## Ícones Necessários

Os seguintes ícones precisam ser criados para o funcionamento completo do PWA:

### Ícones Principais (Obrigatórios)
- `icon-16x16.png` - Favicon pequeno
- `icon-32x32.png` - Favicon médio
- `icon-72x72.png` - Android Chrome
- `icon-96x96.png` - Android Chrome
- `icon-128x128.png` - Android Chrome
- `icon-144x144.png` - Android Chrome
- `icon-152x152.png` - iOS Safari
- `icon-180x180.png` - iOS Safari (iPhone X+)
- `icon-192x192.png` - Android Chrome (mínimo)
- `icon-384x384.png` - Android Chrome
- `icon-512x512.png` - Android Chrome (máximo)

### Ícones para Atalhos
- `icon-map-96x96.png` - Atalho para mapa de ocorrências
- `icon-list-96x96.png` - Atalho para lista de ocorrências

## Design do Ícone

O ícone deve conter:
- **Logo SISP**: Três círculos (amarelo, verde, azul) representando Porto Velho
- **Fundo**: Azul #003DA5 (cor tema) ou branco
- **Texto**: "SISP" ou "SI" em fonte bold

## Como Gerar os Ícones

### Opção 1: Usando ferramenta online
1. Acesse: https://realfavicongenerator.net/
2. Upload da imagem base (512x512 ou maior)
3. Configure as opções para PWA
4. Download e extraia na pasta `/public/icons/`

### Opção 2: Usando ImageMagick (linha de comando)
```bash
# Gerar todos os tamanhos a partir de uma imagem 512x512
convert icon-512x512.png -resize 16x16 icon-16x16.png
convert icon-512x512.png -resize 32x32 icon-32x32.png
convert icon-512x512.png -resize 72x72 icon-72x72.png
convert icon-512x512.png -resize 96x96 icon-96x96.png
convert icon-512x512.png -resize 128x128 icon-128x128.png
convert icon-512x512.png -resize 144x144 icon-144x144.png
convert icon-512x512.png -resize 152x152 icon-152x152.png
convert icon-512x512.png -resize 180x180 icon-180x180.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 384x384 icon-384x384.png
```

### Opção 3: Usando Node.js (pwa-asset-generator)
```bash
npx pwa-asset-generator icon-base.svg public/icons \
  --background "#003DA5" \
  --padding "10%"
```

## Placeholder Temporário

Se ainda não tiver os ícones, você pode:
1. Criar um SVG simples com as cores de Porto Velho
2. Usar um gerador de placeholder como https://placeholder.com/
3. Baixar ícones temporários de https://www.flaticon.com/

## Verificação

Após adicionar os ícones, verifique:
1. Todos os arquivos PNG estão na pasta `/public/icons/`
2. Os tamanhos correspondem aos nomes dos arquivos
3. Abra o DevTools → Application → Manifest para verificar
4. Teste a instalação do PWA em diferentes dispositivos

## Screenshots

Para melhor experiência na instalação, adicione também:
- `screenshots/screenshot-desktop.png` (1280x720)
- `screenshots/screenshot-mobile.png` (750x1334)

Mostre as principais telas do sistema (mapa, lista, detalhes).
