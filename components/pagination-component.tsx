import { useEffect } from "react";
import { useState } from "react";
import { Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "./ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationListProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationComponent({ totalPages, currentPage, onPageChange }: PaginationListProps) {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  return (
    <Pagination>
      <PaginationPrevious onClick={() => onPageChange(page - 1)}>
        <ChevronLeft />
      </PaginationPrevious>

      {Array.from({ length: totalPages }, (_, i) => (
        <PaginationLink key={i + 1} onClick={() => onPageChange(i + 1)}>
          {i + 1}
        </PaginationLink>
      ))}

      <PaginationNext onClick={() => onPageChange(page + 1)}>
        <ChevronRight />
      </PaginationNext>
    </Pagination>
  )
}
