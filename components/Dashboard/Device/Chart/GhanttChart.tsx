import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

interface GanttChartProps {
  data: {
    hour: string;
    minutes: number;
  }[];
}

interface SeriesData {
  x: string;
  y: [number, number];
}

interface Series {
  name: string;
  data: SeriesData[];
}

const GanttChart: React.FC<GanttChartProps> = ({ data }) => {
  const [series, setSeries] = useState<Series[]>([]);
  const [headingData, setHeadingData] = useState('');
  const [xaxisRange, setXaxisRange] = useState<{ min: number, max: number }>({ min: 0, max: 0 });
  const [annotations, setAnnotations] = useState<any>({});

  useEffect(() => {
    const mergedTasks: SeriesData[] = [];
    let lastMotionTask: SeriesData | null = null;
    let lastNoMotionTask: SeriesData | null = null;
    let minTime = Infinity;
    let maxTime = -Infinity;

    data.forEach(({ hour, minutes }) => {
      const [dateStr, timeStr] = hour.split('T');
      const [year, month, day] = dateStr.split('-').map(Number);
      const hourOfDay = parseInt(timeStr, 10);

      const start = new Date(Date.UTC(year, month - 1, day, hourOfDay)).getTime();
      const motionEnd = start + minutes * 60 * 1000;
      const noMotionStart = motionEnd;
      const noMotionEnd = start + 60 * 60 * 1000;

      const motionTask: SeriesData = {
        x: 'Motion',
        y: [start, motionEnd]
      };

      const noMotionTask: SeriesData = {
        x: 'No-motion',
        y: [noMotionStart, noMotionEnd]
      };

      if (lastMotionTask && lastMotionTask.y[1] === motionTask.y[0]) {
        lastMotionTask.y[1] = motionTask.y[1];
      } else {
        if (lastMotionTask) {
          mergedTasks.push(lastMotionTask);
        }
        lastMotionTask = motionTask;
      }

      if (lastNoMotionTask && lastNoMotionTask.y[1] === noMotionTask.y[0]) {
        lastNoMotionTask.y[1] = noMotionTask.y[1];
      } else {
        if (lastNoMotionTask) {
          mergedTasks.push(lastNoMotionTask);
        }
        lastNoMotionTask = noMotionTask;
      }

      minTime = Math.min(minTime, start);
      maxTime = Math.max(maxTime, noMotionEnd);
    });

    if (lastMotionTask) {
      mergedTasks.push(lastMotionTask);
    }
    if (lastNoMotionTask) {
      mergedTasks.push(lastNoMotionTask);
    }

    setXaxisRange({ min: minTime, max: maxTime });

    const motionSeries: Series = {
      name: 'Motion',
      data: mergedTasks.filter(task => task.x === 'Motion')
    };

    const noMotionSeries: Series = {
      name: 'No-motion',
      data: mergedTasks.filter(task => task.x === 'No-motion')
    };

    setSeries([motionSeries, noMotionSeries]);
  }, [data]);

  const options = {
    chart: {
      type: 'rangeBar' as const,
      background: 'white',
      toolbar: {
        show: false
      },
      events: {
        dataPointMouseEnter: function (event: any, chartContext: any, config: any) {
          const data = config.w.config.series[config.seriesIndex].data[config.dataPointIndex];
          const durationInMinutes = (data.y[1] - data.y[0]) / (1000 * 60);
          let durationString = '';
        
          if (durationInMinutes >= 60) {
            const hours = Math.floor(durationInMinutes / 60);
            const minutes = Math.floor(durationInMinutes % 60);
            durationString = `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
          } else {
            durationString = `${durationInMinutes} minute${durationInMinutes !== 1 ? 's' : ''}`;
          }
        
          setHeadingData(`${data.x} for ${durationString}`);
        },
        dataPointMouseLeave: function () {
          setHeadingData('');
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        rangeBarGroupRows: true
      },
    },
    grid: {
      show: false, // Disable all grid lines
    },
    xaxis: {
      type: 'datetime' as const,
      min: xaxisRange.min,
      max: xaxisRange.max,
      tickAmount: 6,
      labels: {
        style: {
          fontSize: '12px',
        },
        formatter: function (val: number) {
          const date = new Date(val);
          const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          };
          return date.toLocaleString('en-US', options).replace(',', '');
        }
      },
    },
    yaxis: {
      categories: ['Motion', 'No-motion'],
      labels: {
        style: {
          fontSize: '14px',
          margin: '10px'
        },
        rotate: -90,
        align: 'center',
      },
    },
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left'
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

        const startDate = new Date(data.y[0]);
        const endDate = new Date(data.y[1]);

        const options: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          month: 'short',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        };


        return `<div style="padding: 5px;">${data.x}: <b>${startDate.toLocaleString('en-US', options).replace(',', '')} - ${endDate.toLocaleString('en-US', options).replace(',', '')}<b></div>`;
      },
    },
    colors: ['#7cb5ec', '#434348'],
    annotations: annotations
  };

  return (
    <div className=' w-full h-full'>
      <Chart options={options as any} series={series} type="rangeBar" height={'100%'} />
    </div>
  );
};

export default GanttChart;
