import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { RoomStatsType } from '@/type';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexChartProps {
  roomStats: RoomStatsType;
}

const RoomStatsPieChart: React.FC<ApexChartProps> = ({ roomStats }) => {
  const series = [0,0,0]
  const noData = series.every(element => element === 0);

  const [options] = useState<any>({
    chart: {
      type: 'pie',
    },
    labels: ['Red (0 - 60% Occupancy Rate)', 'Amber (60 - 80% Occupancy Rate)', 'Green (>80% Occupancy Rate)'],
    colors: ['#DE3832', '#EEBE45', '#5EB157'],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '16px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: ['#FFFFFF']
      },
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.45
      },
      position: 'center',
      offsetX: 0,
      offsetY: 0,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -30,
          minAngleToShowLabel: 10
        }
      }
    },
    legend: {
      position: 'bottom'
    },
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
        <ReactApexChart options={options} series={series} type="pie" width={'100%'} height={'100%'} />
      }
    </div>
  );
};

export default RoomStatsPieChart;
