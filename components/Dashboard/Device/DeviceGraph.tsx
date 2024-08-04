"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, DatePicker, Spin, Button, Popover } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import toast from "react-hot-toast";
import { DevicesType, DataPoint, DeviceEventsType } from "@/type";
import Image from "next/image";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import FileDownloadButton from "../Stats/FileDownloadButton";
import Link from "next/link";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { SelectSecondary } from "@/components/ui/Select/Select";
import {
  temperatureColors,
  humidityColors,
  commonApexOptions,
  generateAnnotations,
} from "@/utils/graph";
import DeviceTypeDetail from "./DeviceTypeDetail";
import PressueChart from "./PressueChart";
import { getDeviceLabelFromState, iconsBasedOnType } from "@/utils/helper_functions";
import GanttChart from "./Chart/GhanttChart";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

interface DeviceGraphProps {
  id: string;
}

const DeviceGraph = ({ id }: DeviceGraphProps) => {
  const [deviceData, setDeviceData] = useState<DevicesType>();
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(3, "day").startOf("day"),
    dayjs().endOf("day"),
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [graphloading, setGraphLoading] = useState<boolean>(false);
  const [currentPreset, setCurrentPreset] = useState<string>("Last 3 Days");
  const [deviceEvents, setDeviceEvents] = useState<DeviceEventsType[]>([])
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const to = params.get("to");
    if (from && to) {
      setRange([dayjs(from), dayjs(to)]);
    }
  }, []);

  const fetchData = useCallback(
    async (from: string, to: string) => {
      if (deviceData) {
        try {
          setGraphLoading(true);
          const response = await axiosInstance.get(
            `/devices/${deviceData.id}/events?from=${from}&to=${to}`
          );
          if (response.status === 200) {
            setDeviceEvents(response.data)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
          setGraphLoading(false);
        }
      }
    },
    [deviceData]
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(`/devices/${id}`);
        if (response.status === 200) {
          setDeviceData(response.data);
        } else {
          console.log("error->", response);
        }
      } catch (error: any) {
        console.log("error->", error);
      }
    })();
  }, [id]);

  useEffect(() => {
    const from = dayjs(range[0].toISOString()).format("YYYY-MM-DD");
    const to = dayjs(range[1].toISOString()).format("YYYY-MM-DD");
    fetchData(from, to);

    if (window && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set("from", from);
      url.searchParams.set("to", to);
      window.history.replaceState({}, "", url.toString());
    }
  }, [range, fetchData]);

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length > 0) {
      let newRange: [Dayjs, Dayjs];
      newRange = [dayjs(dates[0]), dayjs(dates[1])];
      setRange(newRange);
      const from = newRange[0].format("YYYY-MM-DD");
      const to = newRange[1].format("YYYY-MM-DD");
      if (window && window.history) {
        const url = new URL(window.location.href);
        url.searchParams.set("from", from);
        url.searchParams.set("to", to);
        window.history.replaceState({}, "", url.toString());
      }
    } else {
      toast.error("Date Range cannot be empty");
    }
  };

  const handleDatePreset = (preset: string) => {
    let newRange: [Dayjs, Dayjs];
    switch (preset) {
      case "Today":
        newRange = [dayjs().startOf("day"), dayjs().endOf("day")];
        break;
      case "Yesterday":
        newRange = [
          dayjs().subtract(1, "day").startOf("day"),
          dayjs().subtract(1, "day").endOf("day"),
        ];
        break;
      case "This Week":
        newRange = [dayjs().startOf("week"), dayjs().endOf("week")];
        break;
      case "Last Week":
        newRange = [
          dayjs().subtract(1, "week").startOf("week"),
          dayjs().subtract(1, "week").endOf("week"),
        ];
        break;
      case "Last 3 Days":
        newRange = [
          dayjs().subtract(3, "day").startOf("day"),
          dayjs().endOf("day"),
        ];
        break;
      case "Last 7 Days":
        newRange = [
          dayjs().subtract(7, "day").startOf("day"),
          dayjs().endOf("day"),
        ];
        break;
      case "Last 30 Days":
        newRange = [
          dayjs().subtract(30, "day").startOf("day"),
          dayjs().endOf("day"),
        ];
        break;
      default:
        newRange = [dayjs().startOf("day"), dayjs().endOf("day")];
    }
    setRange(newRange);
    const from = newRange[0].format("YYYY-MM-DD");
    const to = newRange[1].format("YYYY-MM-DD");
    if (window && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set("from", from);
      url.searchParams.set("to", to);
      window.history.replaceState({}, "", url.toString());
    }
    setCurrentPreset(preset);
  };

  const menu = (
    <div className=" w-[170px]">
      <div className=" flex flex-col">
        {["Today", "Yesterday"].map((preset) => (
          <div
            key={preset}
            className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
            onClick={() => handleDatePreset(preset)}
          >
            <span className="flex flex-col justify-center w-[6px]">
              <span
                className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${preset === currentPreset ? "visible" : "hidden"
                  }`}
              ></span>
            </span>
            <span className="text-sm font-medium !text-black">{preset}</span>
          </div>
        ))}
        <div
          className="bg-slate-300 dark:bg-slate-700 my-2"
          style={{ height: "1px" }}
        ></div>
        <div>
          <div className="text-[11px] text-secondary-300 ml-3 !text-black">
            Monday - Sunday
          </div>
          {["This Week", "Last Week"].map((preset) => (
            <div
              key={preset}
              className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
              onClick={() => handleDatePreset(preset)}
            >
              <span className="flex flex-col justify-center w-[6px]">
                <span
                  className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${preset === currentPreset ? "visible" : "hidden"
                    }`}
                ></span>
              </span>
              <span className="text-sm font-medium !text-black">{preset}</span>
            </div>
          ))}
        </div>
        <div
          className="bg-slate-300 dark:bg-slate-700 my-2"
          style={{ height: "1px" }}
        ></div>
        <div>
          {["Last 3 Days", "Last 7 Days", "Last 30 Days"].map((preset) => (
            <div
              key={preset}
              className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
              onClick={() => handleDatePreset(preset)}
            >
              <span className="flex flex-col justify-center w-[6px]">
                <span
                  className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${preset === currentPreset ? "visible" : "hidden"
                    }`}
                ></span>
              </span>
              <span className="text-sm font-medium !text-black">{preset}</span>
            </div>
          ))}
        </div>
        <div
          className="bg-slate-300 dark:bg-slate-700 my-2"
          style={{ height: "1px" }}
        ></div>
        <div
          className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
          onClick={() => setCurrentPreset("Custom")}
        >
          <span className="flex flex-col justify-center w-[6px]">
            <span
              className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${"Custom" === currentPreset ? "visible" : "hidden"
                }`}
            ></span>
          </span>
          <span className="text-sm font-medium !text-black">Custom</span>
        </div>
      </div>
    </div>
  );

  return loading ? (
    <div className="flex justify-center items-center h-full mt-20">
      <Spin size="large" />
    </div>
  ) : (
    <>
      <div className={`gap-3 mx-auto mb-14 grid grid-cols-1 md:grid-cols-3`}>
        <div className=" h-full">
          <Card bordered={false} className="criclebox h-full">
            <div className=" text-2xl flex flex-row justify-between">
              <div className="w-10/12">
                <span className=" text-lg">Name</span>
                <div className="">
                  <span className="">
                    <p className="!text-2xl !font-bold !mb-0">
                      {deviceData?.name}
                    </p>
                  </span>
                </div>
              </div>
              <div className=" w-12 h-12 flex items-center justify-center ml-auto">
                <Image
                  src={iconsBasedOnType(deviceData?.type as string)}
                  className=" w-full h-full"
                  alt="icon"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </Card>
        </div>
        <div>
          <Card bordered={false} className="criclebox h-full">
            <div className=" text-2xl flex flex-row justify-between">
              <div>
                <span className=" text-lg">
                  {deviceData?.isOffline ? "Connectivity" : "Signal Strength"}
                </span>
                <div className="">
                  <span className="!text-3xl !font-bold">
                    {deviceData?.signalStrength && (
                      <CountUp
                        end={deviceData?.signalStrength as number}
                        duration={2}
                      />
                    )}
                    {!deviceData?.signalStrength && (
                      <p className="!text-2xl !font-bold !mb-0 ">Offline</p>
                    )}
                  </span>
                </div>
              </div>
              <div className=" w-12 h-12 flex items-center justify-center ml-auto">
                <Image
                  src={deviceData?.signalStrength ? '/icons/signal-strength.png' : '/icons/offline.png'}
                  className=" w-full h-full"
                  alt="icon"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </Card>
        </div>
        { deviceData?.state && <div>
          <Card bordered={false} className="criclebox h-full">
            <div className=" text-2xl flex flex-row justify-between">
              <div>
                <span className=" text-lg">
                  State
                </span>
                <div className="">
                  <span className="!text-3xl !font-bold">
                    {getDeviceLabelFromState(deviceData?.state)}
                  </span>
                </div>
              </div>
              <div className=" w-12 h-12 flex items-center justify-center ml-auto">
                <Image
                  src={iconsBasedOnType(deviceData.state.toLowerCase())}
                  className=" w-full h-full"
                  alt="icon"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </Card>
        </div>}

      </div>
      <div className=" mx-auto">
        <Card>
          <div className="flex flex-col gap-2">
            <div className=" flex flex-row items-center justify-end gap-3 ">
              {deviceData &&
                <FileDownloadButton
                  deviceId={deviceData?.id}
                  from={range[0].format("YYYY-MM-DD")}
                  to={range[1].format("YYYY-MM-DD")}
                />}
              <Link
                href={`/dashboard/devices/${id}/activity-logs`}
                target="_blank"
              >
                <Button
                  className=" flex flex-row items-center justify-center gap-3"
                  style={{ width: "170px" }}
                >
                  Activity Logs
                  <div>
                    <ArrowUpRightIcon
                      width={16}
                      className="transform transition-transform duration-150 group-hover:translate-x-1"
                    />
                  </div>
                </Button>
              </Link>
            </div>
            <div className="flex justify-end">
              <div className=" flex flex-row gap-3 items-center justify-center w-full md:w-auto">
                <div
                  className={`flex-row gap-3 items-center justify-between md:justify-end w-full ${currentPreset === "Custom" ? "flex" : "hidden"
                    }`}
                >
                  <p className="!m-0 font-semibold">Date Range</p>
                  <RangePicker
                    className="hidden md:flex"
                    onChange={handleRangeChange}
                    defaultValue={range}
                  />
                </div>
                <Popover
                  getPopupContainer={(triggerNode) =>
                    triggerNode.parentNode as HTMLElement
                  }
                  content={menu}
                  trigger="hover"
                  placement="bottomLeft"
                >
                  <div
                    className=" flex flex-row items-center border rounded-md shadow-md"
                    style={{ width: "170px" }}
                  >
                    <SelectSecondary
                      only={currentPreset}
                      Icon={<CalendarDaysIcon width={20} />}
                    />
                  </div>
                </Popover>
              </div>
            </div>
            <div
              className={` justify-end md:hidden ${currentPreset === "Custom" ? "flex" : "hidden"
                }`}
            >
              <RangePicker
                className=" w-full"
                onChange={handleRangeChange}
                defaultValue={range}
              />
            </div>
            <div className=" w-full h-[450px]">
              {graphloading ? (
                <div className="flex justify-center items-center h-full">
                  <Spin size="large" />
                </div>
              ) : deviceEvents.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className=" text-2xl font-semibold">No data available for the selected date range</p>
                </div>
              ) : (
                <GanttChart data={deviceEvents} />
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default DeviceGraph;
