import React from 'react';
import Chart from 'react-apexcharts';

const GanttChart: React.FC = () => {
  const series = [
    {
      name: 'Task 1',
      data: [
        {
          x: 'Task 1',
          y: [new Date('2023-07-21').getTime(), new Date('2023-07-25').getTime()],
        },
        {
          x: 'Task 1',
          y: [new Date('2023-08-01').getTime(), new Date('2023-08-05').getTime()],
        },
      ],
    },
    {
      name: 'Task 2',
      data: [
        {
          x: 'Task 2',
          y: [new Date('2023-07-26').getTime(), new Date('2023-07-30').getTime()],
        },
      ],
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: 'rangeBar' as const,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      type: 'datetime' as const,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        return `<div style="padding: 5px;">${data.x}: ${new Date(data.y[0]).toLocaleDateString()} - ${new Date(
          data.y[1],
        ).toLocaleDateString()}</div>`;
      },
    },
  };

  return (
    <div>
      <Chart options={options as any} series={series} type="rangeBar" height={350} />
    </div>
  );
};

export default GanttChart;
