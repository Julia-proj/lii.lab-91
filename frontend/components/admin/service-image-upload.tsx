'use client'

import { useRef, useState } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'

const resolveImg = (img?: string) => {
  const i = img?.trim()
  if (!i || i === 'null' || i === 'undefined') return ''
  return i.startsWith('/') || i.startsWith('http') ? i : `/images/services/${i}`
}

interface ServiceImageUploadProps {
  image: string
  uploading: boolean
  onUpload: (file: File) => void
  onRemove: () => void
}

export function ServiceImageUpload({ image, uploading, onUpload, onRemove }: ServiceImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [imgError, setImgError] = useState(false)
  
  const imgSrc = resolveImg(image)

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Foto del servicio</label>
      <div className="flex items-center gap-3">
        {imgSrc && !imgError ? (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-white/10 shrink-0">
            <img src={imgSrc} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
            <button onClick={onRemove}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-neutral-200 dark:border-white/10 flex items-center justify-center shrink-0 bg-neutral-50 dark:bg-white/3">
            {uploading
              ? <Loader2 className="w-5 h-5 text-neutral-300 animate-spin" />
              : <ImagePlus className="w-5 h-5 text-neutral-300" />
            }
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f) }}
          />
          <button
            onClick={(e) => { e.preventDefault(); fileRef.current?.click() }}
            disabled={uploading}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-plum hover:text-plum transition-colors disabled:opacity-50 flex items-center gap-1.5"  
          >
            <ImagePlus className="w-3.5 h-3.5" />
            {uploading ? 'Subiendo...' : imgSrc ? 'Cambiar foto' : 'Subir foto'} 
          </button>
          <p className="text-[11px] text-neutral-400">JPG, PNG, WebP · max 5 MB</p>
        </div>
      </div>
    </div>
  )
}
