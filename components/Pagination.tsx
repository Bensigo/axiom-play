import { Button } from "@tremor/react"

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousClick,
  onNextClick,
}: any) => {
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const handlePreviousClick = () => {
    onPreviousClick();
  };

  const handleNextClick = () => {
    onNextClick();
  };

  return (
    <div className=" flex  gap-2 mt-5">
      <Button
        className="mr-1"
        onClick={handlePreviousClick}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Button
        className="ml-1"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};
