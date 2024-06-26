import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexChartProps {}

const DeviceStatsPieChart: React.FC<ApexChartProps> = () => {
  const devicesStats = useSelector((state: RootState) => state.statisticsReducer);

  const [series, setSeries] = useState<number[]>([0, 0]);

  useEffect(() => {
    setSeries([devicesStats.online, devicesStats.offline]);
  }, [devicesStats]);

  const [options] = useState<any>({
    chart: {
      type: 'pie',
    },
    labels: ['Online', 'Offline'],
    colors: ['#008FFB', '#FF4560'],
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
      <ReactApexChart options={options} series={series} type="pie" width={'100%'} height={'100%'} />
    </div>
  );
};

export default DeviceStatsPieChart;
