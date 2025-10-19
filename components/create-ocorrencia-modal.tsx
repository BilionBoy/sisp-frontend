"use client"

import { useState } from "react"
import { X, AlertCircle, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useMobileToast } from "@/lib/hooks/use-mobile-toast"
import { buildCreatePayload } from "@/lib/services/ocorrencias-api"
import type { CreateOcorrenciaPayload } from "@/lib/types/ocorrencia-api"
import type { Incident } from "@/lib/types/map"

interface CreateOcorrenciaModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (incident: Incident) => void
  onSubmit: (payload: CreateOcorrenciaPayload) => Promise<Incident>
  initialCoordinates?: [number, number] // [lat, lng]
}

/**
 * Gera número de BO único
 */
function generateNumeroBO(): string {
  const ano = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `BO${ano}${timestamp}`
}

/**
 * Modal para criar nova ocorrência com UX melhorada (Wizard Multi-Step)
 */
export function CreateOcorrenciaModal({
  open,
  onClose,
  onSuccess,
  onSubmit,
  initialCoordinates,
}: CreateOcorrenciaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const mobileToast = useMobileToast()

  // Dados do formulário - campos essenciais
  const [idTipoCrime, setIdTipoCrime] = useState<number>(23)
  const [descricao, setDescricao] = useState("")

  // Campos preenchidos automaticamente
  const [numeroBO] = useState(generateNumeroBO())
  const [idBairro] = useState<number>(1)
  const [dataOcorrencia] = useState(new Date().toISOString().split('T')[0])
  const [horaOcorrencia] = useState(new Date().toTimeString().slice(0, 5))

  // Coordenadas: usar diretamente de initialCoordinates (não useState)
  // para garantir que sempre usamos as coordenadas mais recentes do clique
  const latitude = initialCoordinates?.[0] || -8.76077
  const longitude = initialCoordinates?.[1] || -63.8999

  const [logradouro] = useState("Não informado")
  const [numeroEndereco] = useState("")
  const [pontoReferencia] = useState("")
  const [vitimas] = useState(0)
  const [valorPrejuizo] = useState(0)
  const [recuperado] = useState(false)

  const calcularDiaSemanaEPeriodo = () => {
    const data = new Date(`${dataOcorrencia}T${horaOcorrencia}`)
    const diaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })
      .format(data)
      .replace(/^\w/, c => c.toUpperCase())

    const hora = parseInt(horaOcorrencia.split(':')[0])
    let periodoDia = "Manhã"
    if (hora >= 0 && hora < 6) periodoDia = "Madrugada"
    else if (hora >= 6 && hora < 12) periodoDia = "Manhã"
    else if (hora >= 12 && hora < 18) periodoDia = "Tarde"
    else periodoDia = "Noite"

    return { diaSemana, periodoDia }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação simples
    if (!descricao.trim()) {
      mobileToast.error("Descrição da ocorrência é obrigatória")
      return
    }

    try {
      setIsSubmitting(true)
      const { diaSemana, periodoDia } = calcularDiaSemanaEPeriodo()

      const payload = buildCreatePayload({
        numero_bo: numeroBO,
        id_tipo_crime: idTipoCrime,
        id_bairro: idBairro,
        data_ocorrencia: dataOcorrencia,
        hora_ocorrencia: horaOcorrencia,
        dia_semana: diaSemana,
        periodo_dia: periodoDia,
        latitude_ocorrencia: latitude,
        longitude_ocorrencia: longitude,
        logradouro,
        numero_endereco: numeroEndereco,
        ponto_referencia: pontoReferencia,
        descricao_ocorrencia: descricao,
        vitimas,
        valor_prejuizo: valorPrejuizo,
        recuperado,
        status_ocorrencia: "Registrada",
        origem_registro: "Sistema Integrado",
        data_registro: new Date().toISOString(),
        usuario_registro: 1,
      })

      const incident = await onSubmit(payload)
      mobileToast.success("Ocorrência criada com sucesso!")
      onSuccess(incident)
      onClose()
      resetForm()
    } catch (error) {
      console.error("Erro ao criar ocorrência:", error)
      mobileToast.error(error instanceof Error ? error.message : "Erro ao criar ocorrência")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIdTipoCrime(23)
    setDescricao("")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl mt-12">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Nova Ocorrência
            </div>
            <Badge variant="secondary" className="text-xs font-mono">
              {numeroBO}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Formulário Simplificado */}
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Registrar Nova Ocorrência
              </h3>
              <p className="text-xs text-muted-foreground">
                Preencha os campos abaixo. Os demais dados serão preenchidos automaticamente.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoCrime">Tipo de Crime</Label>
              <Select value={String(idTipoCrime)} onValueChange={(v) => setIdTipoCrime(parseInt(v))}>
                <SelectTrigger id="tipoCrime">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="23">Furto de Celular</SelectItem>
                  <SelectItem value="18">Furto Simples</SelectItem>
                  <SelectItem value="19">Furto Qualificado</SelectItem>
                  <SelectItem value="11">Roubo a Pedestre</SelectItem>
                  <SelectItem value="12">Roubo a Estabelecimento Comercial</SelectItem>
                  <SelectItem value="13">Roubo de Veículo</SelectItem>
                  <SelectItem value="1">Homicídio</SelectItem>
                  <SelectItem value="4">Lesão Corporal Dolosa</SelectItem>
                  <SelectItem value="27">Tráfico de Drogas</SelectItem>
                  <SelectItem value="55">Acidente de Trânsito com Vítima</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">
                Descrição Detalhada <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descricao"
                placeholder="Ex: Furto de motocicleta na Avenida..., Acidente entre dois veículos..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={8}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                Forneça detalhes sobre o ocorrido, circunstâncias e envolvidos
              </p>
            </div>

            {/* Informações automáticas */}
            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground">Dados Automáticos:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Número BO:</span>
                  <span className="ml-2 font-mono font-medium">{numeroBO}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Data/Hora:</span>
                  <span className="ml-2 font-medium">{dataOcorrencia} {horaOcorrencia}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Coordenadas:</span>
                  <span className="ml-2 font-mono font-medium">{latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 font-medium">Registrada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onClose()
              }}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Criando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Criar Ocorrência
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
