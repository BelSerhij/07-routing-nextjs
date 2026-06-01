import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api'; // Переконайтеся, що цей метод створено у вашому api.ts

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000, // Дані вважаються свіжими 5 секунд
      },
    },
  });

  // Попередньо завантажуємо дані конкретної нотатки на сервері
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    // Передаємо дегідрований стан кешу на клієнт
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
