/**
 * Dados reais de Porto Velho, Rondônia
 * Baseado em dados do IBGE e análise de criminalidade 2015-2019
 */

// Bairros por zona (dados reais de Porto Velho)
export const BAIRROS_POR_ZONA = {
  Centro: [
    'Arigolândia', 'Agenor de Carvalho', 'Areal', 'Baixa da União',
    'Caiari', 'Centro', 'Embratel', 'KM-1', 'Liberdade', 'Mato Grosso',
    'Militar', 'Mocambo', 'Nova Porto Velho', 'Olaria', 'Panair',
    'Santa Bárbara', 'São Cristóvão', 'São João Bosco', 'Triângulo',
    'Tucumanzal', 'Tupi', 'Flodoaldo Pontes Pinto', 'Lagoa',
    'Nossa Senhora das Graças', 'Pedrinhas', 'Roque'
  ],
  Leste: [
    'Socialista', 'Aponiã', 'Cascalheira', 'Cidade Jardim', 'Cuniã',
    'Escola de Polícia', 'Esperança da Comunidade', 'Igarapé',
    'Jardim Santana', 'Juscelino Kubitschek', 'Lagoinha', 'Marcos Freire',
    'Mariana', 'Pantanal', 'Planalto', 'Ronaldo Aragão', 'Tancredo Neves',
    'Teixeirão', 'Tiradentes', 'Três Marias', 'Ulisses Guimarães',
    'Maringá', 'São Francisco'
  ],
  Sul: [
    'Cidade Nova', 'Eletronorte', 'Floresta', 'Aeroclube', 'Areia Branca',
    'Caladinho', 'Castanheira', 'Cidade do Lobo', 'Cohab', 'Conceição',
    'Nova Floresta', 'Novo Horizonte', 'Jardim Eldorado'
  ],
  Norte: [
    'Área Militar e Aeroporto', 'Costa e Silva', 'Industrial', 'Nacional',
    'Nova Esperança', 'Rio Madeira', 'São Sebastião'
  ]
} as const

// Total de crimes por zona (2015-2019)
export const CRIMES_POR_ZONA = {
  Centro: 25392,
  Leste: 39603,
  Sul: 16056,
  Norte: 3505
} as const

// População total de Porto Velho (IBGE 2025)
export const POPULACAO_TOTAL = 517709

// Distribuição da população por zona
export const DISTRIBUICAO_POP_ZONA = {
  Centro: 0.35,  // 35% - área mais antiga e estabelecida
  Leste: 0.40,   // 40% - zona com mais crescimento recente
  Sul: 0.18,     // 18% - zona em expansão
  Norte: 0.07    // 7% - menor densidade
} as const

// Coordenadas centrais de Porto Velho
export const PORTO_VELHO_CENTER: [number, number] = [-8.76077, -63.8999]

// Coordenadas aproximadas por zona
export const COORDENADAS_ZONAS = {
  Centro: { lat: -8.7619, lng: -63.9039 },
  Leste: { lat: -8.7850, lng: -63.8650 },
  Sul: { lat: -8.8150, lng: -63.9200 },
  Norte: { lat: -8.7300, lng: -63.9100 }
} as const

// Tipos de zona
export type Zona = keyof typeof BAIRROS_POR_ZONA

// Cores por zona (consistentes com o Python)
export const CORES_ZONA = {
  Centro: '#3b82f6',  // blue
  Leste: '#ef4444',   // red
  Sul: '#f97316',     // orange
  Norte: '#22c55e'    // green
} as const

// Interface para dados de bairro
export interface BairroData {
  nome: string
  zona: Zona
  populacao: number
  indiceSocioeconomico: number
  densidadePopulacional: number
  numeroComércios: number
  iluminacaoPublica: number
  presencaPolicial: number
  distanciaCentro: number
  crimesEstimados: number
  taxaCriminalidade: number
  latitude: number
  longitude: number
}
