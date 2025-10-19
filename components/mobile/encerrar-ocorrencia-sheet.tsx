"use client"

import { useState } from "react"
import { CheckCircle2, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface EncerrarOcorrenciaSheetProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: { observacoes: string; resultado: string }) => Promise<void>
  incidentId: string
  incidentType: string
}

export function EncerrarOcorrenciaSheet({
  open,
  onClose,
  onConfirm,
  incidentId,
  incidentType,
}: EncerrarOcorrenciaSheetProps) {
  const [observacoes, setObservacoes] = useState("")
  const [resultado, setResultado] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    // Validação
    if (!resultado) {
      toast.error("Selecione o resultado da ocorrência")
      return
    }

    if (!observacoes.trim()) {
      toast.error("Adicione observações sobre a ocorrência")
      return
    }

    setIsSubmitting(true)

    try {
      await onConfirm({
        observacoes: observacoes.trim(),
        resultado,
      })

      toast.success("Ocorrência encerrada com sucesso", {
        description: `#${incidentId} foi marcada como resolvida`,
      })

      // Reset form
      setObservacoes("")
      setResultado("")
      onClose()
    } catch (error) {
      console.error("Erro ao encerrar ocorrência:", error)
      toast.error("Erro ao encerrar ocorrência", {
        description: error instanceof Error ? error.message : "Tente novamente",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setObservacoes("")
      setResultado("")
      onClose()
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="h-[85vh] sm:h-[90vh] rounded-t-xl"
        onInteractOutside={(e) => {
          if (isSubmitting) e.preventDefault()
        }}
      >
        <SheetHeader className="text-left pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <SheetTitle className="text-lg">Encerrar Ocorrência</SheetTitle>
                <SheetDescription className="text-sm">
                  #{incidentId} - {incidentType}
                </SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6 overflow-y-auto max-h-[calc(85vh-180px)] sm:max-h-[calc(90vh-180px)]">
          {/* Resultado */}
          <div className="space-y-2">
            <Label htmlFor="resultado" className="text-base font-semibold">
              Resultado da Ocorrência *
            </Label>
            <Select value={resultado} onValueChange={setResultado} disabled={isSubmitting}>
              <SelectTrigger id="resultado" className="h-11">
                <SelectValue placeholder="Selecione o resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resolvida-sucesso">Resolvida com Sucesso</SelectItem>
                <SelectItem value="resolvida-parcial">Resolvida Parcialmente</SelectItem>
                <SelectItem value="encaminhada">Encaminhada para Investigação</SelectItem>
                <SelectItem value="sem-resolucao">Sem Resolução</SelectItem>
                <SelectItem value="falso-alarme">Falso Alarme</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Como a ocorrência foi finalizada?
            </p>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-base font-semibold">
              Observações *
            </Label>
            <Textarea
              id="observacoes"
              placeholder="Descreva o que foi feito, pessoas envolvidas, encaminhamentos, etc..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[150px] resize-none"
              maxLength={1000}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Detalhes da resolução da ocorrência</span>
              <span>{observacoes.length}/1000</span>
            </div>
          </div>

          {/* Informações */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Informações Importantes</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>A ocorrência será marcada como "Resolvida"</li>
              <li>As informações não poderão ser editadas posteriormente</li>
              <li>Um registro será criado no histórico do sistema</li>
              <li>Certifique-se de incluir todos os detalhes relevantes</li>
            </ul>
          </div>
        </div>

        <SheetFooter className="pt-4 border-t gap-2 flex-row sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !resultado || !observacoes.trim()}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Encerrando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmar Encerramento
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
