import { useQuery } from '@tanstack/react-query'
import { fetchTags } from '@/api/tags'

export const useTags = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 10,
  })
