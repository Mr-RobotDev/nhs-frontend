import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RootState } from '@/app/store/store';
import { RoomStatsType } from '@/type';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexChartProps {
  roomStats: RoomStatsType;
}

const RoomStatsBarChart: React.FC<ApexChartProps> = ({ roomStats }) => {


  const [series, setSeries] = useState<any[]>([
    {
      name: 'Occupancy Rate',
      data: [roomStats.red, roomStats.amber, roomStats.green]
    }
  ]);

  const noData = [roomStats.red, roomStats.amber, roomStats.green].every(element => element === 0);

  const [options] = useState<any>({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: false,
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
      categories: ['Red (0 - 60% Occupancy Rate)', 'Amber (60 - 80% Occupancy Rate)', 'Green (>80% Occupancy Rate)'],
      labels: {
        formatter: function (val: number) {
          return val.toFixed(0);
        },
      },
      min: 0,
      max: Math.max(roomStats.red, roomStats.amber, roomStats.green),
      tickAmount: Math.max(roomStats.red, roomStats.amber, roomStats.green) / 5,
    },
    yaxis: {
      max: 100,
    },
    colors: ['#FF0000', '#FEB019', '#008000'], // Define colors here
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
      {noData ?
        <div className=' w-full h-full flex justify-center items-center'>
          <p className=" font-semibold text-3xl">No Data Available</p>
        </div>
        :
        <ReactApexChart
          options={options}
          series={series} // Use updated series
          type="bar"
          width={'100%'}
          height={'100%'}
        />
      }
    </div>
  );
};

export default RoomStatsBarChart;
