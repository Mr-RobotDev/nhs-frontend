import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { DeviceEventsType } from '@/type';

interface HistogramChartProps {
  data: DeviceEventsType[];
}

const HistogramChart: React.FC<HistogramChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<{ [key: string]: number }>({});
  const [xAxisCategories, setXAxisCategories] = useState<string[]>([]);

  useEffect(() => {
    const aggregatedData = data.reduce((acc, entry) => {
      const date = entry.hour.split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += entry.minutes;
      return acc;
    }, {} as { [key: string]: number });

    // Check if data spans more than 2 days
    const dates = Object.keys(aggregatedData);
    if (dates.length > 2) {
      setXAxisCategories(dates);
      setChartData(aggregatedData);
    } else {
      // Aggregate data by hours if within 2 days
      const hourlyData = data.reduce((acc, entry) => {
        const hour = entry.hour;
        if (!acc[hour]) {
          acc[hour] = 0;
        }
        acc[hour] += entry.minutes;
        return acc;
      }, {} as { [key: string]: number });
      setXAxisCategories(Object.keys(hourlyData));
      setChartData(hourlyData);
    }
  }, [data]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    series: [{
      name: 'Minutes of Motion Detected',
      data: Object.values(chartData).map(value => Math.round(value))
    }],
    xaxis: {
      categories: xAxisCategories
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        columnWidth: '20%'
      }
    },
    colors: ['#15394C']
  };

  return (
    <div className='h-full'>
      <ReactApexChart options={chartOptions} series={chartOptions.series} type="bar" height={'100%'} />
    </div>
  );
};

export default HistogramChart;
