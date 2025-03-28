"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ImageViewerProps {
  images: string[];
  imageLabel: string;
}

/* The `export function ImageViewer({ images, imageLabel }: ImageViewerProps)` is a React functional
component that displays a grid of images with the ability to open a dialog for a selected image.
Here's a breakdown of what the component does: */
export function ImageViewer({ images, imageLabel }: ImageViewerProps) {
  const [openImageIndex, setOpenImageIndex] = useState<number | null>(null);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2">{imageLabel}</h3>
      <div className="grid grid-cols-3 gap-2">
        {images.map((url, index) => (
          <button
            key={index}
            onClick={() => setOpenImageIndex(index)}
            className="block relative aspect-square rounded-md overflow-hidden border hover:opacity-90 transition-opacity"
          >
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog
        open={openImageIndex !== null}
        onOpenChange={(open) => !open && setOpenImageIndex(null)}
      >
        <DialogContent className="max-w-4xl p-2 bg-transparent border-0">
          <DialogClose className="absolute right-2 top-2 p-2 rounded-full bg-black/50 text-white z-10 hover:bg-black/70 transition-colors">
            <X className="h-4 w-4" />
          </DialogClose>
          {openImageIndex !== null && (
            <div className="relative w-full aspect-auto max-h-[85vh] flex items-center justify-center">
              <Image
                src={images[openImageIndex]}
                alt={`Image ${openImageIndex + 1}`}
                className="object-contain max-h-[85vh] max-w-full rounded-md"
                width={1200}
                height={800}
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
