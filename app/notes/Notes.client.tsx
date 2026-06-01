'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './NotesPage.module.css';

import NoteList from '../../components/NoteList/NoteList';
import { fetchNotes } from '../../lib/api';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import SearchBox from '../../components/SearchBox/SearchBox';


interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
}

export default function NotesClient({ initialPage, initialSearch }: NotesClientProps) {
    const router = useRouter();
  const [page, setPage] = useState<number>(initialPage); 
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

const { data, isError } = useQuery({
  queryKey: ['notes', page, searchQuery],
  queryFn: () =>
    fetchNotes({
      page,
      search: searchQuery,
    }),
  placeholderData: (previousData) => previousData,
});

    const updateUrl = (newPage: number, newSearch: string) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', newPage.toString());
    if (newSearch) params.set('search', newSearch);
    
    router.push(`/notes?${params.toString()}`);
  }; 
    
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
      setPage(1);
      updateUrl(1, value)
  }, 500);

   const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };
    
   const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl(newPage, searchQuery);
  };
    
  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} defaultValue={initialSearch} />
        { totalPages > 1 && (<Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />)}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isError && <p>Something went wrong. Please try again later.</p>}
      
      {notes.length > 0 && <NoteList notes={notes} />}
      {!isError && notes.length === 0 && <p>No notes found.</p>}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
