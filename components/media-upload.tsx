"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, FileImage, Film, AlertCircle, Star, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Badge } from "./ui/badge"

interface MediaUploadProps {
  files: File[]
  setFiles: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  badgeIndex?: number
  acceptedTypes?: string[]
  onDeleteMedia?: (index: number) => Promise<void>
  onHighlightMedia?: (index: number) => Promise<void>
}

export const ALLOWED_MEDIA_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'],
  video: ['video/mp4', 'video/webm', 'video/ogg']
};

export default function MediaUpload({
  files,
  setFiles,
  maxFiles = 40,
  maxSize = 100, // 100MB
  badgeIndex,
  acceptedTypes = [...ALLOWED_MEDIA_TYPES.image, ...ALLOWED_MEDIA_TYPES.video],
  onDeleteMedia,
  onHighlightMedia,
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isValidFile = useCallback(
    (file: File) => {
      if (!acceptedTypes.includes(file.type)) {
        toast.error('Tipo de arquivo não suportado', {
          description: `O arquivo ${file.name} não é suportado. Tipos aceitos: JPG, PNG, WEBP, MP4.`,
          duration: 1000
        })
        return false
      }

      if (file.size > maxSize * 1024 * 1024) {
        toast.error('Arquivo muito grande', {
          description: `O arquivo ${file.name} excede o tamanho máximo de ${maxSize}MB.`,
          duration: 1000
        })
        return false
      }

      return true
    },
    [acceptedTypes, maxSize, toast],
  )

  const addFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return

      if (files.length + newFiles.length > maxFiles) {
        toast.error('Limite de arquivos excedido', {
          description: `Você pode adicionar no máximo ${maxFiles} arquivos.`,
          duration: 1000
        })
        return
      }

      const validFiles = Array.from(newFiles).filter((file) => {
        const isDuplicate = files.some((existingFile) => {

          const validExistsFilename = (existingFile.name === file.name) || (existingFile.name === encodeURIComponent(file.name))

          return (
            validExistsFilename &&
            existingFile.size === file.size &&
            existingFile.type === file.type
          )
        })

        if (isDuplicate) {
          toast.error('Arquivo duplicado', {
            description: `O arquivo ${file.name} já foi adicionado.`,
            duration: 1000
          })
          return false
        }

        return isValidFile(file)
      })

      if (validFiles.length > 0) {
        setFiles([...files, ...validFiles])
        toast.success('Arquivos adicionados', {
          description: `${validFiles.length} arquivo(s) adicionado(s) com sucesso.`,
          duration: 1000
        })
      }
    },
    [files, setFiles, maxFiles, isValidFile, toast],
  )

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const droppedFiles = e.dataTransfer.files
      addFiles(droppedFiles)
    },
    [addFiles],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      addFiles(selectedFiles)
    },
    [addFiles],
  )

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeFile = async (index: number) => {
    if (onDeleteMedia) {
      await onDeleteMedia(index)
      const newFiles = [...files]
      newFiles.splice(index, 1)
      setFiles(newFiles)
    }

    if (!onDeleteMedia) {
      const newFiles = [...files]
      newFiles.splice(index, 1)
      setFiles(newFiles)

      toast('Arquivo removido', {
        description: "O arquivo foi removido com sucesso.",
        duration: 1000
      })
    }
  }

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file)
    }
    return null
  }

  const isImage = (file: File) => file.type.startsWith("image/")

  const isVideo = (file: File) => file.type.startsWith("video/")

  const handleBadgeIndex = badgeIndex !== -1 ? badgeIndex : 0

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
          ? "border-primary bg-primary/5 text-primary"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept={acceptedTypes.join(",")}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          </motion.div>
          <div>
            <p className="text-lg font-medium">
              {isDragging ? "Solte os arquivos aqui" : "Arraste e solte arquivos aqui"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">ou clique para selecionar arquivos</p>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Formatos aceitos: JPG, PNG, WEBP, MP4</p>
            <p>Tamanho máximo: {maxSize}MB por arquivo</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {files.length} de {maxFiles} arquivos
          </p>
          <Button variant="outline" size="sm" onClick={openFileSelector}>
            Adicionar mais
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 ">
        <AnimatePresence>
          {files.map((file, index) => (
            <motion.div
              key={`${file.name}-${file.lastModified}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted/50 relative">
                {isImage(file) && getFilePreview(file) ? (
                  <Image
                    src={getFilePreview(file) || ""}
                    alt={file.name}
                    fill
                    className="object-cover"
                    onLoad={() => URL.revokeObjectURL(getFilePreview(file) || "")}
                  />
                ) : isVideo(file) ? (
                  <div className="w-full h-full flex items-center justify-center bg-black/5">
                    <Film className="h-10 w-10 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/5">
                    <FileImage className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}

                {index === handleBadgeIndex && <Badge className="absolute top-2 left-1">Foto de capa</Badge>}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white">
                  <p className="text-xs truncate w-full text-center">{file.name}</p>
                  <p className="text-xs opacity-70">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type?.split("/")[1]?.toUpperCase()}
                  </p>
                </div>

                <div className="absolute inset-0 pb-8 flex items-end justify-center gap-6">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {!!onHighlightMedia && (
                    <Button
                      size="icon"
                      className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-500 hover:bg-yellow-500/90"
                      onClick={(e) => {
                        e.stopPropagation()
                        onHighlightMedia(index)
                      }}
                    >
                      <Flame className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {files.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Nenhum arquivo selecionado</p>
          <p className="text-sm">Adicione fotos e vídeos para continuar</p>
        </div>
      )}
    </div>
  )
}
