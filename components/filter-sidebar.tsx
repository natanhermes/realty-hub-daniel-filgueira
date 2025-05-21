"use client"

import type React from "react"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PropertyFilters } from "@/types/Property"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import type { UseFormReturn } from "react-hook-form"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  form: UseFormReturn<PropertyFilters>
}

export function FilterSidebar({ form, isOpen, onClose }: FilterSidebarProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const resetFilters = () => {
    form.reset({
      bedrooms: undefined,
      maxPrice: '',
      minPrice: '',
      minArea: '',
      neighborhood: '',
      page: 1,
      propertyType: undefined,
      purpose: undefined,
      query: '',
    })
  }

  return (
    <Form {...form}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-full sm:w-80 bg-background z-50 overflow-y-auto shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filtros</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5 text-darkBlue" />
                </Button>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Cidade ou nome do condomínio"
                          className="border text-gray-900"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem className='w-full '>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de imóvel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">Apartamento</SelectItem>
                          <SelectItem value="house">Casa</SelectItem>
                          <SelectItem value="commercial">Comercial</SelectItem>
                          <SelectItem value="lot">Loteamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem className='w-full '>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de contrato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rent">Aluguel</SelectItem>
                          <SelectItem value="sale">Venda</SelectItem>
                          <SelectItem value="daily">Diária</SelectItem>
                          <SelectItem value="sale-rent">Venda e Aluguel</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div>
                  <h3 className="text-lg font-medium mb-2">Faixa de Preço</h3>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="minPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Preço mínimo"
                              className="border text-darkBlue"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Preço máximo"
                              className="border text-darkBlue"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Localização</h3>
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem className='w-full '>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Bairro"
                            className="border text-darkBlue"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Quartos</h3>
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Quartos" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2+">2+ quartos</SelectItem>
                            <SelectItem value="3+">3+ quartos</SelectItem>
                            <SelectItem value="4+">4+ quartos</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Área mínima</h3>
                  <FormField
                    control={form.control}
                    name="minArea"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Área mínima"
                            className="border text-darkBlue"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={resetFilters} className="w-1/2 text-darkBlue">
                    Limpar
                  </Button>
                  <Button onClick={onClose} className="w-1/2 bg-darkBlue hover:bg-darkBlue/90 text-whiteIce">
                    Aplicar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  )
}
