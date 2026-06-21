import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const OrderPagination: React.FC<Props> = ({ currentPage, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <Button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="cursor-pointer"
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="cursor-pointer"
      >
        Next
      </Button>
    </div>
  );
};

export default OrderPagination;
