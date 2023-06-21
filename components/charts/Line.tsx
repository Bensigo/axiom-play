import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

const LineChart: React.FC = ({ data }: any) => {
  // const options: ChartOptions = {
  //   responsive: true,
  //   //    parsing: false,
  //   normalized: true,
  //   scales: {
  //     x: {
  //       offset: false,
  //       type: "timeseries",
  //       time: {
  //         unit: "hour",
  //       },

  //       grid: {
  //         offset: false,
  //         tickColor: "rgba(75, 192,, 192, 1)",
  //         color: "rgba(75, 192,, 192, 1)",
  //       },
  //       ticks: {
  //         stepSize: 3,
  //         font: {
  //           size: 13,
  //         },
  //       },
  //     },
  //     y: {
  //       ticks: {
  //         sampleSize: 20,
  //         font: {
  //           size: 13,
  //         },
  //       },
  //     },
  //   },
  //   animation: false,
  //   plugins: {
  //     autocolors: {
  //       enabled: true,
  //     },
  //     legend: {
  //       display: false,
  //     },
  //     // tooltip: {
  //     //     itemSort: function (itemA, itemB) {
  //     //         // Sort items in descending order based on their value
  //     //         return itemB.parsed.y - itemA.parsed.y;
  //     //       }
  //     // }
  //   },
  //   elements: {
  //     point: {
  //       radius: 0,
  //     },
  //   },
  // };

  // if (!data) {
  //   return null;
  // }

  // return (
  //   <>
  //     <Line options={options} data={data} />
  //   </>
  // );
  return <></>
};

export default LineChart;
