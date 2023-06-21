import { group } from "console";
import { queryAxiom } from "./axiomQuery";
import { generateRandomColor, getRandomColors } from "./colorGenerator";
import { SeriesData } from "./tremorAdapter";

export function chartjsAdpater(series: SeriesData[]) {
  const labels = new Set();
  const data: Record<string, any> = {};
  for (const item of series) {
    const startTime = item.startTime;
    const { groups } = item || {};
    for (const group of groups) {
      if (group.group) {
        const label = Object.values(group.group).join(",");
        const currData = group.aggregations[0].value;
        if (data[label]) {
          data[label].data.push(currData);
        } else {
          data[label] = {
            label,
            data: [{ timw: startTime, value: currData }],
            backgroundColor: getRandomColors(),
          };
          labels.add(label);
        }
      }
    }
  }
  return { data, labels: [...labels] };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

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

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export function generateChartData(series: Series[]): ChartData {
  const datasets: { label: string; data: number[] }[] = [];

  const groupByValue: { label: string; value: number }[] = [];
  const labels = series.map((s) => s.startTime);
  for (const item of series) {
    for (const group of item.groups) {
      const label = Object.values(group.group).join(",");
      const value = group.aggregations[0].value;
      groupByValue.push({ label, value });
    }
  }
  // get dataset
  const dict: Record<string, number[]> = {};
  for (const item of groupByValue) {
    if (dict[item.label]) {
      dict[item.label].push(item.value);
    } else {
      dict[item.label] = [item.value];
    }
  }
  console.log({ dict });

  const chartData: ChartData = {
    labels,
    datasets,
  };

  return chartData;
}

// export function generateChartDataV2(series: Series[]){
//   const labels: string[] = []
//   const currentSeries = series.map((item) => {
//     const group = item.groups.map((group) => {
//       const label = Object.values(group.group).join(',');
//       const value = group.aggregations[0].value;
//       return { label, value }
//     })
//     return {
//       time: item.startTime,
//       group,
//     }
//   });

//   const grouped = currentSeries.map((item) => {
//      labels.push(item.time)
//      const t = item.group
//      return {
//       [item.time]: t
//      }
//   });
//   console.log({ grouped, labels })
//   // not i need to group  by of label
//   // e.g we will have { label: '/api', dataset: [12, 34, 56, 66 ....]}
// }

// export function generateChartDataV2(series: Series[]) {
//   const labels: string[] = [];
//   const grouped: { [label: string]: number[] } = {};

//   const currentSeries = series.map(item => {
//     const group = item.groups.map(group => {
//       const label = Object.values(group.group).join(',');
//       const value = group.aggregations[0].value;
//       return { label, value };
//     });

//     return {
//       time: item.startTime,
//       group,
//     };
//   });

//   const groupedData = currentSeries.reduce((acc, item) => {
//     labels.push(item.time);

//     item.group.forEach(({ label, value }) => {
//       if (!acc[label]) {
//         acc[label] = Array(labels.length - 1).fill(0);
//       }
//       const index = labels.length - 1; // Use labels.length - 1 as the index
//       acc[label][index] = value;
//     });

//     return acc;
//   }, grouped);

//   const datasets = Object.entries(groupedData).map(([label, data]) => {
//     const paddedData = data.concat(Array(labels.length - data.length).fill(0));
//     return { label, data: paddedData, backgroundColor: getRandomColors()[0] };
//   });

//   const chartData = {
//     labels,
//     datasets,
//   };

//   console.log({ chartData });
//   return chartData;
// }

export function generateChartDataV2(series: Series[]) {
  const labels: string[] = [];
  const grouped: { [label: string]: number[] } = {};

  const currentSeries = series.map((item) => {
    const group = item.groups.map((group) => {
      const label = Object.values(group.group).join(",");
      const value = group.aggregations[0].value;
      return { label, value };
    });

    return {
      time: item.startTime,
      group,
    };
  });

  currentSeries.forEach((item) => {
    labels.push(item.time);
    item.group.forEach(({ label, value }) => {
      if (!grouped[label]) {
        grouped[label] = Array(labels.length - 1).fill(0);
      }
      const index = labels.length - 1; // Use labels.length - 1 as the index
      grouped[label][index] = value;
    });
  });

 
  const reducedDatasets = Object.entries(grouped).map(([label, data]) => {
    
    const paddedData = data.concat(
      Array(labels.length - data.length).fill(0)
    );
    return { label, data: paddedData, backgroundColor: getRandomColors()[0] };
  });

  const chartData = {
    labels,
    datasets: reducedDatasets,
  };
  return chartData;
}

export async function generateChartJsDataV3(
  apl: string,
  startTime: Date,
  endTime: Date
) {
  // this is for testing
  const resp = await queryAxiom(apl, startTime, endTime, "tabular");
  console.log({ resp });
  const datasets = [];
  const labels = [];
  const group = resp.tables[0];
  const fields = group.fields.map((field: any) => field.name);
  console.log({ fields });
  const temp = {};
  for (let i = 0; i < group.columns.length; i++) {
    const time = [];
  }
  /**
   *
   * so the goal is to transform data to look like this
   * {
   *   labels: string[],
   *   dataset: {
   *      label: string
   *       data: number[]
   *   }[]
   * }
   */
}

const d = {
  time: "2019-23-01",
  group: {
    "vacel.route": "/middleware",
  },
  arg: [{ value: 20, opt: "_count" }],
};

export function generateChartDatav4(series: Series[]) {
  const chartData = series
    .flatMap((item) => {
      const time = item.startTime;
      return item.groups
        .flatMap((group) => {
          let label = group.aggregations[0].op;
          if (Object.keys(group?.group).length > 0) {
            label = Object.values(group?.group).join(",");
          }
          const value = group.aggregations[0].value;
          const color = generateRandomColor()
          return {
            time,
            label,
            value,
            borderColor: color,
            backgroundColor: color,
          };
        });
    });
  return chartData;
}

// export function generateChartDataV5 (series: Series[]){

//   const labels = series.map((item) => item.startTime);
//   const datasets = []
  
//   const datasetsDict: Record<string, number[]> = {}
//   for (let i = 0; i < labels.length; i++){
//     const item = series[i];
//     for (const group of item?.groups){
//       let label = group.aggregations[0].op;
//       if (Object.keys(group?.group).length > 0) {
//         label = Object.values(group?.group).join(",");
//       }
//       const value = group.aggregations[0]?.value ?? 0;
//       if (!datasetsDict[label]){
//            const list = Array(labels.length).fill(0);
//           datasetsDict[label]= list;
//           datasetsDict[label][i] = value
//       }else {
//         datasetsDict[label][i] = value
//       }
//     }
//   }

//   for (let key in datasetsDict){
//     const data = datasetsDict[key];
//     const label = key;
//     const color = generateRandomColor()
//     const backgroundColor = color;
   
//       datasets.push({ label, data, backgroundColor, borderColor: color })

//   }
//   return {
//     labels,
//     datasets
//   }

  
// }
export function generateChartDataV5(series: Series[], visibleRange: number) {
  const labels = series.map((item) => item.startTime);
  const datasets: { label: string; data: number[]; }[] = [];

  const datasetsDict: Record<string, number[]> = {};

  // Filter and aggregate/downsample data within the visible range
  const startIndex = Math.max(0, labels.length - visibleRange);
  const filteredSeries = series.slice(0, startIndex);
  
  for (let i = 0; i < filteredSeries.length; i++) {
    const item = filteredSeries[i];
    
    for (const group of item.groups) {
      let label = group.aggregations[0].op;
      
      if (Object.keys(group.group).length > 0) {
        label = Object.values(group.group).join(",");
      }
      
      const value = group.aggregations[0]?.value ?? 0;
      
      if (!datasetsDict[label]) {
        const list = Array(filteredSeries.length).fill(0);
        datasetsDict[label] = list;
        datasetsDict[label][i] = value;
      } else {
        datasetsDict[label][i] = value;
      }
    }
  }

  for (let key in datasetsDict) {
    const data = datasetsDict[key];
    const label = key;
    const color = generateRandomColor();
    const backgroundColor = color;

    datasets.push({ label, data });
  }

  return {
    labels: labels.slice(0, startIndex),
    datasets,
  };
}

