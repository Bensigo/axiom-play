import { Plugin } from "chart.js";

export const reduceStackedItemsPlugin: Plugin = {
  id: 'reduceStackedItems',
  beforeDraw(chart) {
    const { data } = chart;

    // Define the maximum number of stacked items to display
    const maxStackedItems = 5;

    // Check if data exists and has datasets
    if (data && data.datasets && data.datasets.length > 0) {
      const dataset = data.datasets[0];
        console.log({ dataset })
      // Check if the dataset has stacked data
      if (
        dataset.stack !== undefined &&
        dataset.data &&
        dataset.data.length > maxStackedItems
      ) {
        const reducedData = dataset.data.slice(0, maxStackedItems);
        const reducedBackgroundColors = dataset.backgroundColor?.slice(
          0,
          maxStackedItems
        );
        const reducedBorderColors = dataset.borderColor?.slice(
          0,
          maxStackedItems
        );

        // Update the dataset with the reduced stacked items
        dataset.data = reducedData;
        dataset.backgroundColor = reducedBackgroundColors;
        dataset.borderColor = reducedBorderColors;
      }
    }
  },
};
