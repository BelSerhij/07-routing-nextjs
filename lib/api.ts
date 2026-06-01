import axios from "axios";
import type { Note, NoteTag } from '../types/note';
import type { AxiosResponse } from 'axios';


export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    'Authorization': `Bearer ${myKey}`
  }
});


export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
  totalItems?: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  note: Note;
  message?: string;
}

interface RawFetchNotesResponse {
  notes?: Note[];
  data?: Note[];
  page?: number;
  perPage?: number;
  totalPages?: number;
  total?: number;
  totalItems?: number;
}

const normalizeFetchNotes = (data: RawFetchNotesResponse): FetchNotesResponse => {
  const notes = data.notes ?? data.data ?? [];

  return {
    notes,
    totalPages: data.totalPages ?? 1,
    page: data.page ?? 1,
    perPage: data.perPage ?? 12,
    totalItems: data.totalItems ?? data.total,
  };
};

export const fetchNotes = async ({
  page,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<RawFetchNotesResponse> = await api.get('/notes', {
    params: {
      page,
      perPage,
      ...(search.trim() && { search: search.trim() }),
      ...(tag && { tag }),
    },
  });

  return normalizeFetchNotes(response.data);
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (newTitle: string, newContent: string, newTag: NoteTag): Promise<Note>  => {
  const response = await api.post<Note>('/notes', {
    title: newTitle,
    content: newContent,
    tag: newTag
  });
  return response.data;
};

export const deleteNote = async (
  id: string
): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> =
    await api.delete(`/notes/${id}`);

  return response.data;
};



export const getCategories = async (): Promise<string[]> => {
  return [
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ];
};