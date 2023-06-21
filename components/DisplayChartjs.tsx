import React, { useEffect, useMemo, useState } from 'react';
import Line from './charts/Line';
import BarChart from './charts/Bar';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  LogarithmicScale
} from "chart.js";
import autocolor from   'chartjs-plugin-autocolors';
import "chartjs-adapter-date-fns";
import { reduceDataPointsPlugin } from './charts/plugins/reduceData';
import { reduceStackedItemsPlugin } from './charts/plugins/reduceStacked';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  autocolor,
  reduceDataPointsPlugin,
  reduceStackedItemsPlugin,
  LogarithmicScale
);
 
const DisplayChartjs: React.FC = (data: any) => {

  const [chartData, setChartData] = useState<any>(null);
  const worker = useMemo(() => new Worker(new URL('./dataworker.ts', import.meta.url)), []);
  useEffect(() => {
    
    if (window.Worker){
        worker.postMessage(data.data.buckets.series);
    }

    return () => {
      worker.terminate();
    };
  }, [data]);

  
  
  useEffect(() => {
    if (window.Worker){
        worker.onmessage = function (event) {
            console.log(" message recieved")  
            const processedData = event.data;
            
            setChartData(JSON.parse(processedData));
          };
    }
    return () => {
        worker.terminate()
    }
  }, [worker])  
  return (
    <>
        <BarChart data={chartData}  />
    </>
  )
} 

export default DisplayChartjs;




