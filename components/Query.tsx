import React, { useContext, useEffect, useState } from "react";
import TextArea from "./TextArea";
import { subHours, isSameDay } from "date-fns";
import cookie from "js-cookie";
import { Button, DateRangePicker } from "@tremor/react";
import { useTheme } from "next-themes";


const QueryWrapper = ({
  onSubmit,
}: {
  onSubmit: (query: string, s: any, e: any) => void;
}) => {
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<any>({
   from:  subHours(new Date(), 24),
    to: new Date(),
    selectValue: "tdy"
});
  const { theme } = useTheme()
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
      setSelectedDate(selected);
    }
  }, []);

  const handleSelectedDateRage = (input: any) => {
    console.log({ input })
    let {from, to, selectValue } = input;
    const sameDay = isSameDay(from, to);
    if (sameDay) {
      from = subHours(new Date(), 24);
      setSelectedDate({ from, to, selectValue});
    } else {
      setSelectedDate({ from, to, selectValue});
    }
  };


  const handleSubmit = () => {
    const queryFromCookie = cookie.get("query");
    const {from, to, selectValue } = selectedDate;
    if (queryFromCookie) {
      cookie.remove("query");
      cookie.remove("selectedDate");
    }
    cookie.set("query", query, { expires: 1 });
    const selected = JSON.stringify({ from, to, selectValue  });
    cookie.set("selectedDate", selected);
    onSubmit(query, from, to);
  };

  return (
    <div
      className={`flex flex-col shadow-md rounded-md ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-900"
      } p-6 gap-2  w-auto mt-2`}
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
        <div style={{ minWidth: '150px', width: '100%'}}>
        <DateRangePicker
          className=" w-full "
          value={selectedDate}
          defaultValue={selectedDate}
          onValueChange={handleSelectedDateRage}
  
        />
        </div>
      </div>
    </div>
  );
};
export default QueryWrapper;
