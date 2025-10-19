"use client"

import { useRouter, useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { OcorrenciaDetailsMobile } from "@/components/mobile/ocorrencia-details-mobile"
import { useOcorrenciaById } from "@/lib/hooks/use-ocorrencia-by-id"
import { toast } from "sonner"
import { Toaster } from "sonner"

export default function OcorrenciaDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const numericId = id ? parseInt(id, 10) : null

  // Buscar ocorrência específica por ID (cache-first, depois API)
  const { incident: selectedIncident, isLoading, updateOcorrencia } = useOcorrenciaById(numericId)

  // Handler para voltar
  const handleBack = () => {
    router.push("/ocorrencias-mobile")
  }

  // Handler para encerrar ocorrência
  const handleEncerrar = async (
    idOcorrencia: number,
    data: { observacoes: string; resultado: string }
  ) => {
    try {
      // ENUM PostgreSQL: 'Registrada', 'Em Investigação', 'Resolvida', 'Arquivada'
      await updateOcorrencia(idOcorrencia, {
        status_ocorrencia: "Resolvida",
      })

      toast.success("Ocorrência encerrada com sucesso", {
        description: "A ocorrência foi marcada como resolvida",
      })

      // Aguardar um pouco para o usuário ver a mensagem
      setTimeout(() => {
        router.push("/ocorrencias-mobile")
      }, 1500)
    } catch (error) {
      console.error("Erro ao encerrar ocorrência:", error)
      throw error // Repassar erro para o componente
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-center" richColors />

        {/* Header skeleton */}
        <div className="sticky top-0 z-50 bg-background border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-9 w-9 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Map skeleton */}
        <Skeleton className="w-full h-[35vh]" />

        {/* Content skeleton */}
        <div className="p-4 space-y-4">
          <div className="space-y-3 p-6 border rounded-lg">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="space-y-3 p-6 border rounded-lg">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  // Error/Not found state
  if (!selectedIncident) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Toaster position="top-center" richColors />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-background border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-9 w-9 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-sm">Ocorrência não encontrada</h1>
          </div>
        </header>

        {/* Error content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="font-semibold text-xl mb-2">Ocorrência não encontrada</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            A ocorrência #{id} não foi encontrada ou pode ter sido removida.
          </p>
          <Button onClick={handleBack} className="min-w-[200px]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
          </Button>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <>
      <Toaster position="top-center" richColors />
      <OcorrenciaDetailsMobile
        incident={selectedIncident}
        onBack={handleBack}
        onEncerrar={handleEncerrar}
      />
    </>
  )
}
