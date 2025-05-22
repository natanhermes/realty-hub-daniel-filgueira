"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PropertyContactFormProps {
  propertyTitle: string
  propertyCode: string
}

export function PropertyContactForm({ propertyTitle, propertyCode }: PropertyContactFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    contactPreference: "whatsapp",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormState((prev) => ({ ...prev, contactPreference: value }))
  }

  const sendWhatsAppMessage = async () => {
    const currentUrl = window.location.href

    try {
      await fetch('/api/whatsapp/send-message', {
        method: 'POST',
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          message: formState.message,
          propertyLink: currentUrl,
          contactPreference: formState.contactPreference
        })
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem para o WhatsApp:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await sendWhatsAppMessage()
      setIsSubmitted(true)

      setFormState({
        name: "",
        email: "",
        phone: "",
        message: `Olá, tenho interesse no imóvel "${propertyTitle} - ${propertyCode}". Gostaria de mais informações.`,
        contactPreference: "whatsapp",
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-muted/30 rounded-xl p-4 sm:p-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Interessado neste imóvel?</h2>
      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
        Preencha o formulário abaixo e entraremos em contato o mais breve possível.
      </p>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center"
        >
          <Check className="h-5 w-5 mr-2 text-green-600" />
          <span>Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="number"
                value={formState.phone}
                onChange={(e) => {
                  const cleanedValue = e.target.value.replace(/\D/g, '')
                  e.target.value = cleanedValue
                  return handleChange(e)
                }}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Preferência de contato</Label>
              <RadioGroup
                value={formState.contactPreference}
                onValueChange={handleRadioChange}
                className="flex flex-wrap space-x-2 sm:space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp" className="text-sm sm:text-base">
                    WhatsApp
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="text-sm sm:text-base">
                    Telefone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email-radio" />
                  <Label htmlFor="email-radio" className="text-sm sm:text-base">
                    E-mail
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2 mb-4 sm:mb-6">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              name="message"
              value={
                formState.message || `Olá, tenho interesse no imóvel "${propertyTitle}". Gostaria de mais informações.`
              }
              onChange={handleChange}
              placeholder="Sua mensagem"
              rows={4}
              required
              className="resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                Enviando...
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Enviar mensagem
              </span>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  )
}
