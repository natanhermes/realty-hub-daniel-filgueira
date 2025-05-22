"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, Info, Captions, Paperclip, Trash, Eye, EyeOff, Star, StarOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import MediaUpload from "@/components/media-upload"
import { RichTextEditor } from "./rich-text-editor"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import MoneyInput from "./money-input"
import { MultiSelect } from "./multi-select"
import { useMobile } from "@/hooks/use-mobile"
import type { Property } from "@/types/Property"
import { toast } from "sonner"
import { revalidatePropertiesAction } from "@/app/actions/revalidatePropertiesAction"
import { createFileFromUrl } from "@/lib/utils"
import { useUploadMedia } from "@/hooks/use-upload-media"
import { InputMask } from "./custom-input"

const purposePriceLabels = {
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

export const propertySchema = z.object({
  images: z.custom<FileList>().optional(),
  title: z.string({
    required_error: 'O título é obrigatório'
  }).min(10, "O título está muito curto"),
  purpose: z.enum(["sale", "rent", "sale-rent", "daily"], {
    required_error: "Selecione o tipo de contrato",
    invalid_type_error: "Selecione o tipo de contrato",
    message: "Selecione o tipo de contrato"
  }),
  salePrice: z.number().optional(),
  rentalPrice: z.number().optional(),
  dailyPrice: z.number().optional(),
  code: z.string({
    required_error: "O código é obrigatório",
  }).min(3, { message: 'O código é obrigatório.' }),
  propertyType: z.enum(["apartment", "house", "commercial", "lot"], {
    required_error: "Selecione o tipo do imóvel",
    invalid_type_error: "Selecione o tipo do imóvel",
    message: "Selecione o tipo do imóvel"
  }),
  neighborhood: z.string().optional(),
  street: z.string({
    required_error: 'Nome da rua é obrigatório'
  }).min(8, { message: 'Nome da rua é obrigatório' }),
  city: z.string({
    required_error: 'Nome da cidade é obrigatório'
  }).min(3, { message: 'Nome da cidade é obrigatório' }),
  number: z.string().optional(),
  cep: z.string({
    required_error: 'O CEP é obrigatório'
  }).min(8, { message: 'O CEP é obrigatório' }),
  state: z.string({
    required_error: 'O estado é obrigatório'
  }).min(2, { message: 'O estado é obrigatório' }),
  location: z.string().optional(),
  description: z.string({
    'required_error': 'A descrição é obrigatória.',
  }).min(10, "A descrição deve ter no mínimo 10 caracteres"),
  propertyFeatures: z.array(z.string()).optional(),
  numberOfBedrooms: z.number().optional(),
  numberOfSuites: z.number().optional(),
  numberOfBathrooms: z.number().optional(),
  numberOfParkingSpots: z.number().optional(),
  constructionYear: z.number().optional(),
  floor: z.number().optional(),
  condominiumFee: z.number().optional(),
  iptuValue: z.number().optional(),
  acceptsFinancing: z.boolean().optional().default(false),
  acceptsExchange: z.boolean().optional().default(false),
  totalArea: z.number().optional(),
  builtArea: z.number().optional(),
}).refine((data) => {
  if (data.purpose === "sale" || data.purpose === "sale-rent") {
    return data.salePrice && data.salePrice > 0;
  }
  return true;
}, {
  message: "O preço de venda é obrigatório e deve ser maior que zero",
  path: ["salePrice"]
}).refine((data) => {
  if (data.purpose === "rent" || data.purpose === "sale-rent") {
    return data.rentalPrice && data.rentalPrice > 0;
  }
  return true;
}, {
  message: "O preço do aluguel é obrigatório e deve ser maior que zero",
  path: ["rentalPrice"]
}).refine((data) => {
  if (data.purpose === "daily") {
    return data.dailyPrice && data.dailyPrice > 0;
  }
  return true;
}, {
  message: "O preço da diária é obrigatório e deve ser maior que zero",
  path: ["dailyPrice"]
});

export type PropertyFormData = z.infer<typeof propertySchema>;

type ActiveTab = "basic" | "details" | "media" | "address"

interface PropertyProps {
  userId?: string
  property?: Property
  isEditing?: boolean
}

export function PropertyForm({ property, isEditing, userId }: PropertyProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("basic")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])

  const { uploadMedia, isUploading } = useUploadMedia()

  const isMobile = useMobile()

  const router = useRouter()

  const propertyForm = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || '',
      code: property?.code || '',
      propertyType: property?.propertyType as "apartment" | "house" | "commercial" | "lot" || '',
      purpose: property?.purpose as "sale" | "rent" | "sale-rent" | "daily" || '',
      neighborhood: property?.neighborhood || '',
      cep: property?.cep || '',
      state: property?.state || '',
      street: property?.street || '',
      number: property?.number || '',
      city: property?.city || '',
      salePrice: property?.salePrice || 0,
      dailyPrice: property?.dailyPrice || 0,
      rentalPrice: property?.rentalPrice || 0,
      condominiumFee: property?.condominiumFee || 0,
      iptuValue: property?.iptuValue || 0,
      acceptsFinancing: property?.acceptsFinancing || false,
      acceptsExchange: property?.acceptsExchange || false,
      builtArea: property?.builtArea || 0,
      totalArea: property?.totalArea || 0,
      numberOfBedrooms: property?.numberOfBedrooms || 0,
      numberOfSuites: property?.numberOfSuites || 0,
      numberOfBathrooms: property?.numberOfBathrooms || 0,
      numberOfParkingSpots: property?.numberOfParkingSpots || 0,
      constructionYear: property?.constructionYear || 0,
      floor: property?.floor || 0,
      location: property?.location || '',
      description: property?.description || '',
      propertyFeatures: property?.infrastructure ? Object.keys(property.infrastructure).filter(key =>
        key !== 'id' &&
        key !== 'propertyId' &&
        (property.infrastructure as unknown as Record<string, boolean>)[key] === true
      ) : []
    }
  });

  const currentPurpose = propertyForm.watch("purpose");
  const priceLabelData = {
    name: currentPurpose ? purposePriceLabels[currentPurpose]?.name : "price",
    label: currentPurpose ? purposePriceLabels[currentPurpose]?.label : "Preço",
    placeholder: "R$ 0,00"
  };

  const { mutateAsync: createProperty, isPending: isCreatingProperty } = useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      const createPropertyPromise = (async () => {
        formData.append('userId', userId!)
        const response = await fetch('/api/property', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.statusText || 'Erro ao criar imóvel');
        }

        return data;
      })();

      toast.promise(createPropertyPromise, {
        loading: 'Cadastrando imóvel...',
        success: 'Imóvel cadastrado com sucesso.',
        error: e => e
      })

      const responseData = await createPropertyPromise

      await uploadMedia({ mediaFiles, responseData })
    }
  });

  const { mutateAsync: updateProperty, isPending: isUpdatingProperty } = useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      const updatePropertyPromise = (async () => {
        const response = await fetch(`/api/property/${property?.code}`, {
          method: 'PUT',
          body: formData
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.statusText || 'Erro ao editar imóvel');
        }

        return responseData
      })()

      toast.promise(updatePropertyPromise, {
        loading: 'Editando informações do imóvel...',
        success: 'Edição concluída!',
        error: e => e,
      })

      const responseData = await updatePropertyPromise

      const filenames = new Set(
        property?.image.map(img => img.url?.split('/').pop())
      );

      const newFiles = mediaFiles.filter(arq => {
        return !filenames.has(arq.name);
      });

      await uploadMedia({ mediaFiles: newFiles, responseData })
    }
  });

  const { mutateAsync: deleteProperty, isPending: isDeletingProperty } = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const deletePropertyPromise = (async () => {
        const response = await fetch('/api/property', {
          method: 'DELETE',
          body: JSON.stringify({ code })
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.statusText || 'Erro ao deletar imóvel');
        }
      })

      toast.promise(deletePropertyPromise, {
        loading: 'Removendo imóvel...',
        success: 'Imóvel removido com sucesso.',
        error: e => e,
      })

      await revalidatePropertiesAction()
      router.push('/dashboard/my-properties')
    }
  })

  const { mutateAsync: deletePropertySingleMedia, isPending: isDeletingPropertyMedia } = useMutation({
    mutationFn: async (index: number) => {
      const deletePropertySingleMediaPromise = (async () => {
        const response = await fetch('/api/property/images', {
          method: 'DELETE',
          body: JSON.stringify({ id: property?.image[index]?.id })
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.statusText || 'Erro ao deletar arquivo');
        }
      })

      toast.promise(deletePropertySingleMediaPromise, {
        loading: 'Removendo arquivo...',
        success: 'Arquivo removido com sucesso.',
        error: e => {
          return e
        },
      })
    }
  })

  async function onSubmit(properyFormData: PropertyFormData) {
    const formData = new FormData();
    Object.entries(properyFormData).forEach(([key, value]) => {
      if (key === 'images') return
      if (key === 'existingMedia') return
      if (value === undefined || value === null) return
      if (key === "propertyFeatures" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, String(value))
      }
    });

    if (isEditing) {
      await updateProperty({ formData })
    } else {
      await createProperty({ formData })
    }
    revalidatePropertiesAction()
    router.push('/dashboard/my-properties')
  }

  async function handleTriggerForm(tab: ActiveTab) {
    let propertyFormIsValid = false

    if (tab === 'basic') {
      propertyFormIsValid = await propertyForm.trigger(["title", "code", "description", "purpose", "propertyType"])

      if (currentPurpose === 'sale' || currentPurpose === 'sale-rent') {
        propertyFormIsValid = await propertyForm.trigger(["salePrice"])
      }
      if (currentPurpose === 'rent' || currentPurpose === 'sale-rent') {
        propertyFormIsValid = await propertyForm.trigger(["rentalPrice"])
      }
      if (currentPurpose === 'daily') {
        propertyFormIsValid = await propertyForm.trigger(["dailyPrice"])
      }

      return propertyFormIsValid
    } else if (tab === 'details') {
      const propertyFormIsValid = await propertyForm.trigger(["numberOfBedrooms", "numberOfBathrooms", "totalArea", "builtArea",])

      return propertyFormIsValid
    } else if (tab === 'address') {
      const propertyFormIsValid = await propertyForm.trigger(["cep", "city", "state"])

      return propertyFormIsValid
    }
  }

  async function handleInactiveProperty(code: string) {
    const inactivePropertyPromise = async () => {
      const response = await fetch(`/api/property/change-status/${code}`, {
        method: 'PUT',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.statusText || 'Erro na solicitação!');
      }
    }

    toast.promise(inactivePropertyPromise, {
      loading: `Atualizando exibição...`,
      success: () => {
        revalidatePropertiesAction()
        router.push('/dashboard/my-properties')
        return 'Atualização concluída.'
      },
      error: e => e,
    })
  }

  async function handleHighlightProperty(code: string) {
    const inactivePropertyPromise = async () => {
      const response = await fetch(`/api/property/change-highlight/${code}`, {
        method: 'PUT',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.statusText || 'Erro na solicitação!');
      }
    }

    toast.promise(inactivePropertyPromise, {
      loading: `Atualizando exibição...`,
      success: () => {
        revalidatePropertiesAction()
        router.push('/dashboard/my-properties')
        return 'Atualização concluída.'
      },
      error: e => e,
    })
  }

  async function onHighlightMedia(index: number) {
    const highlightMediaPromise = async () => {
      const response = await fetch('/api/property/images/highlight', {
        method: 'POST',
        body: JSON.stringify({ id: property?.image[index].id, propertyId: property?.id })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.statusText || 'Erro ao deletar arquivo');
      }
    }

    toast.promise(highlightMediaPromise, {
      loading: 'Definindo imagem de destaque...',
      success: () => {
        revalidatePropertiesAction()
        router.push('/dashboard/my-properties')
        return 'Imagem destacada com sucesso.'
      },
      error: e => e,
    })
  }

  const goToNextTab = async () => {

    if (activeTab === "basic") {
      const propertyFormIsValid = await handleTriggerForm(activeTab)

      if (propertyFormIsValid) {
        setActiveTab("details")
      }
    } else if (activeTab === "details") {
      const propertyFormIsValid = await handleTriggerForm(activeTab)

      if (propertyFormIsValid) {
        setActiveTab("address")
      }
    } else if (activeTab === "address") {
      const propertyFormIsValid = await handleTriggerForm(activeTab)

      if (propertyFormIsValid) {
        setActiveTab("media")
      }
    }
  }

  const isLoading = isCreatingProperty || isUpdatingProperty || isDeletingProperty || isDeletingPropertyMedia || isUploading

  const cep = propertyForm.watch('cep')

  const fetchCep = useCallback(async (cepValue: string) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data = await res.json();

      if (data.erro) throw new Error("CEP inválido");

      const cepToFormMap = {
        logradouro: "street",
        bairro: "neighborhood",
        localidade: "city",
        uf: "state",
      } as const;

      Object.entries(cepToFormMap).forEach(([apiKey, formKey]) => {
        if (data[apiKey]) {
          propertyForm.setValue(formKey, data[apiKey]);
        }
      });

    } catch {
      toast.error("CEP inválido. Preencha os dados manualmente.");
    }
  }, [propertyForm]);

  useEffect(() => {
    const onlyNumbersCep = cep?.replace(/\D/g, "")

    if (onlyNumbersCep.length !== 8) return

    fetchCep(onlyNumbersCep)

  }, [cep, fetchCep])

  useEffect(() => {
    (async () => {
      if (property?.image?.length) {
        try {
          const filesFromUrl = await Promise.all(
            property.image.map(item =>
              createFileFromUrl(item.url || '')
            )
          )
          setMediaFiles(filesFromUrl)
        } catch (error) {
          console.error('Erro ao buscar blobs:', error);
        }
      }
    })();
  }, [property]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-xl shadow-lg p-2"
    >
      {property && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold w-full text-leadGray">Criado por: {property.createdBy.name}</span>

          <div className="w-full flex items-center justify-end p-2 gap-2">

            {property.active && (
              <Button className="space-x-2 bg-yellow-500 hover:bg-yellow-500/80 text-whiteIce" onClick={() => handleHighlightProperty(property.code)}>
                {property.highlight ? <StarOff size={16} /> : <Star size={16} />}
                {!isMobile && <span>{property.highlight ? 'Remover destaque' : 'Destacar'}</span>}
              </Button>
            )}
            <Button variant="outline" className="space-x-2" onClick={() => handleInactiveProperty(property.code)}>
              {property.active ? <EyeOff size={16} /> : <Eye size={16} />}
              {!isMobile && <span>{property.active ? 'Ocultar' : 'Exibir'}</span>}
            </Button>
            <Button variant="destructive" className="space-x-2" onClick={() => deleteProperty({ code: property.code })}>
              <Trash size={16} />
              {!isMobile && <span>Apagar</span>}
            </Button>
          </div>
        </div>
      )}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="basic" disabled={activeTab !== 'basic'}>
            <Info size={16} />
            {!isMobile && <span>Informações Básicas</span>}
          </TabsTrigger>
          <TabsTrigger value="details" disabled={activeTab !== 'details'}>
            <Captions size={18} />
            {!isMobile && <span>Detalhes</span>}
          </TabsTrigger>
          <TabsTrigger value="address" disabled={activeTab !== 'address'}>
            <Paperclip size={16} />
            {!isMobile && <span>Endereço</span>}
          </TabsTrigger>
          <TabsTrigger value="media" disabled={activeTab !== 'media'}>
            <Paperclip size={16} />
            {!isMobile && <span>Mídias</span>}
          </TabsTrigger>
        </TabsList>

        <Form {...propertyForm}>
          <form onSubmit={propertyForm.handleSubmit(onSubmit)} className="lg:h-[630px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <TabsContent value="basic" className="h-full">
                  <Card className="h-full">
                    <CardContent className="pt-2 h-full flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <FormField
                          control={propertyForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem className="md:col-span-3">
                              <FormLabel>Título do Imóvel</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Apartamento de Luxo nos Jardins" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel>Código</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: 0204TJ@" {...field} disabled={isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={propertyForm.control}
                          name="propertyType"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel>Tipo de Imóvel</FormLabel>
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
                        <FormField
                          control={propertyForm.control}
                          name="purpose"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
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

                        {currentPurpose === 'sale-rent' ? (
                          <>
                            <MoneyInput
                              form={propertyForm}
                              name="rentalPrice"
                              label="Preço de aluguel"
                              placeholder="R$ 0,00"
                            />

                            <MoneyInput
                              form={propertyForm}
                              name="salePrice"
                              label="Preço de venda"
                              placeholder="R$ 0,00"
                            />
                          </>
                        ) : (
                          <MoneyInput
                            form={propertyForm}
                            disabled={!currentPurpose}
                            name={priceLabelData.name}
                            label={priceLabelData.label}
                            placeholder="R$ 0,00"
                          />
                        )}

                        <FormField
                          control={propertyForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="md:col-span-4">
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <RichTextEditor
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Descreva o imóvel com detalhes..."
                                />
                              </FormControl>
                              <FormDescription className="italic text-xs ml-1 mt-1">Uma descrição detalhada ajuda a atrair mais interessados.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end mt-auto">
                        <Button type="button" onClick={goToNextTab}>
                          Próximo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="h-full">
                  <Card className="h-full">
                    <CardContent className="pt-2 h-full flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <FormField
                          control={propertyForm.control}
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
                          control={propertyForm.control}
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
                          control={propertyForm.control}
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
                          control={propertyForm.control}
                          name="numberOfParkingSpots"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vagas de estacionamento</FormLabel>
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
                          control={propertyForm.control}
                          name="totalArea"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Área total (m²)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Ex: 120"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="builtArea"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Área construída (m²)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Ex: 120"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={propertyForm.control}
                          name="constructionYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ano de construção</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Ex: 2024"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <MoneyInput
                          form={propertyForm}
                          name="iptuValue"
                          label="IPTU"
                          placeholder="R$ 0,00"
                        />

                        {propertyForm.watch('propertyType') === 'apartment' && (
                          <>
                            <FormField
                              control={propertyForm.control}
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

                            <MoneyInput
                              form={propertyForm}
                              name="condominiumFee"
                              label="Taxa condominial"
                              placeholder="R$ 0,00"
                            />
                          </>
                        )}

                        <FormField
                          control={propertyForm.control}
                          name="propertyFeatures"
                          render={({ field }) => (
                            <FormItem className="md:col-span-4">
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

                      <div className="flex justify-between mt-auto">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                          Voltar
                        </Button>
                        <Button type="button" onClick={goToNextTab}>
                          Próximo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="address" className="h-full">
                  <Card className="h-full">
                    <CardContent className="pt-2 h-full flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-4 flex flex-row gap-6">
                          <InputMask
                            control={propertyForm.control}
                            registerName="cep"
                            maskName="zip_code"
                            textlabel="CEP"
                            placeholder="Ex.: 59000000"
                            type="text"
                          />

                          <FormField
                            control={propertyForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Estado</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={propertyForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Cidade</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="md:col-span-4 flex flex-row gap-6">
                          <FormField
                            control={propertyForm.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Logradouro/Rua</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className=" w-full flex gap-6">

                            <FormField
                              control={propertyForm.control}
                              name="neighborhood"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>Bairro</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={propertyForm.control}
                              name="number"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>Número</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <FormField
                          control={propertyForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem className="md:col-span-4">
                              <FormLabel>Link do google maps</FormLabel>
                              <FormControl>
                                <Input placeholder="" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between mt-auto">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                          Voltar
                        </Button>
                        <Button type="button" onClick={goToNextTab}>
                          Próximo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="">
                          <h3 className="text-lg font-medium mb-2">Fotos e Vídeos</h3>
                          <p className="text-muted-foreground mb-4">
                            Adicione fotos e vídeos do imóvel. Recomendamos pelo menos 5 fotos de boa qualidade.
                          </p>

                          <MediaUpload
                            files={mediaFiles}
                            setFiles={setMediaFiles}
                            badgeIndex={property?.image.findIndex(img => img.highlight)}
                            {...(isEditing && !!property?.image.length ? { onDeleteMedia: deletePropertySingleMedia } : {})}
                            {...(isEditing && !!property?.image.length ? { onHighlightMedia: onHighlightMedia } : {})}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between mt-6">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("address")}>
                          Voltar
                        </Button>
                        <Button type="submit" className="min-w-[120px]">
                          <span className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Imóvel
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </form>
        </Form>
      </Tabs>
    </motion.div>
  )
}
