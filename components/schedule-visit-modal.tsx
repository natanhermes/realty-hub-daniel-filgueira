"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, addDays, isBefore, isAfter, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ScheduleVisitModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle: string
}

// Horários disponíveis para visita
const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

// Dias indisponíveis (exemplo: finais de semana já agendados ou feriados)
const unavailableDates = [
  new Date(2025, 4, 20), // 20/05/2025
  new Date(2025, 4, 21), // 21/05/2025
  new Date(2025, 4, 25), // 25/05/2025
]

export function ScheduleVisitModal({ isOpen, onClose, propertyTitle }: ScheduleVisitModalProps) {
  const today = new Date()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)
  const [visitType, setVisitType] = useState("presencial")
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Datas disponíveis: próximos 30 dias, excluindo datas indisponíveis
  const maxDate = addDays(today, 30)

  // Função para verificar se uma data está disponível
  const isDateUnavailable = (date: Date) => {
    // Verificar se é antes de hoje ou depois do limite de 30 dias
    if (isBefore(date, today) || isAfter(date, maxDate)) {
      return true
    }

    // Verificar se é um domingo (0) ou sábado (6)
    const day = date.getDay()
    if (day === 0) {
      return true
    }

    // Verificar se está na lista de datas indisponíveis
    return unavailableDates.some((unavailableDate) => isSameDay(date, unavailableDate))
  }

  // Resetar o estado quando a modal é fechada
  const handleClose = () => {
    setTimeout(() => {
      setDate(undefined)
      setTime(undefined)
      setVisitType("presencial")
      setStep(1)
      setIsConfirmed(false)
    }, 300)
    onClose()
  }

  // Avançar para o próximo passo
  const handleNext = () => {
    if (step === 1 && date && time) {
      setStep(2)
    } else if (step === 2) {
      setIsSubmitting(true)
      // Simulando uma chamada de API
      setTimeout(() => {
        setIsSubmitting(false)
        setIsConfirmed(true)
      }, 1500)
    }
  }

  // Voltar para o passo anterior
  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <AnimatePresence mode="wait">
          {isConfirmed ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Visita Agendada!</h2>
              <p className="text-muted-foreground mb-6">
                Sua visita ao imóvel <span className="font-medium text-foreground">{propertyTitle}</span> foi agendada
                para{" "}
                <span className="font-medium text-foreground">
                  {date && format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>{" "}
                às <span className="font-medium text-foreground">{time}</span>.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Você receberá um e-mail de confirmação com os detalhes da sua visita.
              </p>
              <Button onClick={handleClose}>Fechar</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle>Agendar Visita</DialogTitle>
                <DialogDescription>Selecione a data e horário para visitar o imóvel {propertyTitle}.</DialogDescription>
              </DialogHeader>

              <div className="py-4">
                {step === 1 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Selecione uma data</Label>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={isDateUnavailable}
                          className="rounded-md border shadow"
                          locale={ptBR}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Selecione um horário</Label>
                        <Select value={time} onValueChange={setTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Horário">
                              {time ? (
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {time}
                                </div>
                              ) : (
                                "Selecione um horário"
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimes.map((t) => (
                              <SelectItem key={t} value={t}>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {t}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <h3 className="font-medium mb-2">Resumo da visita</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Imóvel:</span>
                          <span>{propertyTitle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data:</span>
                          <span>{date && format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horário:</span>
                          <span>{time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de visita</Label>
                      <RadioGroup value={visitType} onValueChange={setVisitType}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="presencial" id="presencial" />
                          <Label htmlFor="presencial">Presencial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="virtual" id="virtual" />
                          <Label htmlFor="virtual">Virtual (videochamada)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </motion.div>
                )}
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                {step === 1 ? (
                  <Button onClick={handleNext} disabled={!date || !time} className="w-full sm:w-auto">
                    Continuar
                  </Button>
                ) : (
                  <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
                    <Button variant="outline" onClick={handleBack} className="mt-2 sm:mt-0 w-full sm:w-auto">
                      Voltar
                    </Button>
                    <Button onClick={handleNext} className="w-full sm:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                          Confirmando...
                        </span>
                      ) : (
                        "Confirmar Agendamento"
                      )}
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
