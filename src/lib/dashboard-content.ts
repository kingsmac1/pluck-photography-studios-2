import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContentFn, saveContentFn } from "@/lib/dashboard-api";
import type { ContentMap, ContentSection } from "@/content/types";

export function contentQueryKey(section: ContentSection) {
  return ["dashboard-content", section] as const;
}

/** Loads and saves one content section, keeping the query cache and the GitHub commit in sync. */
export function useContentSection<S extends ContentSection>(section: S) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: contentQueryKey(section),
    queryFn: async () => (await getContentFn({ data: { section } })) as ContentMap[S],
  });

  const mutation = useMutation({
    mutationFn: async (payload: ContentMap[S]) =>
      (await saveContentFn({
        data: { section, payload, message: `Dashboard: update ${section}` },
      })) as ContentMap[S],
    onSuccess: (data) => {
      queryClient.setQueryData(contentQueryKey(section), data);
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    save: mutation.mutateAsync,
    saving: mutation.isPending,
  };
}
