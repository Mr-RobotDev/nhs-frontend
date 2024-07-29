'use client'
import { DeviceEventsType } from '@/type';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

interface GanttChartProps {
  deviceEvents: DeviceEventsType[];
}

interface SeriesData {
  x: string;
  y: [number, number];
}

interface Series {
  name: string;
  data: SeriesData[];
}

const GanttChart: React.FC<GanttChartProps> = ({ deviceEvents }) => {
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    const stateToName = (state: string) => {
      switch (state) {
        case 'NO_MOTION_DETECTED': return 'No Motion';
        case 'MOTION_DETECTED': return 'Motion';
        default: return state;
      }
    };

    const groupedByState = deviceEvents.reduce((acc: Record<string, DeviceEventsType[]>, curr) => {
      if (!acc[curr.state]) {
        acc[curr.state] = [];
      }
      acc[curr.state].push(curr);
      return acc;
    }, {});

    const newSeries: Series[] = Object.keys(groupedByState).map(state => {
      return {
        name: stateToName(state),
        data: groupedByState[state].map((item: DeviceEventsType) => ({
          x: stateToName(state),
          y: [new Date(item.from).getTime(), new Date(item.to).getTime()]
        }))
      };
    });

    console.log('Grouped by state:', JSON.stringify(groupedByState, null, 2));
    console.log('newSeries->', newSeries)
    setSeries(newSeries);
  }, [deviceEvents]);

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
        return `<div style="padding: 5px;">${data.x}: ${new Date(data.y[0]).toLocaleDateString()} ${new Date(data.y[0]).toLocaleTimeString()} - ${new Date(data.y[1]).toLocaleDateString()} ${new Date(data.y[1]).toLocaleTimeString()}</div>`;
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





// const series = [
//   {
//     name: 'No Motion',
//     data: [
//       {
//         x: 'No Motion',
//         y: [new Date('2023-07-21').getTime(), new Date('2023-07-25').getTime()],
//       },
//       {
//         x: 'No Motion',
//         y: [new Date('2023-08-01').getTime(), new Date('2023-08-05').getTime()],
//       },
//     ],
//   },
//   {
//     name: 'Motion',
//     data: [
//       {
//         x: 'Motion',
//         y: [new Date('2023-07-26').getTime(), new Date('2023-07-30').getTime()],
//       },
//     ],
//   },
// ];