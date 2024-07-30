import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface DataPoint {
  hour: string;
  minutes: number;
}

interface HeatmapChartProps {
  data: DataPoint[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const heatmapData = new Map<string, { x: string, y: number, value: number }>();

    // Extract all dates and hours from the data
    const dates = new Set<string>();
    const hours = new Set<number>();

    data.forEach(entry => {
      const date = entry.hour.split('T')[0];
      const hour = parseInt(entry.hour.split('T')[1], 10);
      dates.add(date);
      hours.add(hour);
      const key = `${date}-${hour}`;

      if (!heatmapData.has(key)) {
        heatmapData.set(key, { x: date, y: hour, value: 0 });
      }

      heatmapData.get(key)!.value += entry.minutes;
    });

    // Initialize all date-hour combinations to zero if not present
    dates.forEach(date => {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${date}-${hour}`;
        if (!heatmapData.has(key)) {
          heatmapData.set(key, { x: date, y: hour, value: 0 });
        }
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

    // Sort data by date
    Object.values(groupedData).forEach(hourData => {
      hourData.data.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
    });

    setChartData(Object.values(groupedData));
  }, [data]);

  useEffect(() => {
    console.log("Chart Data: ", chartData);
  }, [chartData]);

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
            { from: 31, to: 200, color: '#DE3832', name: 'extreme (31-200)' }
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
