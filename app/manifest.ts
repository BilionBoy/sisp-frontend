import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SISP - Sistema Integrado de Segurança Pública de Porto Velho',
    short_name: 'SISP',
    description: 'Plataforma inteligente de gestão e monitoramento da segurança pública municipal de Porto Velho',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#003DA5',
    orientation: 'any',
    scope: '/',
    categories: ['government', 'productivity', 'utilities'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    screenshots: [
      {
        src: '/screenshots/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Mapa de Ocorrências - Vista Desktop'
      },
      {
        src: '/screenshots/screenshot-mobile.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Lista de Ocorrências - Vista Mobile'
      }
    ],
    shortcuts: [
      {
        name: 'Mapa de Ocorrências',
        short_name: 'Mapa',
        description: 'Visualizar mapa de ocorrências em tempo real',
        url: '/ocorrencias',
        icons: [
          {
            src: '/icons/icon-map-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Ocorrências Mobile',
        short_name: 'Mobile',
        description: 'Visualizar lista de ocorrências otimizada para mobile',
        url: '/ocorrencias-mobile',
        icons: [
          {
            src: '/icons/icon-list-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ]
  }
}
