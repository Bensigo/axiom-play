import { Plugin } from "chart.js";

export const reduceDataPointsPlugin: Plugin = {
    id: 'reduceData',
    beforeUpdate(chart) {
      const { data } = chart;
  
      // Define the maximum number of data points to render
      const maxDataPoints = 100;
  
      // Check if data exists and has datasets
      if (data && data.datasets && data.datasets.length > 0) {
        const dataset = data.datasets[0];
        const { labels } = data;
  
        // Check if labels exist and if reduction is needed
        if (labels && labels.length > maxDataPoints) {
          const reducedLabels = labels.filter(
            (_, index) => index % Math.ceil(labels.length / maxDataPoints) === 0
          );
          const reducedData = dataset.data.filter(
            (_, index) => index % Math.ceil(dataset.data.length / maxDataPoints) === 0
          );
  
          // Update the labels and data with the reduced values
          data.labels = reducedLabels;
          dataset.data = reducedData;
        }
      }
    },
  };
  
