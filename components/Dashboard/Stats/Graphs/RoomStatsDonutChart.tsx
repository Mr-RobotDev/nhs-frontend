import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { RoomStatsType } from '@/type';
import { occupanyColor } from '@/utils/helper_functions';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexChartProps {
  roomStats: RoomStatsType;
}

const RoomStatsDonutChart: React.FC<ApexChartProps> = ({ roomStats }) => {
  const series = [roomStats.red, roomStats.amber, roomStats.green];
  const noData = series.every(element => element === 0);

  const [options] = useState<any>({
    chart: {
      type: 'donut',
    },
    labels: ['Red (0 - 60% Occupancy Rate)', 'Amber (60 - 80% Occupancy Rate)', 'Green (>80% Occupancy Rate)'],
    colors: [occupanyColor('red'), occupanyColor('amber'), occupanyColor('green')],
    dataLabels: {
      enabled: false, // Disable data labels
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      }
    },
    legend: {
      position: 'right'
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
