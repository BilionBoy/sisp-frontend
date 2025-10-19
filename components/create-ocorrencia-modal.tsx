"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Calendar, Clock, AlertCircle, DollarSign, Users, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { buildCreatePayload } from "@/lib/services/ocorrencias-api"
import type { CreateOcorrenciaPayload } from "@/lib/types/ocorrencia-api"
import type { Incident } from "@/lib/types/map"
import { cn } from "@/lib/utils"

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
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dados do formulário
  const [numeroBO, setNumeroBO] = useState("")
  const [idTipoCrime, setIdTipoCrime] = useState<number>(23)
  const [idBairro, setIdBairro] = useState<number>(1)
  const [dataOcorrencia, setDataOcorrencia] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [horaOcorrencia, setHoraOcorrencia] = useState(
    new Date().toTimeString().slice(0, 5)
  )
  const [latitude, setLatitude] = useState(
    initialCoordinates?.[0] || -8.76077
  )
  const [longitude, setLongitude] = useState(
    initialCoordinates?.[1] || -63.8999
  )
  const [logradouro, setLogradouro] = useState("")
  const [numeroEndereco, setNumeroEndereco] = useState("")
  const [pontoReferencia, setPontoReferencia] = useState("")
  const [descricao, setDescricao] = useState("")
  const [vitimas, setVitimas] = useState(0)
  const [valorPrejuizo, setValorPrejuizo] = useState(0)
  const [recuperado, setRecuperado] = useState(false)

  // Auto-gerar número de BO ao abrir modal
  useEffect(() => {
    if (open && !numeroBO) {
      setNumeroBO(generateNumeroBO())
    }
  }, [open, numeroBO])

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

  const validarEtapa = (etapa: number): boolean => {
    switch (etapa) {
      case 1:
        if (!descricao.trim()) {
          toast.error("Descrição da ocorrência é obrigatória")
          return false
        }
        return true
      case 2:
        if (!logradouro.trim()) {
          toast.error("Logradouro é obrigatório")
          return false
        }
        return true
      default:
        return true
    }
  }

  const proximaEtapa = () => {
    if (validarEtapa(step)) {
      setStep(prev => Math.min(prev + 1, 4))
    }
  }

  const etapaAnterior = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validarEtapa(4)) return

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
      toast.success("Ocorrência criada com sucesso!")
      onSuccess(incident)
      onClose()
      resetForm()
    } catch (error) {
      console.error("Erro ao criar ocorrência:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao criar ocorrência")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setNumeroBO("")
    setIdTipoCrime(23)
    setIdBairro(1)
    setDataOcorrencia(new Date().toISOString().split('T')[0])
    setHoraOcorrencia(new Date().toTimeString().slice(0, 5))
    setLatitude(initialCoordinates?.[0] || -8.76077)
    setLongitude(initialCoordinates?.[1] || -63.8999)
    setLogradouro("")
    setNumeroEndereco("")
    setPontoReferencia("")
    setDescricao("")
    setVitimas(0)
    setValorPrejuizo(0)
    setRecuperado(false)
  }

  const totalSteps = 4

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
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

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-4 px-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                s < step ? "bg-green-500 border-green-500 text-white" :
                s === step ? "bg-primary border-primary text-white" :
                "bg-muted border-muted-foreground/30 text-muted-foreground"
              )}>
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < totalSteps && (
                <div className={cn(
                  "flex-1 h-1 mx-2 rounded transition-all",
                  s < step ? "bg-green-500" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-1">
          {/* Etapa 1: O que aconteceu? */}
          {step === 1 && (
            <div className="space-y-4 px-4 animate-in fade-in duration-300">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  O que aconteceu?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Descreva a ocorrência de forma clara e objetiva
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoCrime">Tipo de Crime</Label>
                <Select value={String(idTipoCrime)} onValueChange={(v) => setIdTipoCrime(parseInt(v))}>
                  <SelectTrigger id="tipoCrime">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="23">Furto</SelectItem>
                    <SelectItem value="24">Roubo</SelectItem>
                    <SelectItem value="25">Homicídio</SelectItem>
                    <SelectItem value="26">Lesão Corporal</SelectItem>
                    <SelectItem value="27">Tráfico de Drogas</SelectItem>
                    <SelectItem value="28">Acidente de Trânsito</SelectItem>
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
                  rows={6}
                  className="resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Forneça detalhes sobre o ocorrido, circunstâncias e envolvidos
                </p>
              </div>
            </div>
          )}

          {/* Etapa 2: Onde aconteceu? */}
          {step === 2 && (
            <div className="space-y-4 px-4 animate-in fade-in duration-300">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Onde aconteceu?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Informe o local da ocorrência
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logradouro">
                    Logradouro <span className="text-red-500">*</span>
                  </Label>
                  <Input id="logradouro" placeholder="Av. Presidente Dutra" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroEndereco">Número</Label>
                  <Input id="numeroEndereco" placeholder="123" value={numeroEndereco} onChange={(e) => setNumeroEndereco(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pontoReferencia">Ponto de Referência</Label>
                <Input id="pontoReferencia" placeholder="Próximo ao mercado, em frente à escola..." value={pontoReferencia} onChange={(e) => setPontoReferencia(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Select value={String(idBairro)} onValueChange={(v) => setIdBairro(parseInt(v))}>
                  <SelectTrigger id="bairro"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Centro</SelectItem>
                    <SelectItem value="2">Zona Leste</SelectItem>
                    <SelectItem value="3">Zona Sul</SelectItem>
                    <SelectItem value="4">Zona Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input id="latitude" type="number" step="0.000001" value={latitude} onChange={(e) => setLatitude(parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input id="longitude" type="number" step="0.000001" value={longitude} onChange={(e) => setLongitude(parseFloat(e.target.value))} />
                </div>
              </div>
            </div>
          )}

          {/* Etapa 3: Quando aconteceu? */}
          {step === 3 && (
            <div className="space-y-4 px-4 animate-in fade-in duration-300">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Quando aconteceu?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Informe data e hora da ocorrência
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataOcorrencia">Data da Ocorrência</Label>
                  <Input id="dataOcorrencia" type="date" value={dataOcorrencia} onChange={(e) => setDataOcorrencia(e.target.value)} max={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaOcorrencia">Hora da Ocorrência</Label>
                  <Input id="horaOcorrencia" type="time" value={horaOcorrencia} onChange={(e) => setHoraOcorrencia(e.target.value)} />
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h4 className="text-xs font-semibold mb-2">Calculado Automaticamente:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Dia da Semana: </span>
                    <span className="font-medium">{calcularDiaSemanaEPeriodo().diaSemana}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Período: </span>
                    <span className="font-medium">{calcularDiaSemanaEPeriodo().periodoDia}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Etapa 4: Detalhes + Resumo */}
          {step === 4 && (
            <div className="space-y-4 px-4 animate-in fade-in duration-300">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Detalhes Adicionais
                </h3>
                <p className="text-xs text-muted-foreground">
                  Informações complementares (opcional)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vitimas" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Número de Vítimas
                  </Label>
                  <Input id="vitimas" type="number" min="0" value={vitimas} onChange={(e) => setVitimas(parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorPrejuizo" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valor do Prejuízo (R$)
                  </Label>
                  <Input id="valorPrejuizo" type="number" min="0" step="0.01" value={valorPrejuizo} onChange={(e) => setValorPrejuizo(parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                <Checkbox id="recuperado" checked={recuperado} onCheckedChange={(checked) => setRecuperado(checked as boolean)} />
                <Label htmlFor="recuperado" className="text-sm font-normal cursor-pointer flex-1">
                  Bem ou objeto recuperado
                </Label>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold">Resumo da Ocorrência:</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número BO:</span>
                    <span className="font-mono font-semibold">{numeroBO}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">Crime Tipo {idTipoCrime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Local:</span>
                    <span className="font-medium">{logradouro || "Não informado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data/Hora:</span>
                    <span className="font-medium">{dataOcorrencia} às {horaOcorrencia}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Botões de Navegação */}
        <div className="flex gap-3 justify-between pt-4 border-t px-4">
          <Button type="button" variant="outline" onClick={step === 1 ? () => { resetForm(); onClose() } : etapaAnterior} disabled={isSubmitting}>
            {step === 1 ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar
              </>
            )}
          </Button>

          {step < totalSteps ? (
            <Button type="button" onClick={proximaEtapa}>
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Criando..." : "Criar Ocorrência"}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
