'use client'
import './globals.css'
import { ChartType, DisplayTremorChart } from '@/components/DisplayTremorCharts';
import QueryWrapper from '@/components/Query';
import { CustomTable } from '@/components/Table';
import ToggleColorMode from '@/components/ToggleColorMode';
import { ColorModeContext } from '@/context/theme';
import { queryAxiom } from '@/utils/axiomQuery';
import { tremorAdapter } from '@/utils/tremorAdapter';
import { Card, Dropdown, DropdownItem, Text } from '@tremor/react';
import { useState, useContext, useEffect, useMemo } from 'react';
import cookie from "js-cookie";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const { colorMode } = useContext(ColorModeContext);

  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState(ChartType.lineChart);

  const handleFetchData = async (
    query: string,
    startTime: Date,
    endTime: Date
  ) => {
    setLoading(true);
    const data = await queryAxiom(query, startTime, endTime);
    const resp = tremorAdapter(data, startTime, endTime);
    setData(resp);
    setLoading(false);
  };

  useEffect(() => {
    const selected = cookie.get("selectedDate");
    const queryFromCookie = cookie.get("query");
    if (selected !== undefined && queryFromCookie !== undefined) {
      const currSelected = JSON.parse(selected);
      const [start, end] = currSelected.data;
      handleFetchData(queryFromCookie, start, end);
    }
    return () => {};
  }, []);

  const memorizedData = useMemo(() => data, [data]);
  
  return (
    <div className="p-6 ml-4 mr-4 mt-4">
      <ToggleColorMode />
      <QueryWrapper onSubmit={handleFetchData} />
      {loading && <Text>loading.......</Text>}
      <div className="flex flex-col">
        {data?.data?.length > 1 && !loading && (
          <Card
            className={`mt-4 shadow-hidden border-hidden ring-none ${
              colorMode === "dark" && "bg-slate-900 text-white"
            }`}
          >
            <div className="w-[100px] px-2">
              <Dropdown
                className={`mt-2 mb-4 w-0 ${
                  colorMode === "dark" && "bg-slate-900 text-white"
                }`}
                onValueChange={(value) => setChartType(value as ChartType)}
                placeholder="lineChart"
              >
                {Object.values(ChartType).map((item, i) => (
                  <DropdownItem
                    className={`${
                      colorMode === "dark" &&
                      "bg-slate-900 opacity-25 text-white hover:bg-slate-800"
                    }`}
                    key={i}
                    value={item}
                    text={`${item[0].toUpperCase()}${item.substring(1)}`}
                  />
                ))}
              </Dropdown>
            </div>
            <DisplayTremorChart chartType={chartType} chartData={memorizedData} />
          </Card>
        )}
        {data?.rows?.length > 0 && !loading && (
          <div className="mt-2 mb-4">
            <CustomTable rows={data.rows} headers={data.headers} />
          </div>
        )}
      </div>
      {data?.totalsRows?.length > 0 && !loading && (
        <div className="mt-4 mb-4">
          <CustomTable rows={data.totalsRows} headers={data?.totalsHeaders} />
        </div>
      )}
    </div>
  );
}
