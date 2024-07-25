import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { departmentsType } from '@/type';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexChartProps {
  departments: departmentsType[];
}

const RoomDepartmentsDonutChart: React.FC<ApexChartProps> = ({ departments }) => {
  const [series, setSeries] = useState<number[]>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      type: 'donut',
    },
    labels: [],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px', // Reduced font size
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
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

  useEffect(() => {
    const counts = departments.map((department: departmentsType) => department.count);
    const functions = departments.map((department: departmentsType) => department.department);
    setSeries(counts);
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      labels: functions
    }));
  }, [departments]);

  const noData = series.every(element => element === 0);

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

export default RoomDepartmentsDonutChart;
