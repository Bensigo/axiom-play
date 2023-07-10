"use client";
import "./globals.css";
import {
  ChartType,
  DisplayTremorChart,
} from "@/components/DisplayTremorCharts";
import QueryWrapper from "@/components/Query";
import { CustomTable } from "@/components/Table";
import ToggleColorMode from "@/components/ToggleColorMode";
import { queryAxiom } from "@/utils/axiomQuery";
import { tremorAdapter } from "@/utils/tremorAdapter";
import {
  Card,
  Select,
  SelectItem
} from "@tremor/react";
import { useState, useEffect, useMemo } from "react";
import cookie from "js-cookie";
import { useTheme } from "next-themes";

function Home() {
  const [data, setData] = useState<any>(null);
  const [queryResp, setQueryResp] = useState<any>(null);
  const { theme, setTheme } = useTheme();


  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<any>();

  const handleFetchData = async (
    query: string,
    startTime: Date,
    endTime: Date
  ) => {
    setLoading(true);
    const data = await queryAxiom(query, startTime, endTime);
    setQueryResp(data)
    const resp = tremorAdapter(data, startTime, endTime);
    setData(resp);
   
  };

  useEffect(() => {
   
      setLoading(false);
    
    
  }, [data])


  useEffect(() => {
    const chartTyp = cookie.get('chartType')
    if (chartTyp){
      setChartType(chartTyp as ChartType)
    }else {
      setChartType(ChartType.lineChart)
    }

  }, [cookie])

  useEffect(() => {
    if (window){
      const selected = cookie.get("selectedDate");
      const queryFromCookie = cookie.get("query");
      
      
      

      if (selected !== undefined && queryFromCookie !== undefined) {
        const currSelected = JSON.parse(selected);
       
        const{from, to, selectValue } = currSelected;
        handleFetchData(queryFromCookie, from, to);
      }
    }
  
    return () => {};
  }, []);

  useEffect(() => {}, [setChartType])

  // const memorizedData = useMemo(() => data, [data]);

  return (
    <div className={`p-6 ml-4 mr-4 mt-4`}>
      <ToggleColorMode />
      <QueryWrapper onSubmit={handleFetchData} />
      {!!loading && <div>loading.......</div>}
      <div className="flex flex-col">
        {!!data && !loading && (
          <>
                  {data.data.length > 1 && <Card
                    className={`mt-4 shadow-hidden border-hidden ring-none ${
                      theme === "light" && "bg-white"
                    }`}
                  >
                    <div className="w-[100px] px-2">
                      <Select
                        className={`mt-2 mb-4 w-0`}
                        onValueChange={(value) => {
                          setChartType(value as ChartType)
                          if (cookie.get('chartType')){
                            cookie.remove('chartType')
                          }
                          cookie.set('chartType', value, { expires: 1 })
                        }
                         
                        }
                        defaultValue={chartType}
                      >
                        {Object.values(ChartType).map((item, i) => (
                          <SelectItem key={i} value={item}>
                            {item[0].toUpperCase()}
                            {item.substring(1)}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <DisplayTremorChart
                      chartType={chartType}
                      chartData={data}
                    />
                  </Card>}

                  <div className="mt-2 mb-4">
                    <CustomTable rows={data.rows} headers={data.headers} />
                  </div>
                  <div className="mt-4 mb-4">
                    <CustomTable
                      rows={data.totalsRows}
                      headers={data?.totalsHeaders}
                    />
                  </div>
            
          </>
        )}
      </div>
    </div>
  );
}

export default Home;