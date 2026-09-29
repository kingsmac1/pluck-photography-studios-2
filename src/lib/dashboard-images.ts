import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteImageFn, listImagesFn, uploadImageFn } from "@/lib/dashboard-api";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error as Error);
    reader.readAsDataURL(file);
  });
}

export function imagesQueryKey(kind: "gallery" | "hero", slug?: string) {
  return ["dashboard-images", kind, slug ?? null] as const;
}

/** Live image listing + upload/delete for one gallery folder (or the hero slide folder). */
export function useGalleryImages(kind: "gallery" | "hero", slug?: string) {
  const queryClient = useQueryClient();
  const key = imagesQueryKey(kind, slug);

  const query = useQuery({
    queryKey: key,
    queryFn: () => listImagesFn({ data: { kind, slug } }),
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const dataBase64 = await fileToDataUrl(file);
      return uploadImageFn({
        data: { kind, slug, originalName: file.name, mimeType: file.type, dataBase64 },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: (filename: string) => deleteImageFn({ data: { kind, slug, filename } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  return {
    images: query.data ?? [],
    isLoading: query.isLoading,
    upload: upload.mutateAsync,
    uploading: upload.isPending,
    remove: remove.mutateAsync,
    removing: remove.isPending,
  };
}
