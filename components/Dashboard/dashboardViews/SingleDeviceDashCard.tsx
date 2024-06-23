"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { EventsMap, Event, alertRange } from "@/type";
import { SeriesType } from "@/type";

import ReactApexChart from "react-apexcharts";
import {
  humidityColors,
  temperatureColors,
  commonApexOptions,
  generateAnnotations,
} from "@/utils/graph";

type SingleDeviceDashCardProps = {
  data: EventsMap;
  eventTypes: string;
  alert: {
    field: string,
    range: alertRange
  } | undefined;
};

const SingleDeviceDashCard = ({
  data,
  eventTypes,
  alert
}: SingleDeviceDashCardProps) => {
  const [temperatureData, setTemperatureData] = useState<SeriesType[]>([]);
  const [relativeHumidityData, setRelativeHumidityData] = useState<
    SeriesType[]
  >([]);

  const temperatureDataForChart = (data: EventsMap) => {
    const temperatureData = Object.keys(data).map((deviceId) => {
      const deviceData = data[deviceId];
      return {
        name: deviceData.name,
        data: deviceData.data.map((event: Event) => ({
          x: new Date(event.createdAt),
          y: event.temperature,
        })),
      };
    });
    setTemperatureData(temperatureData);
  };

  const relativehumidityDataForChart = (data: EventsMap) => {
    const relativeHumidityData = Object.keys(data).map((deviceId) => {
      const deviceData = data[deviceId];
      return {
        name: deviceData.name,
        data: deviceData.data.map((event: Event) => ({
          x: new Date(event.createdAt),
          y: event.relativeHumidity,
        })),
      };
    });

    setRelativeHumidityData(relativeHumidityData);
  };

  useEffect(() => {
    temperatureDataForChart(data);
    relativehumidityDataForChart(data);
  }, [data]);

  const TemperatureChart = ({ data }: { data: any }) => {
    const temperatureOptions: ApexOptions = {
      ...commonApexOptions,
      chart: {
        ...commonApexOptions.chart,
        type: "line",
        id: "temperatureChartDevice",
        group: "device",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Temperature",
        },
      },
      annotations: alert?.field === 'temperature' ? generateAnnotations(alert?.range) : {},
      series: [
        {
          name: "Temperature",
          data,
        },
      ],
      colors: temperatureColors,
      legend: {
        show: true,
      },
    };

    return (
      <ReactApexChart
        options={temperatureOptions}
        series={temperatureData}
        type="line"
        width={"100%"}
        height={"100%"}
      />
    );
  };

  const RelativeHumidityChart = ({ data }: { data: any }) => {
    const relativeHmidityOptions: ApexOptions = {
      ...commonApexOptions,
      chart: {
        ...commonApexOptions.chart,
        type: "line",
        id: "relativeHumidityChartDevice",
        group: "device",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Relative Humidity",
        },
      },
      annotations: alert?.field === 'relativeHumidity' ? generateAnnotations(alert?.range) : {},
      series: [
        {
          name: "Relative Humidity",
          data,
        },
      ],
      colors: humidityColors,
      legend: {
        show: true,
      },
    };

    return (
      <ReactApexChart
        options={relativeHmidityOptions}
        series={relativeHumidityData}
        type="line"
        width={"100%"}
        height={"100%"}
      />
    );
  };

  return (
    <div className=" h-full w-full">
      {temperatureData.length > 0 && (
        <div className="w-full !h-1/2">
          <TemperatureChart data={temperatureData} />
        </div>
      )}
      {relativeHumidityData.length > 0 && (
        <div className=" w-full !h-1/2">
          <RelativeHumidityChart data={relativeHumidityData} />
        </div>
      )}
    </div>
  );
};

export default SingleDeviceDashCard;
