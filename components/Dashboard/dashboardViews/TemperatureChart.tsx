import dynamic from "next/dynamic";
import React from "react";
import { ApexOptions } from "apexcharts";
import { EventsMap, Event } from "@/type";
import { SeriesType } from "@/type";
import { commonApexOptions } from "@/utils/graph";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TemperatureChartProps = {
  data: EventsMap;
  eventTypes: string;
};

const valueToGet = (value: string, event: Event) => {
  if (value.includes("temperature")) {
    return event.temperature
  } else if (value.includes("pressure")) {
    return event.pressure || 0
  } else {
    return event.relativeHumidity
  }
}

const transformDataForChart = (
  data: EventsMap,
  eventTypes: string
): SeriesType[] => {
  return Object.keys(data).map((deviceId) => {
    const deviceData = data[deviceId];
    return {
      name: deviceData.name,
      data: deviceData.data.map((event: Event) => ({
        x: new Date(event.createdAt),
        y: valueToGet(eventTypes, event)
      })),
    };
  });
};

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  data,
  eventTypes,
}) => {
  const seriesData = transformDataForChart(data, eventTypes);

  const options: ApexOptions = {
    ...commonApexOptions,
    chart: {
      ...commonApexOptions.chart,
      type: "line",
      group: "no-group",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      title: {
        text:
          eventTypes === "temperature"
            ? "Temperature (°C)"
            : "Relative Humidity (%)",
      },
    },
  };

  return (
    <>
      {
        seriesData[0].data.length === 0 ?
          <div className=" w-full h-full flex justify-center items-center">
            <p>No Data Available for this Device on this date Range</p>
          </div>
          :
          <Chart
            options={options}
            series={seriesData}
            type="line"
            width="100%"
            height="100%"
          />
      }
    </>
  );
};

export default TemperatureChart;
