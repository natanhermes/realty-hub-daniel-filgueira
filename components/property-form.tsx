"use client"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MultiSelect } from "./multi-select";
import { Textarea } from "./ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import MoneyInput from "./money-input";
import { PropertyFormData } from "./image-gallery-client";
import { Checkbox } from "./ui/checkbox";

const propertyFeatureOptions = [
  { value: "hasGym", label: "Academia" },
  { value: "hasGourmetArea", label: "Área Gourmet" },
  { value: "hasAirConditioning", label: "Ar Condicionado" },
  { value: "hasBarbecue", label: "Churrasqueira" },
  { value: "hasOffice", label: "Escritório" },
  { value: "hasSolarEnergy", label: "Energia Solar" },
  { value: "hasElevator", label: "Elevador" },
  { value: "hasGarden", label: "Jardim" },
  { value: "hasCustomFurniture", label: "Móveis Planejados" },
  { value: "hasPool", label: "Piscina" },
  { value: "hasPlayground", label: "Playground" },
  { value: "has24hPorter", label: "Porteiro 24h" },
  { value: "hasCourt", label: "Quadra" },
  { value: "hasPartyRoom", label: "Salão de Festas" },
  { value: "hasBalcony", label: "Varanda" }
];

const purposePriceConfig = {
  sale: {
    name: "salePrice",
    label: "Preço de venda",
  },
  daily: {
    name: "dailyPrice",
    label: "Preço de diária",
  },
  rent: {
    name: "rentalPrice",
    label: "Preço de aluguel",
  },
  "sale-rent": {
    name: "salePrice",
    label: "Preço de venda",
    secondaryName: "rentalPrice",
    secondaryLabel: "Preço de aluguel"
  }
};

interface PropertyFormClientProps {
  form: UseFormReturn<PropertyFormData>;
  isEditing?: boolean;
}

export function PropertyFormClient({ form, isEditing = false }: PropertyFormClientProps) {


  const currentPurpose = form.watch("purpose");
  const priceLabelData = {
    name: currentPurpose ? purposePriceConfig[currentPurpose]?.name : "price",
    label: currentPurpose ? purposePriceConfig[currentPurpose]?.label : "Preço",
    placeholder: "R$ 0,00"
  };

  return (
    <>
      <div className="grid gap-2 w-full">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Apartamento em frente ao mar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex gap-2">
        <div className="grid gap-2 w-full">
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                    <SelectItem value="lot">Loteamento</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-2 w-full">
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de contrato</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sale">Venda</SelectItem>
                    <SelectItem value="rent">Aluguel</SelectItem>
                    <SelectItem value="sale-rent">Venda/Aluguel</SelectItem>
                    <SelectItem value="daily">Diária</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex gap-2 w-full">
        {form.watch("purpose") === 'sale-rent' ? (
          <>
            <div className="grid gap-2">
              <MoneyInput
                form={form}
                name="rentalPrice"
                label="Preço de aluguel"
                placeholder="R$ 0,00"
              />
            </div>
            <div className="grid gap-2">
              <MoneyInput
                form={form}
                name="salePrice"
                label="Preço de venda"
                placeholder="R$ 0,00"
              />
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-2 w-full">
              <MoneyInput
                form={form}
                disabled={!form.watch("purpose")}
                name={priceLabelData.name}
                label={priceLabelData.label}
                placeholder="R$ 0,00"
              />
            </div>
            <div className="grid gap-2 w-full">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
      </div >

      <div className="flex gap-2">
        <div className="grid gap-2 w-full">
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Lagoa Nova" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-2 w-full">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: https://maps.app.goo.gl/fNY2J8oCRiAX63e36" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid gap-2 w-full">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Apartamento em frente ao mar, com 2 quartos, 2 banheiros e 1 vaga de garagem"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="">
        <FormField
          control={form.control}
          name="propertyFeatures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Características do imóvel</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Selecione as características"
                  options={propertyFeatureOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="numberOfBedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quartos</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 2"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfSuites"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suítes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 2"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfBathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banheiros</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 2"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfParkingSpots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vagas</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 2"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="constructionYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano de construção</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 2020"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Andar</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 2"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área total</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 200"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="builtArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área construída</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 100" {...field} onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <MoneyInput
            form={form}
            name="condominiumFee"
            label="Taxa condominial"
            placeholder="R$ 0,00"
          />

          <MoneyInput
            form={form}
            name="iptuValue"
            label="IPTU"
            placeholder="R$ 0,00"
          />
        </div>

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="acceptsFinancing"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Aceita financiamento</FormLabel>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acceptsExchange"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Aceita troca</FormLabel>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <Button type="submit">Salvar</Button>
    </>
  )
}