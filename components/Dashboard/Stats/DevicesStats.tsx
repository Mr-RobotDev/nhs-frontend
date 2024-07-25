"use client";
import { RootState } from "@/app/store/store";
import { Card } from "antd";
import Image from "next/image";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import DeviceTypeDetail from "../Device/DeviceTypeDetail";
import { RoomStatsType } from "@/type";
import classNames from 'classnames';

interface DeviceStatsProps {
  roomStats: RoomStatsType;
}

const DevicesStats = ({ roomStats }: DeviceStatsProps) => {

  const maxOccupantRoom = Math.max(roomStats.red, roomStats.yellow, roomStats.green);
  const thresholds = 5

  let maxVariableColor = '';
  if (maxOccupantRoom === roomStats.red) {
    maxVariableColor = 'bg-[#FF0000]';
  } else if (maxOccupantRoom === roomStats.yellow) {
    maxVariableColor = 'bg-[#FFFF00]';
  } else if (maxOccupantRoom === roomStats.green) {
    maxVariableColor = 'bg-[#008000]';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="!p-0 h-full">
        <div className=" h-full">
          <div className={classNames('h-full rounded-lg', maxVariableColor)}>
            <div className=" text-white text-xl font-semibold p-2">Maximum Occupant Room</div>
            <div className=" w-full h-full flex justify-center items-center">
              <p className=" text-white text-8xl">
                <CountUp
                  end={maxOccupantRoom}
                  duration={2}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Card className="!p-0 h-[350px]">
          <h2 className=" text-xl font-semibold">Occupied Rooms</h2>

          {roomStats.roomNames.length > 0 ? <div className=" mt-5">
            <div className="flex flex-wrap md:flex-nowrap gap-0 md:gap-3 w-full overflow-x-auto">
              {Array.from({ length: Math.ceil(roomStats.roomNames.length / thresholds) }).map((_, columnIndex) => (
                <ul className=" mb-0" key={columnIndex}>
                  {roomStats.roomNames.slice(columnIndex * thresholds, (columnIndex + 1) * thresholds).map((roomName, index) => (
                    <li className="mb-[6px] w-64 flex flex-row gap-2 items-center" key={index}>
                      <div className={classNames('w-[6px] h-[6px] rounded-full', maxVariableColor)}></div>
                      {roomName}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div> : 
          <div className=" w-full h-full flex justify-center items-center">
            <p>No Data Available</p>
          </div>
          }
        </Card>
      </div>
    </div>
  );
};

export default DevicesStats;
