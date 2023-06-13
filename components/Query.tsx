import React, { useContext, useEffect, useState } from "react";
import TextArea from "./TextArea";
import { subHours, isSameDay } from "date-fns";
import cookie from "js-cookie";
import { Button, DateRangePicker } from "@tremor/react";
import { ColorModeContext } from "../context/theme";


const QueryWrapper = ({
  onSubmit,
}: {
  onSubmit: (query: string, s: any, e: any) => void;
}) => {
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<[Date, Date, string]>([
    subHours(new Date(), 24),
    new Date(),
    "tdy",
  ]);
  const { colorMode } = useContext(ColorModeContext);
  const handleChange = (e: any) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const queryFromCookie = cookie.get("query");
    const currSelected = cookie.get("selectedDate");

    if (queryFromCookie) {
      setQuery(queryFromCookie);
    }
    if (currSelected) {
      const selected = JSON.parse(currSelected as string);
      if (selected.data) {
        setSelectedDate(selected.data);
      }
    }
  }, []);

  const handleSelectedDateRage = (input: any[]) => {
    let [start, end, format] = input;
    const sameDay = isSameDay(start, end);
    if (sameDay) {
      start = subHours(new Date(), 24);
      setSelectedDate([start, end, format]);
    } else {
      setSelectedDate([start, end, format]);
    }
  };

  const handleSubmit = () => {
    const queryFromCookie = cookie.get("query");
    const [start, end, format] = selectedDate;
    if (queryFromCookie) {
      cookie.remove("query");
      cookie.remove("selectedDate");
    }
    cookie.set("query", query, { expires: 1 });
    const selected = JSON.stringify({ data: [start, end, format] });
    cookie.set("selectedDate", selected);
    onSubmit(query, start, end);
  };

  return (
    <div
      className={`flex flex-col shadow-md rounded-md ${
        colorMode === "dark" ? "bg-gray-800" : "bg-gray-900"
      } p-6 gap-2  w-auto`}
    >
      <TextArea
        placeholder="Enter your query......"
        value={query}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <div className="flex w-fit mt-2 mb-2">
        <Button
          onClick={handleSubmit}
          className="mr-2 bg-green-700 hover:bg-green-400 focus:bg-green-400 ring-inherit border-0"
        >
          Query
        </Button>
        <DateRangePicker
          className="w-fit"
          value={selectedDate}
          defaultValue={selectedDate}
          onValueChange={handleSelectedDateRage}
        />
      </div>
    </div>
  );
};
export default QueryWrapper;
