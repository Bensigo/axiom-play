"use client";
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
  Button,
  Card,
  Flex,
  Select,
  SelectItem
} from "@tremor/react";
import { useState, useEffect, useMemo } from "react";
import cookie from "js-cookie";
import { useTheme } from "next-themes";
import {  useErrorBoundary, withErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: any) {
  const { resetBoundary } = useErrorBoundary();


  const restApp = () => {
    cookie.remove('chartType')
    cookie.remove('selectedDate')
    cookie.remove('query')
    resetBoundary()
  }

  return (
    <Flex style={{ height: '100vh'}} alignItems="center" justifyContent="center">
      <div>
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <Button className="primary" onClick={restApp}>Try again</Button>
      </div>
    </Flex>
  );
}

function HomeWrapper() {
  const [data, setData] = useState<any>(null);
  const [queryResp, setQueryResp] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const { showBoundary } = useErrorBoundary();


  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<any>();

  const handleFetchData = async (
    query: string,
    startTime: Date,
    endTime: Date
  ) => {
    setLoading(true);
    const data = await queryAxiom(query, startTime, endTime, showBoundary);
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
    <div className={`p-2 ml-2 mr-2  md:p-6 md:ml-4 md:mr-4 mt-4`}>
      <ToggleColorMode />
      <QueryWrapper onSubmit={handleFetchData} />
      {!!loading && <div>loading.......</div>}
      <div className="flex flex-col">
        {!!data && !loading && (
          <>
                  {!!data.data?.length && <Card
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
const logError = (error: Error, info: { componentStack: string }) => {
  console.log({ error })
};

export default withErrorBoundary(HomeWrapper, {
  FallbackComponent: ErrorFallback,
  onError: logError
});