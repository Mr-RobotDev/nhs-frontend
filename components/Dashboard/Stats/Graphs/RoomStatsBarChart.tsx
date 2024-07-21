import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { RoomStatsType } from '@/type';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexChartProps {
  roomStats: RoomStatsType;
}

const RoomStatsBarChart: React.FC<ApexChartProps> = ({ roomStats }) => {
  const [series, setSeries] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    setSeries([roomStats.red, roomStats.yellow, roomStats.green]);
  }, [roomStats]);

  const [options] = useState<any>({
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -10,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      },
      formatter: function (val: number) {
        return val.toFixed(1);
      },
    },
    xaxis: {
      categories: ['Red (0 - 60% Occupancy Rate)', 'Yellow (60 - 80% Occupancy Rate)', 'Green (>80% Occupancy Rate)'],
      labels: {
        formatter: function (val: number) {
          return val.toFixed(0);
        },
      },
      min: 0,
      max: Math.max(roomStats.red, roomStats.yellow, roomStats.green),
      tickAmount: Math.max(roomStats.red, roomStats.yellow, roomStats.green) / 5,
    },
    yaxis: {
      max: 100,
    },
    colors: ['#FF0000', '#FFFF00', '#008000'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  });

  return (
    <div id="chart" className='w-full h-[300px]'>
      <ReactApexChart options={options} series={[{ data: series }]} type="bar" width={'100%'} height={'100%'} />
    </div>
  );
};

export default RoomStatsBarChart;
