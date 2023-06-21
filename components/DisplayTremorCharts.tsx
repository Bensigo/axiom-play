/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import {
  LineChart,
  AreaChart,
  BarList,
  BarChart,
  DonutChart,
} from "@tremor/react";
import { getRandomColors } from "@/utils/colorGenerator";
import { SeriesData } from "@/utils/tremorAdapter";

export enum ChartType {
  lineChart = "lineChart",
  areaChart = "areaChart",
  barChart = "barChart",
  DonutChart = "donutChart",
  barList = "barList",
}

function getCategoriesFromData(data: any[], maxCategories: number) {
  const temCat: any = {};

  for (const item of data) {
    for (const key in item) {
      if (item.hasOwnProperty(key) && key !== "time") {
        temCat[key] = (temCat[key] || 0) + item[key];
      }
    }
  }

  const sortedKeys = Object.keys(temCat).sort((a, b) => temCat[b] - temCat[a]);

  return sortedKeys.slice(0, maxCategories);
}

export const DisplayTremorChart = React.memo(
  ({ chartType, chartData }: { chartType: ChartType; chartData: any }) => {

    
    const processedData = useMemo(() => {
      if (chartData.data.length === 0) {
        return [];
      }

      if (chartType === ChartType.barList) {
        const barListData = chartData.data.reduce((result: any, data: any) => {
          for (let key in data) {
            if (key === "time") {
              continue;
            }
            const value = data[key];
            const existingItem = result.find((item: any) => item.name === key);
            if (existingItem) {
              existingItem.value += value;
            } else {
              result.push({ name: key, value });
            }
          }
          return result;
        }, []);
        const sortedData = barListData.sort(
          (a: any, b: any) => b.value - a.value
        );
        const top10Data = sortedData.slice(0, 10);
        return top10Data;
      }

      return chartData.data;
    }, [chartData.data, chartType]);

    const top20Categories = getCategoriesFromData(chartData.data, 20);

    const chartProps: any = {
      className: "mt-6",
      data: processedData,
      showAnimation: false,
      showLegend: false,
      index: chartData.index,
      autoMinValue: true,
      categories: top20Categories.slice(0, 20),
      colors: getRandomColors(),
    };

    if (!chartData){
      return;
     }

    const chartComponents: { [key in ChartType]: any } = {
      lineChart: <LineChart className="mt-6" yAxisWidth={42} {...chartProps} />,
      areaChart: <AreaChart className="mt-6" {...chartProps} />,
      barList: <BarList className="mt-2" data={processedData} />,
      barChart: (
        <BarChart
          className="mt-6"
          {...chartProps}
          categories={top20Categories.slice(10)}
        />
      ),
      donutChart: (
        <DonutChart
          className="mt-4"
          data={processedData}
          index={chartData.index}
          category="count_"
          colors={[
            "slate",
            "violet",
            "indigo",
            "rose",
            "cyan",
            "amber",
            "yellow",
            "lime",
          ]}
        />
      ),
    };

    const chartComponent = chartComponents[chartType] || null;

    return <div>{chartComponent}</div>;
  }
);






