// dataWorker.ts
/// <reference lib="webworker" />

import { generateChartDataV5, generateChartDatav4 } from "@/utils/chartjsAdpater";
import { tremorAdapter } from "@/utils/tremorAdapter";

interface Group {
    id: number;
    group: Record<string, string>;
    aggregations: {
      op: string;
      value: number;
    }[];
  }
  
  interface Series {
    startTime: string;
    endTime: string;
    groups: Group[];
  }
  
  interface ProcessedData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  }
  
self.onmessage = function (event: MessageEvent<any>) {
    console.log('message sent', event.data)
    const data =JSON.parse(event.data);
  

  //   const processedData = generateChartDataV5(event.data,20);
  //   const processData2 = generateChartDatav4(event.data)
  //  console.log({ processData2 })
  //  console.log({ t: processData2[0]})
  if (data){
    const processedData = tremorAdapter(data.series, data.start, data.end)
    self.postMessage(JSON.stringify(processedData));
  }
  
  
    // Send the processed data back to the main thread
    
  };
  
  function generateRandomColor(): string {
    // Generate a random color logic here
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  

  export {}