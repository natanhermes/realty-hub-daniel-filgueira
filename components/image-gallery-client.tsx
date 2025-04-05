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
import { CarouselMedia } from "./carousel-images";
import { Property } from "@/types/Property";
import { infrastructure } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { PropertyService } from "@/app/services/propertyService";
import { deletePropertyMedia, uploadPropertyMedia } from "@/lib/s3";
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
  const [imageUrls, setImageUrls] = useState<Array<{ url: string; type: 'video' | 'image' }>>([]);
  const [existingMedia, setExistingMedia] = useState<{ id: string, url: string }[]>(property?.image || []);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);

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

      try {
        const mediaUrls = await Promise.all(
          selectedMedia.map(async (file) => {
            const url = await uploadPropertyMedia(file, responseData.code);
            return {
              url,
              type: ALLOWED_MEDIA_TYPES.video.includes(file.type) ? 'video' : 'image'
            };
          })
        );

        const response = await fetch('/api/property/images', {
          method: 'POST',
          body: JSON.stringify({
            propertyId: responseData.id,
            mediaItems: mediaUrls
          })
        });

        if (!response.ok) {
          throw new Error('Erro ao salvar mídia no banco')
        }

        await revalidatePropertiesAction()
        router.push(`/dashboard/my-properties`)
      } catch (error) {
        console.error("Erro ao realizar o upload da mídia:", error);
        await PropertyService.deleteProperty(responseData.id);
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

      try {
        const newMedia = selectedMedia.filter(
          media => !existingMedia.some(img => img.url === URL.createObjectURL(media))
        )

        const mediaUrls = await Promise.all(
          newMedia.map(async (file) => {
            const url = await uploadPropertyMedia(file, responseData.code);
            return {
              url,
              type: ALLOWED_MEDIA_TYPES.video.includes(file.type) ? 'video' : 'image'
            };
          })
        );

        const response = await fetch('/api/property/images', {
          method: 'POST',
          body: JSON.stringify({
            propertyId: responseData.id,
            mediaItems: mediaUrls
          })
        });

        if (!response.ok) {
          throw new Error('Erro ao salvar mídia no banco.')
        }

        await revalidatePropertiesAction()
        router.push(`/dashboard/my-properties`)
      } catch (error) {
        console.error("Erro ao realizar o upload da mídia:", error);
      }

      return responseData;
    }
  });

  const { mutateAsync: deleteProperty, isPending: isDeletingProperty } = useMutation({
    mutationFn: async ({ code }: { code: string }) => {

      const response = await fetch('/api/property', {
        method: 'DELETE',
        body: JSON.stringify({ code })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.statusText || 'Erro ao deletar imóvel');
      }

      await deletePropertyMedia(code);

      await revalidatePropertiesAction()
      router.push(`/dashboard/my-properties`)
    }
  })

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

  const ALLOWED_MEDIA_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'],
    video: ['video/mp4', 'video/webm', 'video/ogg']
  };
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

  const handleOnChangeMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      toast.warning('Nenhum arquivo selecionado')
      return
    }

    const newFiles = Array.from(files).filter(file => {
      const isValidImage = ALLOWED_MEDIA_TYPES.image.includes(file.type);
      const isValidVideo = ALLOWED_MEDIA_TYPES.video.includes(file.type);

      if (!isValidImage && !isValidVideo) {
        toast.error(`Tipo de arquivo não suportado: ${file.type}`);
        return false;
      }

      if (isValidVideo && file.size > MAX_VIDEO_SIZE) {
        toast.error(`O vídeo é muito grande. Tamanho máximo: 100MB`);
        return false;
      }

      return file.size > 0;
    });

    if (newFiles.length === 0) {
      toast.warning('Nenhum arquivo válido selecionado')
      return
    }

    const newFilesWithoutSelected = newFiles.filter(
      file => !selectedMedia.some(selected => selected.name === file.name)
    );

    const updatedFiles = [...selectedMedia, ...newFilesWithoutSelected];
    console.log('updatedFiles', updatedFiles)
    setSelectedMedia(updatedFiles);
  }

  const onSubmit = async (data: PropertyFormData): Promise<void> => {
    try {
      const formData = new FormData()

      if (isEditing) {
        formData.append('existingMedia', JSON.stringify(existingMedia))
      }

      if (selectedMedia.length === 0) {
        toast.error('Selecione pelo menos uma imagem ou vídeo')
        return
      }

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') return
        if (key === 'existingMedia') return
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
            )
          },
          {
            success: 'Imóvel atualizado com sucesso!',
            loading: 'Atualizando imóvel...',
            error: e => e.message,
          }
        )
      } else {
        toast.promise(
          async () => {
            await createProperty(
              { formData }
            )
          },
          {
            success: 'Imóvel cadastrado com sucesso!',
            loading: 'Cadastrando imóvel...',
            error: e => e.message,
          }
        )
      }
    } catch (error) {
      toast.error('Ocorreu um erro desconhecido. Entre em contato com o administrador.')
    }
  };

  const handleRemoveSelectedMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index))
  }

  const handleChangeStatus = async (code: string, isActive: boolean) => {
    toast.promise(fetch(`/api/property/change-status/${code}`, {
      method: 'PUT',
      body: JSON.stringify({ code })
    }), {
      success: `Imóvel ${isActive ? 'ativado' : 'inativado'} com sucesso!`,
      error: 'Ocorreu um erro ao ativar o imóvel.',
    })

    revalidatePropertiesAction()
    router.push(`/dashboard/my-properties`)
  }

  const handleDeleteProperty = async (code: string) => {
    toast.promise(deleteProperty({ code }), {
      success: 'Imóvel deletado com sucesso!',
      loading: 'Deletando imóvel...',
      error: 'Ocorreu um erro ao deletar o imóvel.',
    })
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

  useEffect(() => {
    const newUrls = selectedMedia.map(file => {
      const isVideo = ALLOWED_MEDIA_TYPES.video.includes(file.type);
      const url = URL.createObjectURL(file);

      // Retorna um objeto com url e tipo
      return {
        url,
        type: isVideo ? 'video' : 'image'
      };
    });

    const allMedia = [
      // Converter mídia existente para o mesmo formato
      ...(existingMedia.map(media => ({
        url: media.url,
        // Determinar o tipo baseado na extensão do arquivo
        type: media.url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image'
      }))),
      ...newUrls
    ];

    const uniqueMedia = allMedia.filter((media, index) =>
      allMedia.findIndex(m => m.url === media.url) === index
    );

    setImageUrls(uniqueMedia.map(media => ({
      url: media.url,
      type: media.type as 'video' | 'image'
    })));

    return () => {
      newUrls.forEach(media => URL.revokeObjectURL(media.url));
    };
  }, [existingMedia, selectedMedia]);

  if (isCreatingProperty || isUpdatingProperty || isDeletingProperty) {
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
                  id="media"
                  className="hidden"
                  onChange={handleOnChangeMedia}
                  multiple
                  accept={[...ALLOWED_MEDIA_TYPES.image, ...ALLOWED_MEDIA_TYPES.video].join(',')}
                />
              </FormControl>
            </FormItem>
            <div className="flex gap-2">
              {isEditing && (
                <>
                  <Button
                    type="button"
                    variant={'destructive'}
                    className={`flex items-center gap-2 `}
                    onClick={() => handleDeleteProperty(property?.code!)}
                  >
                    <Trash size={ICONS_SIZE} />
                    Apagar imóvel
                  </Button>
                  <Button
                    type="button"
                    variant={'default'}
                    className={`flex items-center gap-2 `}
                    onClick={() => handleChangeStatus(property?.code!, property?.active!)}
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
                Adicionar mídia
              </Button>
            </div>
          </div>
          {imageUrls.length > 0 ? (
            <CarouselMedia
              mediaItems={imageUrls}
              handleRemoveSelectedMedia={handleRemoveSelectedMedia}
            />
          ) : (
            <div className="w-full">
              <div className="w-full h-[280px] bg-white rounded-lg flex items-center justify-center">
                <p className="text-sm text-gray-500 italic">Nenhuma mídia selecionada</p>
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
