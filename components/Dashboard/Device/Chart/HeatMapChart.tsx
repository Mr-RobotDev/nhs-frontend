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
            { from: 0, to: 15, color: '#5CB158', name: 'low (0-15)' },
            { from: 16, to: 30, color: '#84BD55', name: 'medium (16-30)' },
            { from: 31, to: 45, color: '#EBB143', name: 'high (31-45)' },
            { from: 45, to: 60, color: '#DE3832', name: 'extreme (45-60)' }
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
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return `${val} minutes`;
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
