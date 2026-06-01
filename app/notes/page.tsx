import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string; id: string }>;
}

export default async function NotesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const searchQuery = params.search || '';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000, 
      },
    },
  });

await queryClient.prefetchQuery({
  queryKey: ['notes', page, searchQuery],
  queryFn: () =>
    fetchNotes({
      page,
      search: searchQuery,
    }),
});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={page} initialSearch={searchQuery} />
    </HydrationBoundary>
  );
}
