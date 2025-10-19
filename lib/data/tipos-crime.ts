/**
 * Mapeamento de IDs de tipos de crime para nomes
 * Baseado na tabela de tipos de crimes do backend
 */

export const TIPOS_CRIME: Record<number, string> = {
  1: "Homicídio",
  2: "Latrocínio",
  3: "Feminicídio",
  4: "Lesão Corporal Dolosa",
  5: "Lesão Corporal Culposa",
  6: "Estupro",
  7: "Estupro de Vulnerável",
  8: "Sequestro e Cárcere Privado",
  9: "Extorsão",
  10: "Extorsão Mediante Sequestro",
  11: "Roubo a Pedestre",
  12: "Roubo a Estabelecimento Comercial",
  13: "Roubo de Veículo",
  14: "Roubo de Carga",
  15: "Roubo a Residência",
  16: "Roubo a Banco",
  17: "Roubo Seguido de Morte (Latrocínio)",
  18: "Furto Simples",
  19: "Furto Qualificado",
  20: "Furto de Veículo",
  21: "Furto a Residência",
  22: "Furto a Estabelecimento Comercial",
  23: "Furto de Celular",
  24: "Estelionato",
  25: "Apropriação Indébita",
  26: "Receptação",
  27: "Tráfico de Drogas",
  28: "Associação para o Tráfico",
  29: "Posse de Drogas para Consumo",
  30: "Porte Ilegal de Arma",
  31: "Disparo de Arma de Fogo",
  32: "Ameaça",
  33: "Injúria",
  34: "Calúnia",
  35: "Difamação",
  36: "Violência Doméstica",
  37: "Violência contra a Mulher",
  38: "Violência contra Criança e Adolescente",
  39: "Violência contra Idoso",
  40: "Desacato",
  41: "Desobediência",
  42: "Resistência",
  43: "Corrupção Ativa",
  44: "Corrupção Passiva",
  45: "Peculato",
  46: "Concussão",
  47: "Prevaricação",
  48: "Falsificação de Documento",
  49: "Uso de Documento Falso",
  50: "Falsa Identidade",
  51: "Dano",
  52: "Dano Qualificado",
  53: "Incêndio",
  54: "Explosão",
  55: "Acidente de Trânsito com Vítima",
  56: "Acidente de Trânsito sem Vítima",
  57: "Embriaguez ao Volante",
  58: "Direção sem Habilitação",
  59: "Abandono de Local de Acidente",
  60: "Racha (Corrida Ilegal)",
  61: "Perturbação da Ordem",
  62: "Vias de Fato",
  63: "Contravenção Penal",
  64: "Rixa",
  65: "Invasão de Propriedade",
  66: "Esbulho Possessório",
  67: "Poluição",
  68: "Maus-Tratos a Animais",
  69: "Jogos de Azar",
  70: "Exploração de Jogo de Azar",
}

/**
 * Retorna o nome do tipo de crime pelo ID
 */
export function getTipoCrimeNome(id: number): string {
  return TIPOS_CRIME[id] || `Crime Tipo ${id}`
}

/**
 * Categorias de crimes
 */
export enum CategoriaCrime {
  VIOLENTO = "Violento",
  PATRIMONIO = "Patrimônio",
  TRANSITO = "Trânsito",
  DROGAS = "Drogas",
  SEXUAL = "Sexual",
  OUTROS = "Outros",
}

/**
 * Mapeia tipo de crime para categoria
 */
export function getCategoriaCrime(idTipoCrime: number): CategoriaCrime {
  // Crimes violentos
  if ([1, 2, 3, 4, 6, 7, 8, 9, 10, 36, 37, 38, 39].includes(idTipoCrime)) {
    return CategoriaCrime.VIOLENTO
  }

  // Crimes contra o patrimônio
  if ([11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26].includes(idTipoCrime)) {
    return CategoriaCrime.PATRIMONIO
  }

  // Crimes de trânsito
  if ([55, 56, 57, 58, 59, 60].includes(idTipoCrime)) {
    return CategoriaCrime.TRANSITO
  }

  // Crimes relacionados a drogas
  if ([27, 28, 29].includes(idTipoCrime)) {
    return CategoriaCrime.DROGAS
  }

  // Crimes sexuais
  if ([6, 7].includes(idTipoCrime)) {
    return CategoriaCrime.SEXUAL
  }

  return CategoriaCrime.OUTROS
}
