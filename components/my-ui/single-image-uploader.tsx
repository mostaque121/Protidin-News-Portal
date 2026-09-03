// src/components/my-ui/single-image-uploader.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { Crop, ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { useDropzone } from "react-dropzone";

interface SingleImageUploaderProps {
  value?: string | null;
  onChange: (url: string, publicId: string) => void;
  uploadPreset: string;
  aspectRatio?: number;
  error?: string;
}

export function SingleImageUploader({
  value,
  onChange,
  aspectRatio,
  uploadPreset,
  error,
}: SingleImageUploaderProps) {
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cropperRef = useRef<CropperRef>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setCropperImage(reader.result as string);
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    multiple: false,
  });

  const handleCropComplete = async () => {
    const canvas = cropperRef.current?.getCanvas();
    if (!canvas) return;

    setUploading(true);
    setProgress(0);
    setCropperImage(null);

    try {
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject()), "image/jpeg", 0.9),
      );
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });

      const result = await uploadToCloudinary(file, uploadPreset, setProgress);

      onChange(result.secure_url, result.public_id);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    onChange("", "");
  };

  return (
    <div className="w-full">
      {/* 1. Dropzone State */}
      {!value && !uploading && (
        <div
          {...getRootProps()}
          className={`group flex h-52 flex-col items-center justify-center gap-2.5 rounded-none border border-dashed bg-paper p-6 text-center transition-all cursor-pointer ${
            isDragActive
              ? "border-navy bg-navy/5 ring-1 ring-navy/20"
              : "border-border hover:border-navy/60 hover:bg-muted/30"
          }`}
        >
          <input {...getInputProps()} />
          <div
            className={`flex size-12 items-center justify-center rounded-full border transition-colors ${
              isDragActive
                ? "border-navy bg-navy text-white"
                : "border-border bg-muted/40 text-navy group-hover:border-navy/40"
            }`}
          >
            <ImagePlus className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-wider text-navy">
              {isDragActive
                ? "ছবিটি এখানে ছেড়ে দিন"
                : "ছবি ড্রাগ করে আনুন অথবা আপলোড করতে ক্লিক করুন"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              JPEG, PNG, বা WebP &middot; সর্বোচ্চ ৫ মেগাবাইট
            </p>
          </div>
        </div>
      )}

      {/* 2. Cropper Dialog */}
      <Dialog
        open={!!cropperImage}
        onOpenChange={(open) => !open && setCropperImage(null)}
      >
        <DialogContent className=" sm:max-w-2xl   rounded-none ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-navy">
              <Crop className="size-4" />
              ছবি ক্রপ করুন
            </DialogTitle>
          </DialogHeader>

          <div>
            <div className="relative mx-auto  h-80 w-full overflow-hidden rounded-none border border-border">
              {cropperImage && (
                <Cropper
                  src={cropperImage}
                  className="w-auto h-full"
                  stencilProps={aspectRatio ? { aspectRatio } : undefined}
                  backgroundWrapperProps={{
                    className: "!bg-transparent",
                  }}
                  ref={cropperRef}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setCropperImage(null)}
              className="cursor-pointer rounded-none border border-border bg-paper px-5 py-2 text-xs font-bold text-navy transition-colors hover:bg-muted"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleCropComplete}
              className="cursor-pointer rounded-none bg-navy px-6 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              কনফার্ম ও আপলোড
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Uploading State */}
      {uploading && (
        <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-none border border-dashed border-border bg-paper p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy">
            <Loader2 className="size-4 animate-spin text-navy" />
            আপলোড হচ্ছে... {progress}%
          </div>
          <div className="w-full max-w-xs">
            <Progress
              value={progress}
              className="h-1.5 rounded-none bg-muted [&>div]:bg-navy"
            />
          </div>
        </div>
      )}

      {/* 4. Success / Value Preview State */}
      {value && !uploading && (
        <div className="group relative h-52 w-full overflow-hidden rounded-none border border-border bg-paper">
          <Image
            fill
            src={value}
            alt="Uploaded preview"
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 400px"
          />

          {/* Floating Action Button */}
          <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={handleRemove}
              className="flex size-7 cursor-pointer items-center justify-center rounded-none bg-destructive text-white transition-opacity hover:opacity-90"
              title="ছবি মুছুন"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-destructive">{error}</p>
      )}
    </div>
  );
}
