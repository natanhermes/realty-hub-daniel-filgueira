import { toast } from 'sonner'
import { upload } from '@vercel/blob/client'
import { ALLOWED_MEDIA_TYPES } from '@/components/media-upload'
import { useState } from 'react'

type UploadMediaOptions = {
  mediaFiles: File[]
  responseData: {
    id: string
    code: string
  }
}

export function useUploadMedia() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const uploadMedia = async ({ mediaFiles, responseData }: UploadMediaOptions) => {
    const uploadPromise = (async () => {
      try {
        setIsLoading(true)
        const mediaUrls = await Promise.all(
          mediaFiles.map(async (file) => {
            const blobObj = await upload(`projects/${responseData.code}/${file.name}`, file, {
              access: 'public',
              handleUploadUrl: '/api/upload/vercel-blob',
            })

            return {
              url: blobObj.url,
              type: ALLOWED_MEDIA_TYPES.video.includes(file.type) ? 'video' : 'image',
            }
          })
        )

        const response = await fetch('/api/property/images', {
          method: 'POST',
          body: JSON.stringify({
            propertyId: responseData.id,
            mediaItems: mediaUrls,
          }),
        })

        if (!response.ok) {
          throw new Error('Erro ao salvar mídia no banco')
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao realizar o upload da mídia:', error)

        await fetch(`/api/property`, {
          method: 'DELETE',
          body: JSON.stringify({ code: responseData.code }),
        })

        throw error
      }
    })()

    toast.promise(
      uploadPromise,
      {
        loading: 'Realizando upload dos arquivos...',
        success: 'Upload concluído.',
        error: (e) => e.message || 'Erro ao fazer upload',
      }
    )

    return uploadPromise
  }

  return { uploadMedia, isUploading: isLoading }
}
