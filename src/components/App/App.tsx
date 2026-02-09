
import { useEffect, useState } from "react";
import NoteList from "../NoteList/NoteList";
import { fetchNotes } from "../../services/noteService";
import css from "./App.module.css";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Loader from "../Loader/Loader";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleDebouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: search,
      }),
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load notes");
    }
  }, [isError]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value) => {
            handleDebouncedSearch(value);
          }}
        />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPage={data.totalPages}
            page={page}
            onPageSelect={setPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {(isLoading || isFetching) && <Loader />}
      <Toaster />
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && <Modal onCloseModal={closeModal} />}
    </div>
  );
}