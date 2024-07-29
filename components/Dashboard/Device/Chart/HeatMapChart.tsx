import { DeviceEventsType } from '@/type';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface HeatmapChartProps {
  deviceEvents: DeviceEventsType[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ deviceEvents }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const motionDetectedEvents = deviceEvents.filter(event => event.state === "MOTION_DETECTED");

    const heatmapData = new Map<string, { x: string, y: number, value: number }>();

    motionDetectedEvents.forEach(event => {
      let dateFrom = new Date(event.from);
      let dateTo = new Date(event.to);

      // Ensure from time is earlier than to time
      if (dateFrom > dateTo) {
        [dateFrom, dateTo] = [dateTo, dateFrom];
      }

      // Loop through each hour between from and to
      while (dateFrom < dateTo) {
        const hour = dateFrom.getHours();
        const day = dateFrom.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        const key = `${day}-${hour}`;
        const nextHour = new Date(dateFrom);
        nextHour.setHours(dateFrom.getHours() + 1);

        const minutes = Math.min((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60), (nextHour.getTime() - dateFrom.getTime()) / (1000 * 60));

        if (!heatmapData.has(key)) {
          heatmapData.set(key, { x: day, y: hour, value: 0 });
        }

        heatmapData.get(key)!.value += minutes;

        dateFrom = nextHour;
      }
    });

    const groupedData = Array.from(heatmapData.values()).reduce((acc, curr) => {
      const hour = curr.y;
      if (!acc[hour]) {
        acc[hour] = { name: `${hour}:00`, data: [] };
      }
      acc[hour].data.push({ x: curr.x, y: Math.round(curr.value) });
      return acc;
    }, [] as { name: string, data: { x: string, y: number }[] }[]);

    setChartData(Object.values(groupedData));
  }, [deviceEvents]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'heatmap',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#008FFB'],
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        colorScale: {
          ranges: [
            { from: 0, to: 10, color: '#00A100', name: 'low (1-10)' },
            { from: 11, to: 20, color: '#128FD9', name: 'medium (11-20)' },
            { from: 21, to: 30, color: '#FFB200', name: 'high (21-30)' },
            { from: 31, to: 200, color: '#FF0000', name: 'extreme (31-60)' }
          ]
        }
      }
    },
    xaxis: {
      type: 'category',
      title: {
        text: 'Date'
      }
    },
    yaxis: {
      title: {
        text: 'Hour'
      },
      labels: {
        formatter: (val: number) => {
          return `${val}`;
        }
      }
    }
  };

  return (
    <div className='h-full'>
      <ReactApexChart options={chartOptions} series={chartData} type="heatmap" height={'100%'} />
    </div>
  );
};

export default HeatmapChart;
