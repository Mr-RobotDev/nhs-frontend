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
  const maxOccupantRoom = Math.max(roomStats.red, roomStats.amber, roomStats.green);
  const thresholds = 8;

  let maxVariableColor = '';
  let textColor = 'text-white';

  if (roomStats.red === 0 && roomStats.amber === 0 && roomStats.green === 0) {
    maxVariableColor = 'bg-white';
    textColor = 'text-black';
  } else if (roomStats.red === roomStats.amber && roomStats.amber === roomStats.green) {
    maxVariableColor = 'bg-gradient-to-br from-[#FF0000] via-[#FEB019] to-[#008000]';
  } else if (roomStats.red === roomStats.amber && roomStats.red === maxOccupantRoom) {
    maxVariableColor = 'bg-gradient-to-br from-[#FF0000] to-[#FEB019]';
  } else if (roomStats.red === roomStats.green && roomStats.red === maxOccupantRoom) {
    maxVariableColor = 'bg-gradient-to-br from-[#FF0000] to-[#008000]';
  } else if (roomStats.amber === roomStats.green && roomStats.amber === maxOccupantRoom) {
    maxVariableColor = 'bg-gradient-to-br from-[#FEB019] to-[#008000]';
  } else if (maxOccupantRoom === roomStats.red) {
    maxVariableColor = 'bg-[#FF0000]';
  } else if (maxOccupantRoom === roomStats.amber) {
    maxVariableColor = 'bg-[#FEB019]';
  } else if (maxOccupantRoom === roomStats.green) {
    maxVariableColor = 'bg-[#008000]';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="!p-0 h-full">
        <div className=" h-full">
          <div className={classNames('h-full rounded-lg', maxVariableColor)}>
            <div className={classNames("text-xl font-semibold p-2", textColor)}>Maximum Occupant Room</div>
            <div className=" w-full h-full flex justify-center items-center">
              <p className={classNames('text-8xl', textColor)}>
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
        <Card className="!p-0 !h-[350px]">
          <h2 className=" text-xl font-semibold">Occupied Rooms</h2>
          {roomStats.rooms.length > 0 ?
            <div className=" mt-5">
              <div className="flex flex-wrap md:flex-nowrap gap-0 md:gap-3 w-full overflow-x-auto">
                {Array.from({ length: Math.ceil(roomStats.rooms.length / thresholds) }).map((_, columnIndex) => (
                  <ul className=" mb-0" key={columnIndex}>
                    {roomStats.rooms.slice(columnIndex * thresholds, (columnIndex + 1) * thresholds).map((room, index) => (
                      <li className="mb-[6px] w-64 flex flex-row gap-2 items-center" key={index}>
                        <div className={classNames('w-[6px] h-[6px] rounded-full', maxVariableColor)}></div>
                        {room.name}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div> :
            <div className=" w-full h-[250px] flex justify-center items-center">
              <p className=" font-semibold text-3xl">No Data Available</p>
            </div>
          }
        </Card>
      </div>
    </div>
  );
};

export default DevicesStats;
