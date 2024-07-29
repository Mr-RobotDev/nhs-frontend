import { DeviceEventsType } from '@/type';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface HistogramChartProps {
  deviceEvents: DeviceEventsType[];
}

const HistogramChart: React.FC<HistogramChartProps> = ({ deviceEvents }) => {
  const [chartData, setChartData] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const motionDetectedEvents = deviceEvents.filter(event => event.state === "MOTION_DETECTED");

    const aggregatedData = motionDetectedEvents.reduce((acc, event) => {
      let dateFrom = new Date(event.from);
      let dateTo = new Date(event.to);

      // Ensure from time is earlier than to time
      if (dateFrom > dateTo) {
        [dateFrom, dateTo] = [dateTo, dateFrom];
      }

      const durationMinutes = (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60);
      const day = dateFrom.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += durationMinutes;
      return acc;
    }, {} as { [key: string]: number });

    // Sort the keys (dates)
    const sortedData = Object.keys(aggregatedData)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .reduce((acc, key) => {
        acc[key] = aggregatedData[key];
        return acc;
      }, {} as { [key: string]: number });

    setChartData(sortedData);
  }, [deviceEvents]);

  const roundedData = Object.values(chartData).map(value => Math.round(value));

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    series: [{
      name: 'Minutes of Motion Detected',
      data: roundedData
    }],
    xaxis: {
      categories: Object.keys(chartData)
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        columnWidth: '10%' // Adjust this value to make bars thinner or thicker
      }
    }
  };

  return (
    <div className=' h-full'>
      <ReactApexChart options={chartOptions} series={chartOptions.series} type="bar" height={'100%'} />
    </div>
  );
};

export default HistogramChart;
