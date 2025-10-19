/**
 * Gerador de dados realistas baseado no código Python de análise de crimes
 * Simula distribuição de crimes por bairro usando características socioeconômicas
 */

import {
  BAIRROS_POR_ZONA,
  CRIMES_POR_ZONA,
  POPULACAO_TOTAL,
  DISTRIBUICAO_POP_ZONA,
  COORDENADAS_ZONAS,
  CORES_ZONA,
  type Zona,
  type BairroData
} from './porto-velho-data'
import type { Incident } from '@/lib/types/map'

/**
 * Gera número aleatório em um intervalo
 */
function randomUniform(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Distribuição Dirichlet simplificada (para distribuir população entre bairros)
 */
function dirichletDistribution(size: number, alpha: number = 2): number[] {
  const gammaValues = Array(size).fill(0).map(() => {
    // Aproximação simples da distribuição Gamma
    let sum = 0
    for (let i = 0; i < alpha; i++) {
      sum += -Math.log(Math.random())
    }
    return sum
  })

  const total = gammaValues.reduce((a, b) => a + b, 0)
  return gammaValues.map(v => v / total)
}

/**
 * Gera coordenadas aproximadas com variação aleatória
 */
function gerarCoordenadas(zona: Zona): [number, number] {
  const base = COORDENADAS_ZONAS[zona]

  // Variação aleatória (aproximadamente 0.5 a 2 km)
  const variacaoLat = randomUniform(-0.015, 0.015)
  const variacaoLng = randomUniform(-0.015, 0.015)

  return [base.lat + variacaoLat, base.lng + variacaoLng]
}

/**
 * Cria dataset de bairros com características socioeconômicas
 */
export function criarDatasetBairros(): BairroData[] {
  const dados: BairroData[] = []

  Object.entries(BAIRROS_POR_ZONA).forEach(([zonaKey, bairros]) => {
    const zona = zonaKey as Zona
    const totalCrimesZona = CRIMES_POR_ZONA[zona]
    const nBairros = bairros.length
    const popZona = Math.floor(POPULACAO_TOTAL * DISTRIBUICAO_POP_ZONA[zona])

    // Gerar distribuição de população entre bairros
    const pesos = dirichletDistribution(nBairros)
    const populacoes = pesos.map(p => Math.floor(p * popZona))

    bairros.forEach((bairro, i) => {
      const popBase = populacoes[i]

      // Índice socioeconômico (0-10, menor = mais vulnerável)
      let indiceSocio: number
      if (zona === 'Leste') {
        indiceSocio = randomUniform(2, 5)
      } else if (zona === 'Centro') {
        indiceSocio = randomUniform(5, 8)
      } else if (zona === 'Sul') {
        indiceSocio = randomUniform(4, 7)
      } else { // Norte
        indiceSocio = randomUniform(3, 6)
      }

      // Densidade populacional (hab/km²)
      const densidade = popBase / randomUniform(1, 5)

      // Número de estabelecimentos comerciais
      const nComercios = Math.floor(popBase * randomUniform(0.01, 0.05))

      // Iluminação pública (0-10)
      const iluminacao = zona !== 'Leste'
        ? randomUniform(3, 9)
        : randomUniform(2, 6)

      // Presença policial (0-10)
      const presencaPolicial = zona === 'Centro'
        ? randomUniform(4, 8)
        : randomUniform(2, 6)

      // Distância do centro (km)
      let distCentro: number
      if (zona === 'Centro') {
        distCentro = randomUniform(0, 3)
      } else if (zona === 'Leste') {
        distCentro = randomUniform(8, 15)
      } else if (zona === 'Sul') {
        distCentro = randomUniform(5, 10)
      } else { // Norte
        distCentro = randomUniform(3, 8)
      }

      // Gerar coordenadas
      const [lat, lng] = gerarCoordenadas(zona)

      dados.push({
        nome: bairro,
        zona,
        populacao: popBase,
        indiceSocioeconomico: indiceSocio,
        densidadePopulacional: densidade,
        numeroComércios: nComercios,
        iluminacaoPublica: iluminacao,
        presencaPolicial: presencaPolicial,
        distanciaCentro: distCentro,
        crimesEstimados: 0, // Será calculado depois
        taxaCriminalidade: 0, // Será calculado depois
        latitude: lat,
        longitude: lng
      })
    })
  })

  return dados
}

/**
 * Modelo de regressão linear simplificado
 * Estima crimes baseado em características do bairro
 */
function calcularCrimesRefinados(bairro: BairroData, totalCrimesZona: number, totalPopZona: number): number {
  // Distribuição inicial proporcional à população
  const crimesBase = (bairro.populacao / totalPopZona) * totalCrimesZona

  // Ajustes baseados em fatores socioeconômicos
  // Índice socioeconômico mais baixo = mais crimes
  const fatorSocioeconomico = 1 + (10 - bairro.indiceSocioeconomico) * 0.05

  // Iluminação mais baixa = mais crimes
  const fatorIluminacao = 1 + (10 - bairro.iluminacaoPublica) * 0.03

  // Presença policial mais baixa = mais crimes
  const fatorPolicial = 1 + (10 - bairro.presencaPolicial) * 0.04

  // Densidade maior = mais crimes
  const fatorDensidade = 1 + (bairro.densidadePopulacional / 100000) * 0.02

  // Distância do centro (efeito não linear)
  const fatorDistancia = bairro.distanciaCentro > 5 ? 1.1 : 0.95

  return crimesBase * fatorSocioeconomico * fatorIluminacao * fatorPolicial * fatorDensidade * fatorDistancia
}

/**
 * Gera dataset completo de bairros com crimes estimados
 */
export function gerarDadosEnriquecidos(): BairroData[] {
  const bairros = criarDatasetBairros()

  // Calcular crimes refinados por zona
  Object.keys(BAIRROS_POR_ZONA).forEach(zonaKey => {
    const zona = zonaKey as Zona
    const bairrosZona = bairros.filter(b => b.zona === zona)
    const totalPopZona = bairrosZona.reduce((sum, b) => sum + b.populacao, 0)
    const totalCrimesZona = CRIMES_POR_ZONA[zona]

    // Calcular crimes refinados
    const crimesRefinados = bairrosZona.map(b =>
      calcularCrimesRefinados(b, totalCrimesZona, totalPopZona)
    )

    const totalPred = crimesRefinados.reduce((sum, c) => sum + c, 0)

    // Ajustar proporcionalmente para manter o total da zona
    const fatorAjuste = totalCrimesZona / (totalPred || 1)

    bairrosZona.forEach((bairro, i) => {
      bairro.crimesEstimados = Math.round(Math.max(0, crimesRefinados[i] * fatorAjuste))
      bairro.taxaCriminalidade = Number(((bairro.crimesEstimados / bairro.populacao) * 100000).toFixed(2))
    })
  })

  return bairros
}

/**
 * Gera ocorrências individuais baseadas nos dados de bairros
 */
export function gerarOcorrenciasIndividuais(maxOcorrencias: number = 200): Incident[] {
  const bairros = gerarDadosEnriquecidos()
  const ocorrencias: Incident[] = []
  let idCounter = 3000

  // Tipos de crime baseados no contexto de Porto Velho
  const tiposCrime = [
    { tipo: 'Furto', peso: 0.25, prioridade: 'medium' as const },
    { tipo: 'Roubo', peso: 0.15, prioridade: 'high' as const },
    { tipo: 'Acidente de Trânsito', peso: 0.20, prioridade: 'medium' as const },
    { tipo: 'Perturbação do Sossego', peso: 0.12, prioridade: 'low' as const },
    { tipo: 'Vandalismo', peso: 0.08, prioridade: 'low' as const },
    { tipo: 'Suspeita', peso: 0.05, prioridade: 'low' as const },
    { tipo: 'Violência Doméstica', peso: 0.07, prioridade: 'high' as const },
    { tipo: 'Tráfico de Drogas', peso: 0.05, prioridade: 'high' as const },
    { tipo: 'Assalto', peso: 0.03, prioridade: 'high' as const }
  ]

  const status = ['Pendente', 'Em Análise', 'Despachado', 'Em Atendimento', 'Resolvido']

  // Distribuir ocorrências entre bairros proporcionalmente aos crimes
  const totalCrimes = bairros.reduce((sum, b) => sum + b.crimesEstimados, 0)

  bairros.forEach(bairro => {
    // Número de ocorrências para este bairro
    const nOcorrencias = Math.floor((bairro.crimesEstimados / totalCrimes) * maxOcorrencias)

    for (let i = 0; i < nOcorrencias; i++) {
      // Escolher tipo de crime baseado nos pesos
      const rand = Math.random()
      let acumulado = 0
      let tipoSelecionado = tiposCrime[0]

      for (const tipo of tiposCrime) {
        acumulado += tipo.peso
        if (rand <= acumulado) {
          tipoSelecionado = tipo
          break
        }
      }

      // Gerar coordenadas próximas ao centro do bairro
      const varLat = randomUniform(-0.005, 0.005)
      const varLng = randomUniform(-0.005, 0.005)

      // Gerar timestamp aleatório nas últimas 24 horas
      const horasAtras = Math.floor(Math.random() * 24)
      const minutosAtras = Math.floor(Math.random() * 60)
      const timestamp = horasAtras === 0
        ? `Há ${minutosAtras} minutos`
        : horasAtras === 1
          ? `Há 1 hora`
          : `Há ${horasAtras} horas`

      // Gerar endereço fictício
      const numeroRua = Math.floor(Math.random() * 3000) + 100
      const address = `Rua ${Math.random() > 0.5 ? 'A' : 'B'}, ${numeroRua} - ${bairro.nome}, ${bairro.zona}`

      ocorrencias.push({
        id: `OC-${idCounter.toString().padStart(4, '0')}`,
        lat: bairro.latitude + varLat,
        lng: bairro.longitude + varLng,
        type: tipoSelecionado.tipo,
        priority: tipoSelecionado.prioridade,
        status: status[Math.floor(Math.random() * status.length)],
        description: `${tipoSelecionado.tipo} reportado(a) em ${bairro.nome}`,
        address,
        timestamp,
        zone: bairro.zona,
        zoneColor: CORES_ZONA[bairro.zona],
        bairro: bairro.nome,
        bairroData: {
          populacao: bairro.populacao,
          indiceSocioeconomico: bairro.indiceSocioeconomico,
          iluminacaoPublica: bairro.iluminacaoPublica,
          presencaPolicial: bairro.presencaPolicial,
          taxaCriminalidade: bairro.taxaCriminalidade
        }
      })

      idCounter--
    }
  })

  // Ordenar por timestamp (mais recentes primeiro)
  return ocorrencias.sort((a, b) => {
    const getMinutos = (ts: string) => {
      if (ts.includes('minutos')) return 0
      const horas = parseInt(ts.match(/\d+/)?.[0] || '0')
      return horas * 60
    }
    return getMinutos(a.timestamp || '') - getMinutos(b.timestamp || '')
  })
}

/**
 * Exporta dados enriquecidos dos bairros
 */
export function exportarDadosBairros() {
  return gerarDadosEnriquecidos()
}
