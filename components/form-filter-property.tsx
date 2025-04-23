import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, Form } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PropertyFilters } from "@/types/Property";

export function FormFilterProperty({ form, isDesktop = false }: { form: UseFormReturn<PropertyFilters>, isDesktop?: boolean }) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-2 max-w-[40rem] mx-auto ">
        <div className='flex gap-2 w-full md:flex-row flex-col'>
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Busque seu imóvel pelo bairro, cidade ou nome do condomínio"
                    className="border text-gray-900"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem className='w-full md:w-2/4'>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        </div>

        <div className='flex gap-2 w-full md:flex-row flex-col'>
          <div className='flex gap-2 w-full'>
            <FormField
              control={form.control}
              name="minPrice"
              render={({ field }) => (
                <FormItem className='w-full md:w-2/4'>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Preço mínimo"
                      className="border text-gray-900"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem className='w-full md:w-2/4'>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Preço máximo"
                      className="border text-gray-900"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="minArea"
            render={({ field }) => (
              <FormItem className='w-full md:w-2/4'>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Área mínima"
                    className="border text-gray-900"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className='flex gap-2 w-full md:flex-row flex-col'>
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem className='w-full md:w-2/4'>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Bairro"
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
              <FormItem className='w-full md:w-2/4'>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            name="bedrooms"
            render={({ field }) => (
              <FormItem className='w-full md:w-2/4'>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      </div>
    </Form>
  )
}
