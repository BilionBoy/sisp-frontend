const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512]
const inputSVG = path.join(__dirname, '..', 'public', 'icons', 'icon-base.svg')
const outputDir = path.join(__dirname, '..', 'public', 'icons')

// Garantir que o diretório existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('🎨 Gerando ícones PWA...\n')

// Gerar ícones principais
Promise.all(
  sizes.map(async (size) => {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`)

    try {
      await sharp(inputSVG)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 61, b: 165, alpha: 1 }
        })
        .png()
        .toFile(outputFile)

      console.log(`✅ Gerado: icon-${size}x${size}.png`)
    } catch (error) {
      console.error(`❌ Erro ao gerar icon-${size}x${size}.png:`, error.message)
    }
  })
).then(() => {
  console.log('\n✨ Todos os ícones PWA foram gerados com sucesso!')
  console.log('📁 Local: public/icons/')

  // Gerar ícones de atalho (exemplos simples)
  generateShortcutIcons()
}).catch((error) => {
  console.error('\n❌ Erro ao gerar ícones:', error)
  process.exit(1)
})

async function generateShortcutIcons() {
  console.log('\n🔖 Gerando ícones de atalhos...\n')

  // Ícone de mapa (simplificado)
  const mapIconSVG = `
    <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" fill="#003DA5" rx="12"/>
      <path d="M48 20 L68 30 L68 70 L48 60 L28 70 L28 30 Z" fill="#76BC21" stroke="#ffffff" stroke-width="2"/>
      <circle cx="48" cy="45" r="8" fill="#FFD700" stroke="#ffffff" stroke-width="2"/>
    </svg>
  `

  // Ícone de lista (simplificado)
  const listIconSVG = `
    <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" fill="#003DA5" rx="12"/>
      <g fill="#ffffff">
        <rect x="20" y="25" width="10" height="10" rx="2"/>
        <rect x="35" y="25" width="41" height="10" rx="2"/>
        <rect x="20" y="43" width="10" height="10" rx="2"/>
        <rect x="35" y="43" width="41" height="10" rx="2"/>
        <rect x="20" y="61" width="10" height="10" rx="2"/>
        <rect x="35" y="61" width="41" height="10" rx="2"/>
      </g>
    </svg>
  `

  try {
    await sharp(Buffer.from(mapIconSVG))
      .png()
      .toFile(path.join(outputDir, 'icon-map-96x96.png'))
    console.log('✅ Gerado: icon-map-96x96.png')

    await sharp(Buffer.from(listIconSVG))
      .png()
      .toFile(path.join(outputDir, 'icon-list-96x96.png'))
    console.log('✅ Gerado: icon-list-96x96.png')

    console.log('\n✨ Ícones de atalhos gerados!')
  } catch (error) {
    console.error('❌ Erro ao gerar ícones de atalhos:', error.message)
  }
}
