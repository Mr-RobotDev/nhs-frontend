'use client'
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

interface GanttChartProps {
  data: {
    hour: string;
    minutes: number;
  }[];
}

interface SeriesData {
  x: string;
  y: [number, number];
}

interface Series {
  name: string;
  data: SeriesData[];
}

const GanttChart: React.FC<GanttChartProps> = ({ data }) => {
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    // Convert the data to a more usable format
    const events = data.map(item => {
      const from = new Date(item.hour);
      const to = new Date(from.getTime() + item.minutes * 60000);
      return {
        from,
        to
      };
    });

    // Sort events by start time
    events.sort((a, b) => a.from.getTime() - b.from.getTime());

    // Create the "Motion" series
    const motionSeries: Series = {
      name: 'Motion',
      data: events.map(event => ({
        x: 'Motion',
        y: [event.from.getTime(), event.to.getTime()]
      }))
    };

    // Create the "No Motion" series by detecting gaps between "Motion" events
    const noMotionData: SeriesData[] = [];
    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i];
      const nextEvent = events[i + 1];
      if (currentEvent.to < nextEvent.from) {
        noMotionData.push({
          x: 'No Motion',
          y: [currentEvent.to.getTime(), nextEvent.from.getTime()]
        });
      }
    }

    const noMotionSeries: Series = {
      name: 'No Motion',
      data: noMotionData
    };

    // Set the series data
    setSeries([motionSeries, noMotionSeries]);
  }, [data]);

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
