import React, { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { AlertStatsType } from '@/type';

interface AlertsPieChartProps {
  data: AlertStatsType
}

const AlertsPieChart: React.FC<AlertsPieChartProps> = ({ data }) => {

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      events: {
        dataPointMouseEnter: function (event, chartContext, config) {
          const tooltipEl = document.querySelector('.apexcharts-tooltip') as HTMLElement;
          if (tooltipEl) {
            const tooltipRect = tooltipEl.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (tooltipRect.right > viewportWidth) {
              tooltipEl.style.left = `-${tooltipRect.width}px`;
            }
            if (tooltipRect.bottom > viewportHeight) {
              tooltipEl.style.top = `-${tooltipRect.height}px`;
            }
          }
        },
        dataPointMouseLeave: function () {
          const tooltipEl = document.querySelector('.apexcharts-tooltip') as HTMLElement;
          if (tooltipEl) {
            tooltipEl.style.left = '';
            tooltipEl.style.top = '';
          }
        }
      }
    },
    labels: ['Active Alerts', 'Non-Active Alerts'],
    colors: ['#F40615', '#50C878'],
    tooltip: {
      enabled: true,
      custom: function ({ seriesIndex }) {
        const chunkArray = (array: string[], size: number) => {
          const result = [];
          for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
          }
          return result;
        };

        if (seriesIndex === 0) {
          return `<div class="p-2 bg-white border border-gray-300 rounded shadow-md text-sm">${data.totalActiveAlerts} Active Alerts</div>`;
        } else {
          return `<div class="p-2 bg-white border border-gray-300 rounded shadow-md text-sm">${data.totalNonActiveAlerts} Non-Active Alerts</div>`;
        }
      },
    },
    legend: {
      position: 'bottom'
    }
  };


  const series = [data.totalActiveAlerts, data.totalNonActiveAlerts];


  useEffect(() => {
    console.log(data.totalActiveAlerts)
    console.log(data.totalNonActiveAlerts)
  })

  return (
    (data.totalActiveAlerts === 0 && data.totalNonActiveAlerts === 0) ?
      <div className=' text-2xl font-semibold'>
        No Data Available
      </div>
      :
      <div>
        <ReactApexChart options={options} series={series} type="pie" width="500" />
      </div>



  );
};

export default AlertsPieChart;
