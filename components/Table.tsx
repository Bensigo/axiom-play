import React, { useState, useMemo, useContext, memo } from "react";
import {
  Card,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@tremor/react";
import { Pagination } from "./Pagination";
import { ColorModeContext } from "../context/theme";



const MyTable = ({ headers, rows }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { colorMode } = useContext(ColorModeContext);
  const itemsPerPage = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(rows?.length / itemsPerPage);

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const slicedRows = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return rows?.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, rows]);

  return (
    <Card
      className={`border-0 shadow-inherit ring-inherit ${
        colorMode === "dark" && "bg-slate-900 text-white"
      }`}
    >
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            {headers?.map((header: string, i: number) => (
              <TableHeaderCell key={i}>{header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {slicedRows?.map((row: any, i: number) => (
            <TableRow key={i}>
              {Array.isArray(row)
                ? row.map((cell: any, j: number) => (
                    <TableCell
                      key={j}
                      className="w-40 h-[120px] whitespace-wrap"
                    >
                      {cell}
                    </TableCell>
                  ))
                : Object.values(row).map((cell: any, j: number) => (
                    <TableCell
                      key={j}
                      className="w-40 h-[120px] whitespace-wrap"
                    >
                      {cell}
                    </TableCell>
                  ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPreviousClick={handlePreviousClick}
        onNextClick={handleNextClick}
      />
    </Card>
  );
};
const CustomTable = React.memo(MyTable)
export { CustomTable }