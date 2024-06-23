"use client";
import { RootState } from "@/app/store/store";
import { Card } from "antd";
import Image from "next/image";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import DeviceTypeDetail from "../Device/DeviceTypeDetail";
import { RoomStatsType } from "@/type";


interface DeviceStatsProps {
  roomStats: RoomStatsType;
}

const DevicesStats = ({ roomStats }: DeviceStatsProps) => {
  const devicesStats = useSelector(
    (state: RootState) => state.statisticsReducer
  );
  return (
    <div>
      <div className="layout-content">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mx-auto">
          <DeviceTypeDetail title="Total Rooms" value={roomStats.totalRooms as number} image="/icons/devices.png" />
          <DeviceTypeDetail title="Red" value={roomStats.red as number} image="/icons/highest-temperature.png" />
          <DeviceTypeDetail title="Yellow" value={roomStats.yellow as number} image="/icons/highest-humidity.png" />
          <DeviceTypeDetail title="Green" value={roomStats.green as number} image="/icons/highest-pressure.png" />
        </div>
      </div>
    </div>
  );
};

export default DevicesStats;
