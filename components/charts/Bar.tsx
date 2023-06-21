import React from "react";

import "chartjs-adapter-date-fns";
import { Bar } from "react-chartjs-2";

import { ChartOptions } from "chart.js";




const BarChart: React.FC<{ data: any }> = ({ data }) => {

  const options: ChartOptions = {
    responsive: true,
    normalized: true,
    // scales: {
    //   // x: {
    //   //   offset: false,
    //   //   stacked: true,
    //   //   type: "timeseries",
    //   //   time: {
    //   //     unit: "hour",
    //   //   },

    //   //   grid: {
    //   //     offset: false,
    //   //     tickColor: "rgba(75, 192,, 192, 1)",
    //   //     color: "rgba(75, 192,, 192, 1)",
    //   //   },
    //   //   ticks: {
    //   //     stepSize: 3,
    //   //     font: {
    //   //       size: 13,
    //   //     },
    //   //   },
    //   // },
    //   // y: {
      
    //   //   stacked: true,
    //   //   type: 'linear',
    //   //   ticks: {
    //   //     sampleSize: 10,
    //   //     // callback: function(val, index) {
    //   //     //     // Hide the label of every 2nd dataset
    //   //     //     return index % 2 === 0 ? this.getLabelForValue(val as number) : '';
    //   //     //   },
    //   //     font: {
    //   //       size: 13,
    //   //     },
    //   //   },
    //   // },
    // },
    animation: false,
    plugins: {
      autocolors: {
        enabled: true,
      },   
      legend: {
        display: false,
      },
      // tooltip: {
      //     itemSort: function (itemA, itemB) {
      //         // Sort items in descending order based on their value
      //         return itemB.parsed.y - itemA.parsed.y;
      //       }
      // }
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  if (!data)return null;
  return (
    <>
      <Bar options={options} data={data} />
    </>
  );
};

export default BarChart
