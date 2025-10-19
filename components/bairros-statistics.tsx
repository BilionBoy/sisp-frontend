"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MapPin, TrendingDown, Users, AlertCircle, Activity } from "lucide-react"
import { BAIRROS_DATA, ESTATISTICAS_GERAIS } from "@/lib/data/mock-incidents"
import { CRIMES_POR_ZONA, type Zona } from "@/lib/data/porto-velho-data"

/**
 * Componente de Estatísticas dos Bairros
 * Exibe dados detalhados baseados na análise Python de crimes em Porto Velho
 */
export function BairrosStatistics() {
  // Top 10 bairros mais críticos
  const top10Bairros = useMemo(() => {
    return [...BAIRROS_DATA]
      .sort((a, b) => b.crimesEstimados - a.crimesEstimados)
      .slice(0, 10)
  }, [])

  // Estatísticas por zona
  const estatisticasZona = useMemo(() => {
    const stats: Record<Zona, {
      populacao: number
      crimes: number
      bairros: number
      mediaCrimesPorBairro: number
      bairroMaisCritico: string
      crimesBairroMaisCritico: number
      taxaCriminalidade: number
    }> = {} as any

    Object.keys(CRIMES_POR_ZONA).forEach(zonaKey => {
      const zona = zonaKey as Zona
      const bairrosZona = BAIRROS_DATA.filter(b => b.zona === zona)
      const populacaoZona = bairrosZona.reduce((sum, b) => sum + b.populacao, 0)
      const crimesZona = bairrosZona.reduce((sum, b) => sum + b.crimesEstimados, 0)
      const bairroMaisCritico = bairrosZona.reduce((max, b) =>
        b.crimesEstimados > max.crimesEstimados ? b : max
      )

      stats[zona] = {
        populacao: populacaoZona,
        crimes: crimesZona,
        bairros: bairrosZona.length,
        mediaCrimesPorBairro: crimesZona / bairrosZona.length,
        bairroMaisCritico: bairroMaisCritico.nome,
        crimesBairroMaisCritico: bairroMaisCritico.crimesEstimados,
        taxaCriminalidade: (crimesZona / populacaoZona) * 100000
      }
    })

    return stats
  }, [])

  const formatNumber = (num: number) => num.toLocaleString('pt-BR')

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Dados Gerais */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Dados Gerais - Porto Velho
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Análise baseada em dados reais (IBGE 2025 + Criminalidade 2015-2019)
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">População Total</p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-foreground">{formatNumber(ESTATISTICAS_GERAIS.populacaoTotal)}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">habitantes (IBGE 2025)</p>
            </div>

            <div className="rounded-lg border border-border p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Total de Crimes</p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-foreground">{formatNumber(ESTATISTICAS_GERAIS.totalCrimes)}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{ESTATISTICAS_GERAIS.periodo}</p>
            </div>

            <div className="rounded-lg border border-border p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Total de Bairros</p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-foreground">{ESTATISTICAS_GERAIS.totalBairros}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{ESTATISTICAS_GERAIS.zonasCobertas} zonas</p>
            </div>

            <div className="rounded-lg border border-border p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-chart-2" />
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Taxa Média</p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-foreground">
                {((ESTATISTICAS_GERAIS.totalCrimes / ESTATISTICAS_GERAIS.populacaoTotal) * 100000).toFixed(2)}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">crimes/100k hab</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="zonas" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="zonas" className="text-xs sm:text-sm py-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Estatísticas por Zona</span>
            <span className="sm:hidden">Por Zona</span>
          </TabsTrigger>
          <TabsTrigger value="top10" className="text-xs sm:text-sm py-2">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Top 10 Bairros Críticos</span>
            <span className="sm:hidden">Top 10</span>
          </TabsTrigger>
        </TabsList>

        {/* Estatísticas por Zona */}
        <TabsContent value="zonas" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {Object.entries(estatisticasZona).map(([zona, stats]) => (
              <Card key={zona}>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg">{zona}</CardTitle>
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      {stats.bairros} bairros
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">População:</span>
                      <span className="text-xs sm:text-sm font-semibold text-right">
                        {formatNumber(stats.populacao)} hab ({((stats.populacao / ESTATISTICAS_GERAIS.populacaoTotal) * 100).toFixed(1)}%)
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Total de crimes:</span>
                      <span className="text-xs sm:text-sm font-semibold text-destructive">
                        {formatNumber(stats.crimes)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Taxa média:</span>
                      <span className="text-xs sm:text-sm font-semibold">
                        {stats.taxaCriminalidade.toFixed(2)} crimes/100k hab
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Média por bairro:</span>
                      <span className="text-xs sm:text-sm font-semibold">
                        {Math.round(stats.mediaCrimesPorBairro)} crimes
                      </span>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Bairro mais crítico:</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-foreground">
                          {stats.bairroMaisCritico}
                        </span>
                        <Badge variant="destructive">
                          {formatNumber(stats.crimesBairroMaisCritico)} crimes
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Top 10 Bairros Críticos */}
        <TabsContent value="top10" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Top 10 Bairros Mais Críticos (2015-2019)</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Bairros com maior número absoluto de crimes
              </p>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6">
              {/* Wrapper com scroll horizontal em mobile */}
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8 sm:w-12 text-xs sm:text-sm">#</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px]">Bairro</TableHead>
                      <TableHead className="text-xs sm:text-sm">Zona</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden sm:table-cell">População</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">Crimes</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">Taxa/100k</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {top10Bairros.map((bairro, index) => (
                      <TableRow key={bairro.nome}>
                        <TableCell className="font-bold text-xs sm:text-sm">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-xs sm:text-sm">{bairro.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">{bairro.zona}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs sm:text-sm hidden sm:table-cell">
                          {formatNumber(bairro.populacao)}
                        </TableCell>
                        <TableCell className="text-right text-xs sm:text-sm">
                          <span className="font-semibold text-destructive">
                            {formatNumber(bairro.crimesEstimados)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-xs sm:text-sm">
                          {bairro.taxaCriminalidade.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm sm:text-base text-foreground mb-2">Análise Baseada em Dados Reais</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Os dados apresentados foram gerados usando modelo de regressão linear baseado em características
                socioeconômicas reais dos bairros de Porto Velho, incluindo população, índice socioeconômico,
                densidade populacional, iluminação pública, presença policial e distância do centro.
                Total de {ESTATISTICAS_GERAIS.totalCrimes.toLocaleString()} crimes analisados no período de 2015-2019.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
