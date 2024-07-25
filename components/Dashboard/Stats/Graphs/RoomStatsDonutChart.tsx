import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { RoomStatsType } from '@/type';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexChartProps {
  roomStats: RoomStatsType;
}

const RoomStatsDonutChart: React.FC<ApexChartProps> = ({ roomStats }) => {
  const series = [roomStats.red, roomStats.yellow, roomStats.green]
  const noData = series.every(element => element === 0);


  const [options] = useState<any>({
    chart: {
      type: 'donut',
    },
    labels: ['Red (0 - 60% Occupancy Rate)', 'Yellow (60 - 80% Occupancy Rate)', 'Green (>80% Occupancy Rate)'],
    colors: ['#FF0000', '#FFFF00', '#008000'],
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
        donut: {
          size: '65%',
        },
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
        <ReactApexChart options={options} series={series} type="donut" width={'100%'} height={'100%'} />
      }
    </div>
  );
};

export default RoomStatsDonutChart;
