'use client'
import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ImageUp, ArrowLeft, Trash, CornerLeftUp, Star, StarOff, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { PropertyFormClient } from "./property-form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormItem } from "./ui/form";
import { toast } from "sonner"
import { CarouselImages } from "./carousel-images";
import { Property } from "@/types/Property";
import { infrastructure } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { PropertyService } from "@/app/services/propertyService";
import { uploadPropertyImage } from "@/lib/s3";
import { revalidatePropertiesAction } from "@/app/actions/revalidatePropertiesAction";

const ICONS_SIZE = 16

export const propertySchema = z.object({
  images: z.custom<FileList>().optional(),
  title: z.string().min(10, "O título está muito curto"),
  purpose: z.enum(["sale", "rent", "sale-rent", "daily"], {
    required_error: "Selecione o tipo de contrato",
    invalid_type_error: "Selecione o tipo de contrato",
    message: "Selecione o tipo de contrato"
  }),
  salePrice: z.number().optional(),
  rentalPrice: z.number().optional(),
  dailyPrice: z.number().optional(),
  code: z.string().min(1, "O código é obrigatório"),
  propertyType: z.enum(["apartment", "house", "commercial"], {
    required_error: "Selecione o tipo do imóvel",
    invalid_type_error: "Selecione o tipo do imóvel",
    message: "Selecione o tipo do imóvel"
  }),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  location: z.string().url("Digite uma URL válida").optional(),
  description: z.string().min(10, "A descrição deve ter no mínimo 10 caracteres"),
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

export function ImageGalleryClient({ property, isEditing = false }: { property?: Property, isEditing?: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string, url: string }[]>(property?.image || []);

  const { mutateAsync: createProperty, isPending: isCreatingProperty } = useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      const response = await fetch('/api/property', {
        method: 'POST',
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.statusText || 'Erro ao criar imóvel');
      }

      return responseData;
    }
  });

  const { mutateAsync: updateProperty, isPending: isUpdatingProperty } = useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      const response = await fetch(`/api/property/${property?.code}`, {
        method: 'PUT',
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.statusText || 'Erro ao editar imóvel');
      }

      return responseData;
    }
  });

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || '',
      code: property?.code || '',
      propertyType: property?.propertyType as "apartment" | "house" | "commercial" || '',
      purpose: property?.purpose as "sale" | "rent" | "sale-rent" | "daily" || '',
      neighborhood: property?.neighborhood || '',
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
        property.infrastructure?.[key as keyof infrastructure] === true
      ) : []
    }
  });

  const onSubmit = async (data: PropertyFormData): Promise<void> => {
    try {
      const formData = new FormData()

      if (isEditing) {
        formData.append('existingImages', JSON.stringify(existingImages))
      }

      if (selectedImages.length === 0) {
        toast.error('Selecione pelo menos uma imagem')
        return
      }

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') return
        if (key === 'existingImages') return
        if (value === undefined || value === null) return
        if (key === "propertyFeatures" && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      })

      if (isEditing) {
        formData.append('id', property?.id ?? '')
        toast.promise(
          async () => {
            await updateProperty(
              { formData },
              {
                onSuccess: async (propertyUpdated) => {
                  try {
                    const newImages = selectedImages.filter(image => !existingImages.some(img => img.url === URL.createObjectURL(image)))
                    const imageUrls = await Promise.all(
                      newImages.map(async (image) => await uploadPropertyImage(image, propertyUpdated.code))
                    )

                    const response = await fetch('/api/property/images', {
                      method: 'POST',
                      body: JSON.stringify({
                        propertyId: propertyUpdated.id,
                        imageUrls: imageUrls.filter(url => !existingImages.some(img => img.url === url))
                      })
                    })

                    if (!response.ok) {
                      throw new Error('Erro ao salvar imagens no banco.')
                    }

                    revalidatePropertiesAction()
                    router.push(`/dashboard/my-properties`)
                  } catch (imageError) {
                    console.error("Erro ao realizar o upload das imagens:", imageError);
                  }
                }
              }
            )
          },
          {
            success: 'Imóvel atualizado com sucesso!',
            error: e => e.message,
          }
        )
      } else {
        toast.promise(
          async () => {
            await createProperty(
              { formData },
              {
                onSuccess: async (propertyCreated) => {
                  try {
                    const imageUrls = await Promise.all(
                      selectedImages.map(async (image) => await uploadPropertyImage(image, propertyCreated.code))
                    )

                    const response = await fetch('/api/property/images', {
                      method: 'POST',
                      body: JSON.stringify({
                        propertyId: propertyCreated.id,
                        imageUrls
                      })
                    })

                    if (!response.ok) {
                      throw new Error('Erro ao salvar imagens no banco')
                    }

                    revalidatePropertiesAction()
                    router.push(`/dashboard/my-properties`)
                  } catch (imageError) {
                    console.error("Erro ao realizar o upload das imagens:", imageError);
                    await PropertyService.deleteProperty(propertyCreated.id);
                  }
                }
              }
            )
          },
          {
            success: 'Imóvel cadastrado com sucesso!',
            error: e => e.message,
          }
        )
      }
    } catch (error) {
      toast.error('Ocorreu um erro desconhecido. Entre em contato com o administrador.')
    }
  };

  const handleRemoveSelectedImage = (index: number) => {
    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index))
    } else {
      const newIndex = index - existingImages.length
      const updatedImages = Array.from(form.watch("images")!)
        .filter((_, i) => i !== newIndex);
      const dt = new DataTransfer();
      updatedImages.forEach(file => dt.items.add(file));
      form.setValue("images", dt.files);
    }
  }

  const handleChangeStatus = async (code: string) => {
    toast.promise(fetch(`/api/property/change-status/${code}`, {
      method: 'PUT',
      body: JSON.stringify({ code })
    }), {
      success: 'Imóvel ativado com sucesso!',
      error: 'Ocorreu um erro ao ativar o imóvel.',
    })

    revalidatePropertiesAction()
    router.push(`/dashboard/my-properties`)
  }

  const handleChangeHighlight = async (code: string) => {
    toast.promise(fetch(`/api/property/change-highlight/${code}`, {
      method: 'PUT',
      body: JSON.stringify({ code })
    }), {
      success: `Imóvel ${property?.highlight ? 'removido' : 'destacado'} com sucesso!`,
      error: 'Ocorreu um erro ao destacar o imóvel.',
    })

    revalidatePropertiesAction()
    router.push(`/dashboard/my-properties`)
  }

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const handleOnChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      toast.warning('Nenhuma imagem selecionada')
      return
    }

    const newImages = Array.from(files).filter(file => file.size > 0)
    if (newImages.length === 0) {
      toast.warning('Nenhuma imagem selecionada')
      return
    }

    const newImagesWithoutFileSelected = newImages.filter(image => !selectedImages.some(selectedImage => selectedImage.name === image.name))

    const updatedFiles = [...selectedImages, ...newImagesWithoutFileSelected];
    setSelectedImages(updatedFiles)

    // const dt = new DataTransfer();
    // updatedFiles.forEach(file => dt.items.add(file));
    // form.setValue("images", dt.files);
  }

  useEffect(() => {
    const newUrls = selectedImages.map(image => URL.createObjectURL(image));

    const allImages = [...(existingImages.map(img => img.url)), ...newUrls];

    const uniqueImages = allImages.filter((url, index) => allImages.indexOf(url) === index);

    setImageUrls(uniqueImages);

    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [existingImages, selectedImages]);

  if (isCreatingProperty || isUpdatingProperty) {
    return <div className="flex items-center justify-center h-screen w-full">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid items-start gap-4 w-full">
        <div className="flex w-full flex-col gap-2 items-end">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center "
              onClick={() => router.back()}
            >
              <ArrowLeft size={ICONS_SIZE} />
              Voltar
            </Button>

            <FormItem>
              <FormControl>
                <Input
                  ref={fileInputRef}
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleOnChangeImages}
                  multiple
                  accept="image/jpeg,image/png,image/jpg,image/heic"
                />
              </FormControl>
            </FormItem>
            <div className="flex gap-2">
              {isEditing && (
                <>
                  <Button
                    type="button"
                    variant={property?.active ? "destructive" : "default"}
                    className={`flex items-center gap-2 `}
                    onClick={() => handleChangeStatus(property?.code!)}
                  >
                    {property?.active ? (
                      <>
                        <Trash size={ICONS_SIZE} />
                        Inativar
                      </>
                    ) : (
                      <>
                        <CornerLeftUp size={ICONS_SIZE} />
                        Ativar
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant={property?.highlight ? "default" : "outline"}
                    className={`flex items-center gap-2 ${!property?.highlight ? 'bg-yellow-400 hover:bg-yellow-500' : ''}`}
                    onClick={() => handleChangeHighlight(property?.code!)}
                  >
                    {property?.highlight ? (
                      <>
                        <StarOff size={ICONS_SIZE} />
                        Remover destaque
                      </>
                    ) : (
                      <>
                        <Star size={ICONS_SIZE} />
                        Destacar
                      </>
                    )}
                  </Button>
                </>
              )}

              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageUp size={ICONS_SIZE} />
                Adicionar imagem
              </Button>
            </div>
          </div>
          {imageUrls.length > 0 ? (
            <CarouselImages
              imageUrls={imageUrls}
              handleRemoveSelectedImage={handleRemoveSelectedImage}
            />
          ) : (
            <div className="w-full">
              <div className="w-full h-[280px] bg-white rounded-lg flex items-center justify-center">
                <p className="text-sm text-gray-500 italic">Nenhuma imagem selecionada</p>
              </div>

              <p
                className="text-xs ml-1 italic font-medium text-destructive"
              >
                {form.formState.errors.images?.message}
              </p>
            </div>
          )}
        </div>
        <PropertyFormClient form={form} isEditing={isEditing} />
      </form>
    </Form>
  )
}
