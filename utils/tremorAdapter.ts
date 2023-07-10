import {
  format,
  subHours,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
} from "date-fns";

export const getDateFormat = (start: Date, end: Date): string => {
  const hoursDiff = differenceInHours(end, start);
  const daysDiff = differenceInDays(end, start);
  const monthsDiff = differenceInMonths(end, start);

  if (daysDiff <= 1) {
    return "hh:mm";
  }
  if (monthsDiff >= 1) {
    return "dd LLL";
  }
  return "dd LLL";
};

const extractTotalsHeaders = (buckets: any[]): Set<string> => {
  const totalHeaders = new Set<string>();

  buckets?.forEach((total: any) => {
    const groupKey = Object.keys(total.group)[0];
    const aggregations = total.aggregations;

    totalHeaders.add(groupKey);
    aggregations?.forEach((agg: any) => {
      totalHeaders.add(agg.op);
    });
  });

  return totalHeaders;
};

const extractTotalsRows = (buckets: any[]): any[] => {
  const totalsRows: any[] = [];

  buckets?.forEach((total: any) => {
    const vals: any = {};
    const groupKey = Object.keys(total.group)[0];
    const groupVal = Object.values(total.group)[0];

    vals[groupKey] = groupVal;
    total.aggregations?.forEach((agg: any) => {
      vals[agg.op] = agg.value;
    });

    if (Object.keys(vals).length) {
      totalsRows.push(vals);
    }
  });

  return totalsRows;
};

export interface SeriesData {
  startTime: string;
  endTime: string;
  groups: {
    id: number;
    group: {
      [key: string]: string;
    };
    aggregations: {
      op: string;
      value: number;
    }[];
  }[];
}

const extractChartData = (series: SeriesData[], chartTimeFormat: string) => {
  const chartData: any[] = [];

  series?.forEach((item) => {
    const time = format(new Date(item?.startTime), chartTimeFormat);
    const aggregateVals: Record<string, any> = { time };
    if (item && item.groups){
      item.groups.forEach((group) => {
        const { group: groupData, aggregations } = group;
        let label = group.aggregations[0].op;
  
        if (Object.keys(groupData).length > 0) {
          label = Object.values(group.group).join(",");
          Object.values(groupData).forEach((cur) => {
            // aggregateVals[aggregations[0].op] = aggregations[0].value;
            aggregateVals[label] = aggregations[0].value;
          });
        }
  
        if (Object.keys(groupData).length === 0 && !!aggregations?.length) {
          aggregations?.forEach((aggregation) => {
            const { op, value } = aggregation;
     
            aggregateVals[op] = value;
            // aggregateVals[String(groupVal)] = aggregation.value;
          });
        }
      });
      if (Object.keys(aggregateVals).length) {
        chartData.push({ ...aggregateVals });
      }
    }
  
  });

  return chartData;
};

const extractTableHeaders = (matches: any[]): string[] => {
  if (!matches.length) return [];
  const firstRow = matches?.[0];
  const { data, ...rest } = firstRow || {};
  const currKeys = Object.keys(data || {}).flatMap((key) => {
    if (typeof data?.[key] === "object") {
      const keys = Object.keys(data[key] || {}).map((x) => `${key}.${x}`);
      return keys;
    }
    return key;
  });

  return [...Object.keys(rest), ...currKeys];
};

const extractTableRows = (matches: any[]): any[] => {
  return matches?.map((row: any) => {
    const { data, ...rest } = row || {};
    const currData = Object.keys(data || {}).flatMap((key) => {
      let objTableItems: any[] = [];
      if (typeof data?.[key] === "object") {
        objTableItems = Object.values(data[key] || {});
        return objTableItems;
      }
      return data?.[key];
    });
    return [...Object.values(rest), ...currData];
  });
};

export const tremorAdapter = (
  resp: any,
  startDate: Date,
  endDate: Date
): {
  headers?: any[];
  data?: any[];
  index?: string;
  rows?: any[];
  totalsHeaders?: string[];
  totalsRows?: any[];
} => {
  const result: any = {};

  const chartTimeFormat = getDateFormat(startDate, endDate);

  // handle totals
  result.totalsHeaders = Array.from(extractTotalsHeaders(resp.buckets?.totals));
  result.totalsRows = extractTotalsRows(resp.buckets?.totals);

  // handle chart result
  result.data = extractChartData(resp.buckets?.series, chartTimeFormat);
  result.index = "time";

  // handle table response
  result.headers = extractTableHeaders(resp.matches);
  result.rows = extractTableRows(resp.matches);
  return result;
};
