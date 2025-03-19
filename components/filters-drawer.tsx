'use client'
import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { FormFilterProperty } from "./form-filter-property"
import { PropertyFilters } from "@/types/Property"
import { UseFormReturn } from "react-hook-form"
import { FaFilter } from "react-icons/fa";

export function FiltersDrawer({ form }: { form: UseFormReturn<PropertyFilters> }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-[#000066] ">Filtrar imóveis <FaFilter size={12} className="ml-2" /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Filtrar imóveis</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias para encontrar o imóvel ideal.
            </DialogDescription>
          </DialogHeader>
          <FormFilterProperty form={form} isDesktop />
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>Limpar filtros</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Filtrar imóveis <FaFilter size={16} className="text-[#000066] ml-2" /></Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filtrar imóveis</DrawerTitle>
          <DrawerDescription>
            Faça as alterações necessárias para encontrar o imóvel ideal.
          </DrawerDescription>
        </DrawerHeader>
        <FormFilterProperty form={form} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>Limpar filtros</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
