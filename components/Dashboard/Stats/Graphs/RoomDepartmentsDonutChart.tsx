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
      enabled: false, // Disable data labels
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

  useEffect(() => {
    const counts = departments.map((department: departmentsType) => department.count);
    const functions = departments.map((department: departmentsType) => department.name);
    setSeries(counts);
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      labels: functions
    }));
  }, [departments]);

  const noData = series.every(element => element === 0);

  return (
    <div id="chart" className='w-full h-[500px] md:h-[300px]'>
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
