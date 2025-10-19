/**
 * Mapeamento de IDs de bairros para informações completas
 * Baseado nos bairros de Porto Velho - RO
 */

export interface BairroInfo {
  id: number
  nome: string
  zona: string
}

export const BAIRROS: Record<number, BairroInfo> = {
  1: { id: 1, nome: "Centro", zona: "Zona Central" },
  2: { id: 2, nome: "Agenor de Carvalho", zona: "Zona Leste" },
  3: { id: 3, nome: "Areal da Floresta", zona: "Zona Leste" },
  4: { id: 4, nome: "Aponiã", zona: "Zona Sul" },
  5: { id: 5, nome: "Bairro Lagoa", zona: "Zona Sul" },
  6: { id: 6, nome: "Belmont", zona: "Zona Sul" },
  7: { id: 7, nome: "Boa União", zona: "Zona Leste" },
  8: { id: 8, nome: "Caladinho", zona: "Zona Central" },
  9: { id: 9, nome: "Castanheira", zona: "Zona Leste" },
  10: { id: 10, nome: "Cohab", zona: "Zona Leste" },
  11: { id: 11, nome: "Costa e Silva", zona: "Zona Sul" },
  12: { id: 12, nome: "Cuniã", zona: "Zona Sul" },
  13: { id: 13, nome: "Eldorado", zona: "Zona Leste" },
  14: { id: 14, nome: "Embratel", zona: "Zona Sul" },
  15: { id: 15, nome: "Escola de Polícia", zona: "Zona Sul" },
  16: { id: 16, nome: "Esperança da Comunidade", zona: "Zona Sul" },
  17: { id: 17, nome: "Flodoaldo Pontes Pinto", zona: "Zona Leste" },
  18: { id: 18, nome: "Floresta Sul", zona: "Zona Sul" },
  19: { id: 19, nome: "Industrial", zona: "Zona Leste" },
  20: { id: 20, nome: "Igarapé", zona: "Zona Sul" },
  21: { id: 21, nome: "Jardim Eldorado", zona: "Zona Leste" },
  22: { id: 22, nome: "Jardim Santana", zona: "Zona Sul" },
  23: { id: 23, nome: "JK I", zona: "Zona Leste" },
  24: { id: 24, nome: "JK II", zona: "Zona Leste" },
  25: { id: 25, nome: "Lagoinha", zona: "Zona Leste" },
  26: { id: 26, nome: "Liberdade", zona: "Zona Sul" },
  27: { id: 27, nome: "Mariana", zona: "Zona Leste" },
  28: { id: 28, nome: "Mato Grosso", zona: "Zona Leste" },
  29: { id: 29, nome: "Mocambo", zona: "Zona Leste" },
  30: { id: 30, nome: "Nacional", zona: "Zona Leste" },
  31: { id: 31, nome: "Nova Esperança", zona: "Zona Sul" },
  32: { id: 32, nome: "Nova Floresta", zona: "Zona Sul" },
  33: { id: 33, nome: "Nova Porto Velho", zona: "Zona Leste" },
  34: { id: 34, nome: "Novo Horizonte", zona: "Zona Sul" },
  35: { id: 35, nome: "Olaria", zona: "Zona Central" },
  36: { id: 36, nome: "Palmeiras", zona: "Zona Sul" },
  37: { id: 37, nome: "Panair", zona: "Zona Leste" },
  38: { id: 38, nome: "Parque dos Tanques", zona: "Zona Sul" },
  39: { id: 39, nome: "Pedrinhas", zona: "Zona Central" },
  40: { id: 40, nome: "Planalto", zona: "Zona Sul" },
  41: { id: 41, nome: "Primeiro de Maio", zona: "Zona Leste" },
  42: { id: 42, nome: "Riachuelo", zona: "Zona Leste" },
  43: { id: 43, nome: "Rio Madeira", zona: "Zona Sul" },
  44: { id: 44, nome: "Ronaldo Aragão", zona: "Zona Leste" },
  45: { id: 45, nome: "São Cristóvão", zona: "Zona Sul" },
  46: { id: 46, nome: "São João Bosco", zona: "Zona Leste" },
  47: { id: 47, nome: "São Sebastião", zona: "Zona Sul" },
  48: { id: 48, nome: "Socialista", zona: "Zona Leste" },
  49: { id: 49, nome: "Tancredo Neves", zona: "Zona Leste" },
  50: { id: 50, nome: "Três Marias", zona: "Zona Leste" },
  51: { id: 51, nome: "Triângulo", zona: "Zona Leste" },
  52: { id: 52, nome: "Tupi", zona: "Zona Central" },
  53: { id: 53, nome: "Ulisses Guimarães", zona: "Zona Leste" },
  54: { id: 54, nome: "União Bandeirante", zona: "Zona Sul" },
  55: { id: 55, nome: "Vista Alegre do Abunã", zona: "Zona Rural" },
  56: { id: 56, nome: "Bate Estaca", zona: "Zona Sul" },
  57: { id: 57, nome: "Nova Califórnia", zona: "Zona Leste" },
  58: { id: 58, nome: "Rio Verde", zona: "Zona Sul" },
  59: { id: 59, nome: "Candelária", zona: "Zona Leste" },
  60: { id: 60, nome: "Cascalheira", zona: "Zona Central" },
}

/**
 * Retorna as informações do bairro pelo ID
 */
export function getBairroInfo(id: number): BairroInfo {
  return BAIRROS[id] || { id, nome: `Bairro ${id}`, zona: "Zona Desconhecida" }
}

/**
 * Retorna apenas o nome do bairro
 */
export function getBairroNome(id: number): string {
  return getBairroInfo(id).nome
}

/**
 * Retorna a zona do bairro
 */
export function getBairroZona(id: number): string {
  return getBairroInfo(id).zona
}

/**
 * Retorna localização formatada "Bairro - Zona"
 */
export function getLocalizacaoCompleta(idBairro: number): string {
  const bairro = getBairroInfo(idBairro)
  return `${bairro.nome} - ${bairro.zona}`
}
