"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X as XIcon } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  imageIndex: number;
}

export function ImageModal({ imageUrl, imageIndex }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="block relative aspect-square rounded-md overflow-hidden border cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md"
      >
        <Image
          src={imageUrl}
          alt={`Image ${imageIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-black/95 border-none">
          <DialogTitle className="sr-only">
            Visualização de imagem {imageIndex + 1}
          </DialogTitle>

          <div className="relative h-full w-full flex items-center justify-center">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-50"
              aria-label="Fechar visualização"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <div className="relative h-full w-full flex items-center justify-center p-4">
              <div className="relative max-h-full max-w-full">
                <Image
                  src={imageUrl}
                  alt={`Imagem ${imageIndex + 1} em tamanho completo`}
                  width={1200}
                  height={900}
                  className="object-contain max-h-[80vh]"
                  priority
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
